import requests

url = "http://127.0.0.1:8000/api/v1/analyze-image"

with open("backend/data/sample_images/sample_chat_scam.png", "rb") as f1:
    res1 = requests.post(url, files={"file": ("scam.png", f1, "image/png")}).json()
    print("=== 1. SCAM OCR RESULT ===")
    print(res1["ocr_result"]["extracted_text"])

with open(r"C:\Users\ASUS TUF\.gemini\antigravity-ide\brain\a87ec8b6-18f2-4f46-9a13-9878dc5b8499\.user_uploaded\media_1791716225307.png", "rb") as f2:
    res2 = requests.post(url, files={"file": ("dosen.png", f2, "image/png")}).json()
    print("\n=== 2. DOSEN OCR RESULT ===")
    print(res2["ocr_result"]["extracted_text"])
