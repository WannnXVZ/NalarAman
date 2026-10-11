from fastapi import APIRouter, HTTPException, status
from app.schemas.analyze_request import AnalyzeRequest
from app.schemas.analyze_response import AnalyzeResponse
from app.services.preprocessing import normalize_text
from app.services.classification_service import classify_message
from app.services.pattern_detection_service import detect_social_engineering_patterns
from app.services.risk_assessment_service import assess_risk
from app.services.explainability_service import explain_prediction
from app.core.logging import logger

router = APIRouter(prefix="/analyze", tags=["Analysis"])

@router.post("", response_model=AnalyzeResponse)
async def analyze_message(request: AnalyzeRequest):
    """
    Endpoint orkestrasi pipeline analisis teks (PRD Bab 17.2):
    1. Preprocessing & Normalisasi
    2. Klasifikasi Model (Normal, Scam, Promosi)
    3. Deteksi Pola Social Engineering
    4. Penilaian Risiko Berbasis Aturan
    5. Explainable AI (LIME)
    """
    raw_text = request.text.strip()
    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teks pesan tidak boleh kosong."
        )

    # 1. Preprocessing
    normalized_text = normalize_text(raw_text)

    # 2. Klasifikasi Pesan
    classification = classify_message(normalized_text)

    # 3. Deteksi Pola Social Engineering
    indicators = detect_social_engineering_patterns(normalized_text)

    # 4. Penilaian Risiko
    risk_assessment = assess_risk(
        label=classification.label,
        confidence=classification.confidence,
        indicators=indicators
    )

    # 5. Explainable AI (LIME)
    explanation = explain_prediction(normalized_text, classification.label)

    # Peringatan etika dan pembatasan ilmiah (PRD Bab 34)
    warnings = [
        "Hasil ini adalah alat bantu analisis pendukung keputusan dan bukan jaminan mutlak.",
        "Selalu lakukan verifikasi melalui saluran resmi instansi atau perbankan terkait."
    ]

    logger.info(f"Analysis completed: label={classification.label}, risk={risk_assessment.level}, indicators={len(indicators)}")

    return AnalyzeResponse(
        request_status="success",
        classification=classification,
        social_engineering_indicators=indicators,
        risk_assessment=risk_assessment,
        explanation=explanation,
        warnings=warnings
    )
