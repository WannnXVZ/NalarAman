import io
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw
from app.main import app

client = TestClient(app)

def test_analyze_image_endpoint():
    # 1. Generate test image with text
    img = Image.new("RGB", (400, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((20, 35), "Selamat pagi bapak dosen", fill=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    # 2. Upload to /api/v1/analyze-image
    response = client.post(
        "/api/v1/analyze-image",
        files={"file": ("screenshot.jpg", buf, "image/jpeg")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["request_status"] == "ocr_extracted"
    assert "extracted_text" in data["ocr_result"]
    assert "Selamat pagi" in data["ocr_result"]["extracted_text"]
    assert data["ocr_result"]["requires_review"] is True
    assert len(data["warnings"]) > 0
    print("\nOCR test passed! Extracted text:", data["ocr_result"]["extracted_text"])

def test_analyze_image_invalid_mime():
    response = client.post(
        "/api/v1/analyze-image",
        files={"file": ("malicious.exe", b"fake binary", "application/x-msdownload")}
    )
    assert response.status_code == 400
    assert response.json()["error_code"] == "INVALID_INPUT"
