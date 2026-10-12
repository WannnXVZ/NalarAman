import time
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.ocr_response import OcrResponse
from app.services.ocr_service import ocr_service
from app.core.exceptions import AppException

router = APIRouter(prefix="/analyze-image", tags=["Analysis"])
logger = logging.getLogger("nalaraman")

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB (PRD Bab 26)
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

@router.post("", response_model=OcrResponse)
async def analyze_image_endpoint(file: UploadFile = File(...)) -> OcrResponse:
    """
    Ekstraksi teks dari gambar screenshot pesan menggunakan Tesseract OCR (PRD Bab 17.3 & 24).
    Teks hasil ekstraksi wajib dikonfirmasi/diedit pengguna sebelum dikirim ke pipeline analisis.
    """
    start_time = time.time()

    # 1. Validasi Tipe Konten MIME
    content_type = file.content_type or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise AppException(
            status_code=400,
            error_code="INVALID_INPUT",
            message=f"Format file tidak didukung: '{content_type}'. Harap unggah gambar format JPG, PNG, atau WebP.",
            detail={"allowed_types": ALLOWED_MIME_TYPES, "provided": content_type}
        )

    # 2. Baca bytes gambar & Validasi Ukuran (PRD Bab 26)
    try:
        image_bytes = await file.read()
    except Exception as e:
        raise AppException(
            status_code=400,
            error_code="INVALID_INPUT",
            message="Gagal membaca berkas gambar yang diunggah.",
            detail=str(e)
        )

    if len(image_bytes) == 0:
        raise AppException(
            status_code=400,
            error_code="INVALID_INPUT",
            message="File gambar kosong (0 byte)."
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise AppException(
            status_code=400,
            error_code="INVALID_INPUT",
            message=f"Ukuran gambar ({len(image_bytes) // 1024} KB) melebihi batas maksimal 5 MB.",
            detail={"max_bytes": MAX_FILE_SIZE, "actual_bytes": len(image_bytes)}
        )

    # 3. Jalankan Ekstraksi OCR
    try:
        response = ocr_service.extract_text(image_bytes, content_type)
        elapsed_ms = round((time.time() - start_time) * 1000)
        
        # Logging privasi aman (tanpa mencatat isi teks pengguna, PRD Bab 26)
        logger.info(
            f"OCR completed: words={response.ocr_result.word_count}, "
            f"confidence={response.ocr_result.confidence}, elapsed={elapsed_ms}ms"
        )
        return response
    except AppException:
        raise
    except Exception as e:
        logger.error(f"OCR unexpected error: {e}")
        raise AppException(
            status_code=500,
            error_code="INTERNAL_ERROR",
            message="Terjadi kesalahan internal saat pemrosesan OCR gambar.",
            detail=str(e)
        )
    finally:
        # Hapus referensi memori sementara gambar segera setelah selesai (PRD Bab 26)
        del image_bytes
