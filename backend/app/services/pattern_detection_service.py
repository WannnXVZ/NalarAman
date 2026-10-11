import re
from typing import List
from app.schemas.analyze_response import SocialEngineeringIndicator
from app.services.preprocessing import extract_urls

def detect_social_engineering_patterns(text: str) -> List[SocialEngineeringIndicator]:
    """
    Deteksi 8 indikator pola rekayasa sosial berbasis aturan teruji (PRD Bab 21 & Bab 18.2).
    """
    indicators: List[SocialEngineeringIndicator] = []
    text_lower = text.lower()

    # 1. Urgensi & Tekanan Waktu
    urgency_regex = r'(segera|dalam\s+\d+\s*(jam|menit|hari)|batas\s+waktu|sebelum\s+hangus|kadaluarsa|sekarang\s+juga|cepat|urgent|jangan\s+tunda)'
    if re.search(urgency_regex, text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Urgensi & Tekanan Waktu",
            description="Pesan memanfaatkan tekanan batas waktu yang mendesak untuk memicu kepanikan agar korban bertindak tanpa verifikasi.",
            basis="rule-based (regex & keyword heuristic)"
        ))

    # 2. Iming-iming Hadiah / Keuntungan Tidak Wajar
    reward_regex = r'(selamat\b.*(menang|undian|hadiah|jackpot)|rp\s*[\d.,]{6,}|bonus\s+tunai|klaim\s+dana|saldo\s+gratis|dana\s+kaget|komisi\s+\d+)'
    if re.search(reward_regex, text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Iming-iming Hadiah / Keuntungan Tidak Wajar",
            description="Pesan menawarkan hadiah uang tunai besar, undian, atau keuntungan komisi tidak wajar tanpa partisipasi yang sah.",
            basis="rule-based (lexicon matching)"
        ))

    # 3. Ancaman & Pemblokiran / Konsekuensi Negatif
    threat_regex = r'(blokir|diblokir|penangguhan\s+akun|sanksi|denda|tindakan\s+hukum|pembekuan|surat\s+tilang|ditutup\s+permanen)'
    if re.search(threat_regex, text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Ancaman / Konsekuensi Negatif",
            description="Mengancam pemblokiran akun, sanksi hukum, atau denda untuk menekan psikologis penerima pesan.",
            basis="rule-based (regex)"
        ))

    # 4. Penyebaran Berkas Berbahaya (Modus APK)
    if re.search(r'\.(apk|exe|scr|bat|vbs)\b', text_lower) or re.search(r'undangan.*\.apk|resi.*\.apk|surat.*\.apk', text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Penyebaran Berkas Berbahaya (Modus APK)",
            description="Menyertakan file instalasi aplikasi Android (.apk) yang berisiko malware penyadap SMS perbankan & kode OTP.",
            basis="rule-based (file extension heuristic)"
        ))

    # 5. Permintaan Informasi Kredensial Sensitif
    sensitive_regex = r'(otp|pin\b|password|kata\s+sandi|cvv|nomor\s+kartu|kode\s+verifikasi|6\s*digit|nomor\s+rekening)'
    if re.search(sensitive_regex, text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Permintaan Informasi Kredensial Sensitif",
            description="Meminta data rahasia perbankan atau kode verifikasi (OTP/PIN/CVV) yang seharusnya tidak boleh dibagikan kepada siapapun.",
            basis="rule-based"
        ))

    # 6. Tautan / Domain Mencurigakan & Pemendek URL
    urls = extract_urls(text)
    suspicious_tlds = ['.xyz', '.top', '.live', '.site', '.club', '.online', '.vip', '.info', '.cc', '.space', '.work']
    shorteners = ['bit.ly', 'tinyurl.com', 's.id', 'cutt.ly', 'is.gd', 't.me']
    has_suspicious_domain = any(any(tld in u.lower() for tld in suspicious_tlds) for u in urls)
    has_shortener = any(any(short in u.lower() for short in shorteners) for u in urls)
    
    if has_suspicious_domain or has_shortener or (urls and re.search(r'(klaim|hadiah|dana|bantuan|bansos|brimo|bca|mandiri|bni)', urls[0].lower())):
        indicators.append(SocialEngineeringIndicator(
            indicator="Tautan / Domain Mencurigakan",
            description="Tautan menggunakan domain tidak lazim, URL shortener tersembunyi, atau menyerupai portal resmi perbankan/pemerintah.",
            basis="rule-based (domain heuristic)"
        ))

    # 7. Penyamaran Identitas Institusi Resmi (Impersonation)
    impersonate_regex = r'(ojk|kpk|polda|kejaksaan|bank\s+indonesia|bank\s+(bca|bri|bni|mandiri)|customer\s+service|tim\s+undian|admin\s+resmi)'
    if re.search(impersonate_regex, text_lower) and ('klaim' in text_lower or 'verifikasi' in text_lower or 'blokir' in text_lower or 'hadiah' in text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Penyamaran Identitas Pihak Tepercaya (Impersonation)",
            description="Mengatasnamakan institusi terpercaya (bank, regulator, atau kepolisian) untuk menciptakan ilusi otoritas resmi.",
            basis="rule-based (context heuristic)"
        ))

    # 8. Modus Krisis Keluarga / Keuangan Mendesak
    family_distress_regex = r'(papa|mama|ibu|ayah|anak\s+anda).*(kecelakaan|rumah\s+sakit|kantor\s+polisi|kirim\s+pulsa|transfer\s+uang|darurat)'
    if re.search(family_distress_regex, text_lower):
        indicators.append(SocialEngineeringIndicator(
            indicator="Krisis Keluarga / Masalah Mendesak Palsu",
            description="Memanipulasi rasa panik atas kondisi darurat keluarga/kerabat untuk meminta transfer dana atau pulsa secara kilat.",
            basis="rule-based (contextual matching)"
        ))

    return indicators
