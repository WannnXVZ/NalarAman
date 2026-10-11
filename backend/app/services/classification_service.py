from typing import Literal
from app.schemas.analyze_response import ClassificationResult
from app.ml.model_loader import model_manager

def classify_message(text: str) -> ClassificationResult:
    """
    Melakukan inferensi klasifikasi teks (Normal, Scam, Promosi).
    Menggunakan model machine learning aktual yang telah dilatih (PRD Bab 20 & 31).
    """
    if model_manager.is_ready:
        label_raw, confidence = model_manager.predict(text)
        # Pastikan format label valid (Normal, Scam, Promosi)
        label: Literal["Normal", "Scam", "Promosi"] = "Normal"
        if label_raw in ["Normal", "Scam", "Promosi"]:
            label = label_raw  # type: ignore

        return ClassificationResult(
            label=label,
            confidence=confidence
        )

    # Fallback jika model belum siap dimuat
    return ClassificationResult(
        label="Normal",
        confidence=0.50
    )
