import io
import os
import sys
import time
import requests
from PIL import Image, ImageDraw

# Pastikan UTF-8 encoding untuk output Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_separator(title):
    print("\n" + "=" * 60)
    print(f"[*] {title.upper()}")
    print("=" * 60)

def test_analyze_edge_cases():
    print_separator("Pengujian Kasus Batas (Edge Cases) API Analyze")
    
    test_cases = [
        ("Teks kosong string", "", [422]),
        ("Teks spasi saja", "     ", [400, 422]),
        ("Teks kurang dari 5 karakter ('hai')", "hai", [422]),
        ("Teks tepat 5 karakter ('Halo!')", "Halo!", [200]),
        ("Teks tepat 2000 karakter", "A" * 2000, [200]),
        ("Teks lebih dari 2000 karakter (2005)", "A" * 2005, [422]),
        ("XSS injection", "<script>alert('hack')</script> Halo selamat siang.", [200]),
        ("Emoji dan teks campuran", "Selamat! Anda menang Rp 10.000.000! Klaim di http://bit.ly/hadiah", [200]),
        ("Karakter Unicode dan simbol asing", "Permisi apakah tugas web sudah selesai?", [200]),
    ]

    for name, text_input, expected_status in test_cases:
        res = requests.post(f"{BASE_URL}/analyze", json={"text": text_input})
        status_ok = res.status_code in expected_status
        status_icon = "[OK]" if status_ok else "[FAIL]"
        print(f"{status_icon} [{name}] Status: {res.status_code} (Diharapkan: {expected_status})")
        if not status_ok:
            print(f"   Response: {res.text}")

def test_business_logic_and_risk_harmony():
    print_separator("Pengujian Logika Bisnis & Keselarasan Penilaian Risiko")

    scenarios = [
        {
            "name": "Pesan Normal Murni (Dosen)",
            "text": "Halo teman-teman, jangan lupa besok ada praktikum Pemrograman Web pukul 08.00 di laboratorium. Silakan bawa laptop.",
            "expected_label": "Normal",
            "expected_risk": "rendah",
            "max_indicators": 0
        },
        {
            "name": "Pesan Promosi Resmi Diskon",
            "text": "Dapatkan diskon 50% untuk semua menu kopi favoritmu hari ini hanya di gerai resmi Kopi Kenangan terdekat!",
            "expected_label": "Promosi",
            "expected_risk": "rendah",
            "max_indicators": 1
        },
        {
            "name": "Pesan Penipuan APK Kurir (Scam Jelas)",
            "text": "Paket Anda sedang tertahan di gudang J&T. Silakan install file resi.apk berikut untuk melacak paket segera!",
            "expected_label": "Scam",
            "expected_risk": "tinggi",
            "min_indicators": 1
        },
        {
            "name": "Pesan Ambigu Sensitif (Safety-First PRD Bab 25)",
            "text": "Jangan pernah berikan kode OTP atau PIN Anda kepada siapa pun termasuk pihak bank yang menelepon.",
            "expected_label_in": ["Normal", "Promosi"],
            "expected_risk_min": "sedang",  # Karena memuat OTP/PIN, sistem harus waspada
            "min_indicators": 1
        }
    ]

    for sc in scenarios:
        start_t = time.time()
        res = requests.post(f"{BASE_URL}/analyze", json={"text": sc["text"]})
        elapsed = round((time.time() - start_t) * 1000, 1)

        if res.status_code != 200:
            print(f"❌ [{sc['name']}] Gagal memanggil API: {res.status_code} - {res.text}")
            continue

        data = res.json()
        label = data["classification"]["label"]
        conf = data["classification"]["confidence"]
        risk = data["risk_assessment"]["level"]
        indicators = data["social_engineering_indicators"]
        lime_words = [c["token"] for c in (data["explanation"]["contributions"] or [])]

        label_ok = (label == sc.get("expected_label")) if "expected_label" in sc else (label in sc.get("expected_label_in", []))
        risk_ok = True
        if "expected_risk" in sc:
            risk_ok = (risk.lower() == sc["expected_risk"].lower())
        elif "expected_risk_min" in sc:
            risk_ok = risk.lower() in [sc["expected_risk_min"].lower(), "tinggi"]

        all_ok = label_ok and risk_ok
        icon = "[OK]" if all_ok else "[WARN]"

        print(f"{icon} [{sc['name']}] (Latensi: {elapsed}ms)")
        print(f"   Label: {label} (Conf: {conf:.2%}) | Risk: {risk} | Indikator: {len(indicators)} terdeteksi")
        print(f"   LIME Top Tokens: {lime_words[:4]}")
        if not label_ok:
            print(f"   [WARN] Perhatian: Label aktual ({label}) berbeda dari ekspektasi ({sc.get('expected_label')})")
        if not risk_ok:
            print(f"   [WARN] Perhatian: Risk aktual ({risk}) berbeda dari ekspektasi ({sc.get('expected_risk')})")

