from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_scam_message():
    payload = {
        "text": "Selamat! No WhatsApp Anda memenangkan GEBYAR UNDIAN Rp 50.000.000 dari BRImo. Segera klaim dana dalam 1 jam melalui link: http://hadiah-brimo.xyz"
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["request_status"] == "success"
    assert data["classification"]["label"] == "Scam"
    assert data["risk_assessment"]["level"] == "tinggi"
    assert len(data["social_engineering_indicators"]) >= 1
    assert data["explanation"]["method"] == "LIME"

def test_analyze_empty_message():
    payload = {"text": "   "}
    response = client.post("/api/v1/analyze", json=payload)
    # Pydantic validation fails min_length or custom check
    assert response.status_code in [400, 422]
