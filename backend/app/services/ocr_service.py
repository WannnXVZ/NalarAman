import os
import io
import re
import logging
from typing import Optional, List
import numpy as np
from PIL import Image, ImageEnhance
from app.schemas.ocr_response import OcrExtractionData, OcrResponse
from app.core.exceptions import AppException
from app.services.preprocessing import restore_word_boundaries

logger = logging.getLogger("nalaraman")

# Model Latin/English yang secara khusus dioptimalkan untuk karakter berbasis alfabet latin dan spasi antar-kata
EN_REC_MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "..", "ml", "ocr_models", "en_PP-OCRv3_rec_infer.onnx"
)

# Inisialisasi RapidOCR berbasis ONNX Runtime (tanpa dependensi binary eksternal C++)
try:
    from rapidocr_onnxruntime import RapidOCR
    if os.path.exists(EN_REC_MODEL_PATH):
        rapid_engine = RapidOCR(rec_model_path=EN_REC_MODEL_PATH)
        logger.info(f"[OcrService] Mesin RapidOCR (Latin/English ONNX) berhasil dimuat dari {EN_REC_MODEL_PATH}.")
    else:
        rapid_engine = RapidOCR()
        logger.info("[OcrService] Mesin RapidOCR default berhasil diinisialisasi.")
    HAS_RAPID_OCR = True
except Exception as e:
    rapid_engine = None
    HAS_RAPID_OCR = False
    logger.warning(f"[OcrService] Gagal memuat RapidOCR: {e}")