def test_ocr_edge_cases():
    print_separator("Pengujian Kasus Batas (Edge Cases) API OCR Image")

    # 1. Non-image file upload
    res = requests.post(
        f"{BASE_URL}/analyze-image",
        files={"file": ("dokumen.txt", b"Ini adalah file teks bukan gambar", "text/plain")}
    )
    status_ok = res.status_code in [400, 422]
    print(f"{'[OK]' if status_ok else '[FAIL]'} [File Non-Gambar (text/plain)] Ditolak dengan kode {res.status_code}")

    # 2. Corrupt / 0 byte image
    res = requests.post(
        f"{BASE_URL}/analyze-image",
        files={"file": ("corrupt.png", b"GIF89a corrupted header", "image/png")}
    )
    status_ok = res.status_code in [400, 422]
    print(f"{'[OK]' if status_ok else '[FAIL]'} [Gambar Rusak/Corrupt] Ditolak dengan kode {res.status_code}")

    # 3. Gambar putih polos tanpa teks (Empty text)
    img_blank = Image.new("RGB", (300, 100), color=(255, 255, 255))
    buf_blank = io.BytesIO()
    img_blank.save(buf_blank, format="PNG")
    res = requests.post(
        f"{BASE_URL}/analyze-image",
        files={"file": ("blank.png", buf_blank.getvalue(), "image/png")}
    )
    status_ok = res.status_code == 422
    print(f"{'[OK]' if status_ok else '[FAIL]'} [Gambar Polos Tanpa Teks] Ditolak ramah: {res.status_code} ({res.json().get('error_code')})")

    # 4. Gambar valid berisi teks nyata
    img_text = Image.new("RGB", (600, 150), color=(255, 255, 255))
    d = ImageDraw.Draw(img_text)
    d.text((30, 60), "Halo ini adalah tes ekstraksi pesan aman.", fill=(0, 0, 0))
    buf_text = io.BytesIO()
    img_text.save(buf_text, format="PNG")
    res = requests.post(
        f"{BASE_URL}/analyze-image",
        files={"file": ("test_text.png", buf_text.getvalue(), "image/png")}
    )
    status_ok = res.status_code == 200 and "Halo" in res.json().get("ocr_result", {}).get("extracted_text", "")
    print(f"{'[OK]' if status_ok else '[FAIL]'} [Gambar Valid dengan Teks] Ekstraksi sukses: {res.status_code}")
    if status_ok:
        print(f"   Hasil: '{res.json()['ocr_result']['extracted_text']}' (Conf: {res.json()['ocr_result']['confidence']})")

if __name__ == "__main__":
    test_analyze_edge_cases()
    test_business_logic_and_risk_harmony()
    test_ocr_edge_cases()
    print("\n🏁 Seluruh rangkaian pengujian API & Logika selesai dijalankan.")
