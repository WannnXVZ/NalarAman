from app.services.risk_assessment_service import assess_risk
from app.schemas.analyze_response import SocialEngineeringIndicator

def test_safety_first_on_sensitive_credential():
    # Kasus ambigu: model mungkin memprediksi Normal, tapi ada permintaan OTP
    indicators = [
        SocialEngineeringIndicator(
            indicator="Permintaan Informasi Kredensial Sensitif",
            description="Meminta kode OTP 6 digit",
            basis="rule-based"
        )
    ]
    assessment = assess_risk(label="Normal", confidence=0.80, indicators=indicators)
    # Prinsip kehati-hatian PRD Bab 23.3: Wajib berisiko Tinggi
    assert assessment.level == "tinggi"
    assert "sinyal bahaya kritis" in assessment.basis

def test_normal_message_low_risk():
    assessment = assess_risk(label="Normal", confidence=0.95, indicators=[])
    assert assessment.level == "rendah"

def test_promo_with_urgency_medium_risk():
    indicators = [
        SocialEngineeringIndicator(
            indicator="Urgensi & Tekanan Waktu",
            description="Promo hanya berlaku 1 jam",
            basis="rule-based"
        )
    ]
    assessment = assess_risk(label="Promosi", confidence=0.90, indicators=indicators)
    assert assessment.level == "sedang"
