from typing import List, Optional
from pydantic import BaseModel, Field

class OcrExtractionData(BaseModel):
    extracted_text: str = Field(..., description="Teks hasil ekstraksi OCR dari gambar screenshot")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0, description="Rata-rata tingkat keyakinan karakter OCR")
    requires_review: bool = Field(default=True, description="Selalu bernilai True sesuai prinsip integritas PRD Bab 24.2")
    word_count: int = Field(default=0, ge=0, description="Jumlah kata yang berhasil diekstraksi")

class OcrResponse(BaseModel):
    request_status: str = Field(default="ocr_extracted", description="Status hasil ekstraksi OCR")
    ocr_result: OcrExtractionData = Field(..., description="Data hasil ekstraksi teks dan metrik kualitas")
    warnings: List[str] = Field(
        default_factory=lambda: [
            "Hasil OCR dapat tidak akurat. Periksa dan perbaiki teks sebelum melanjutkan analisis (PRD Bab 24.2)."
        ],
        description="Peringatan keselamatan data dan anjuran pemeriksaan manual"
    )