class OcrService:
    def __init__(self):
        self.engine = rapid_engine
        self.is_ready = HAS_RAPID_OCR

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        Pra-pemrosesan gambar tangkapan layar chat (WhatsApp, Telegram, SMS)
        untuk memaksimalkan akurasi pengenalan teks:
        - Konversi ke RGB
        - Penskalaan resolusi jika lebar < 1200px agar kontur huruf halus & tajam
        - Penajaman kontur huruf (Sharpening filter)
        - Peningkatan kontras ringan
        """
        if image.mode != "RGB":
            image = image.convert("RGB")

        w, h = image.size
        scale = max(1.0, 1200.0 / float(w))
        target_w = int(w * scale)
        target_h = int(h * scale)
        if scale > 1.0:
            image = image.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Penajaman kontur huruf
        sharpener = ImageEnhance.Sharpness(image)
        image = sharpener.enhance(1.3)

        # Peningkatan kontras ringan
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.1)

        return image

    def clean_ocr_line(self, text: str) -> str:
        """
        Memperbaiki anomali khas hasil OCR teks percakapan bahasa Indonesia:
        - Pemisahan tanda baca yang menempel ke huruf berikutnya ('teman-teman,jangan' -> 'teman-teman, jangan')
        - Penggabungan suku kata / awalan bahasa Indonesia yang terpotong spasi ('Se lamat' -> 'Selamat', 'me me nangkan' -> 'memenangkan')
        - Koreksi nama aplikasi perbankan ('BRI mo' / 'BRlmo' -> 'BRImo')
        - Pemulihan format protokol URL ('httpx/' -> 'http://')
        - Segmentasi kata majemuk yang menempel rapat
        """
        # 1. Pulihkan batas kata yang menempel jika ada
        text = restore_word_boundaries(text)

        # 2. Spasi setelah tanda baca (koma, titik dua, tanda seru/tanya) yang diikuti huruf
        text = re.sub(r'([,;!?])([A-Za-z])', r'\1 \2', text)
        text = re.sub(r'(\.)([A-Z])', r'\1 \2', text)

        # 3. Perbaikan suku kata terpotong yang sering muncul di OCR
        text = re.sub(r'\b[Ss]e\s+lamat\b', 'Selamat', text)
        text = re.sub(r'\b[Mm]e\s+me\s+nangkan\b', 'memenangkan', text)
        text = re.sub(r'\b[Mm]e\s+lalui\b', 'melalui', text)
        text = re.sub(r'\b[Bb]er\s+ikut\b', 'berikut', text)
        text = re.sub(r'\b[Bb]er\s+ikutnya\b', 'berikutnya', text)
        text = re.sub(r'\b[Kk]e\s+pada\b', 'kepada', text)
        text = re.sub(r'\b[Ss]e\s+belum\b', 'sebelum', text)
        text = re.sub(r'\b[Tt]er\s+sebut\b', 'tersebut', text)
        text = re.sub(r'\b[Dd]i\s+lakukan\b', 'dilakukan', text)
        text = re.sub(r'\b[Pp]e\s+ningkatan\b', 'peningkatan', text)
        text = re.sub(r'\b[Bb]esok\s+ada\b', 'besok ada', text)
        text = re.sub(r'\bWhats\s+App\b', 'WhatsApp', text, flags=re.IGNORECASE)
        text = re.sub(r'\bpeni\s+puan\b', 'penipuan', text, flags=re.IGNORECASE)
        text = re.sub(r'\bberi\s+kan\b', 'berikan', text, flags=re.IGNORECASE)

        # 4. Perbaikan entitas & istilah perbankan
        text = re.sub(r'\bBRI\s+mo\b', 'BRImo', text)
        text = re.sub(r'\bBRlmo\b', 'BRImo', text)
        text = re.sub(r'\bInfo\s+Pesmi\b', 'Info Resmi', text)

        # 5. Perbaikan typo umum pada tautan URL dan protokol
        text = re.sub(r'\bhttpx?/', 'http://', text)
        text = re.sub(r'https?\s*:\s*//', 'http://', text)
        text = re.sub(r'(\d+)\s*\.\s*xyz', r'\1.xyz', text)

        # 6. Hapus spasi ganjil sebelum tanda baca
        text = re.sub(r'\s+([!?,:;])', r'\1', text)

        # Hapus spasi ganda berlebih
        return re.sub(r'\s+', ' ', text).strip()

    def extract_text(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> OcrResponse:
        """
        Mengekstrak teks nyata dari gambar tangkapan layar (PRD Bab 24).
        Memastikan penghapusan memori sementara segera setelah OCR selesai (PRD Bab 26).
        """
        # Validasi ukuran gambar (Maks 5 MB)
        max_size_bytes = 5 * 1024 * 1024
        if len(image_bytes) > max_size_bytes:
            raise AppException(
                status_code=400,
                error_code="INVALID_INPUT",
                message="Ukuran gambar melebihi batas maksimum 5 MB.",
                detail={"size_bytes": len(image_bytes), "max_bytes": max_size_bytes}
            )

        # Validasi format gambar
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            # Buka kembali untuk pemrosesan setelah verify()
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise AppException(
                status_code=422,
                error_code="INVALID_INPUT",
                message="File gambar tidak valid atau rusak.",
                detail=str(e)
            )

        if not self.is_ready or self.engine is None:
            raise AppException(
                status_code=500,
                error_code="OCR_NOT_READY",
                message="Mesin OCR belum siap di server. Silakan coba sesaat lagi atau gunakan input teks langsung."
            )

        try:
            # Pra-pemrosesan
            processed_img = self.preprocess_image(image)
            img_np = np.array(processed_img)

            # Ekstraksi menggunakan RapidOCR
            ocr_result, elapse = self.engine(img_np)

            if not ocr_result:
                raise AppException(
                    status_code=422,
                    error_code="OCR_FAILED",
                    message="OCR tidak mendeteksi teks apa pun dalam gambar. Pastikan screenshot memuat percakapan atau teks yang jelas.",
                    detail={"reason": "no_text_detected"}
                )

            detected_lines: List[str] = []
            confidences: List[float] = []

            for item in ocr_result:
                if not item or len(item) < 3:
                    continue
                # item: [box_coordinates, text_str, confidence_float]
                text_part = str(item[1]).strip()
                conf_part = float(item[2])
                if text_part:
                    cleaned_line = self.clean_ocr_line(text_part)
                    detected_lines.append(cleaned_line)
                    confidences.append(conf_part)

            if not detected_lines:
                raise AppException(
                    status_code=422,
                    error_code="OCR_FAILED",
                    message="OCR tidak mendeteksi teks yang dapat dibaca dalam gambar.",
                    detail={"reason": "empty_lines"}
                )

            extracted_text = "\n".join(detected_lines)
            avg_confidence = round(sum(confidences) / len(confidences), 2) if confidences else 0.85

        except AppException:
            raise
        except Exception as e:
            logger.error(f"[OcrService] Eksekusi OCR gagal: {e}")
            raise AppException(
                status_code=422,
                error_code="OCR_FAILED",
                message="Terjadi kendala saat memproses gambar OCR. Silakan periksa gambar atau gunakan input teks manual.",
                detail=str(e)
            )

        clean_extracted = extracted_text.strip()
        word_count = len(clean_extracted.split())

        warnings = [
            "Hasil OCR dapat tidak akurat. Periksa dan perbaiki teks sebelum melanjutkan analisis (PRD Bab 24.2).",
            "Pastikan nomor telepon pribadi atau data sensitif yang tidak relevan dihapus sebelum dianalisis."
        ]

        return OcrResponse(
            request_status="ocr_extracted",
            ocr_result=OcrExtractionData(
                extracted_text=clean_extracted,
                confidence=avg_confidence,
                requires_review=True,
                word_count=word_count
            ),
            warnings=warnings
        )

ocr_service = OcrService()

