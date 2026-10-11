import re

def normalize_text(text: str) -> str:
    """
    Normalisasi teks konsisten untuk tahap training dan inference (PRD Bab 16.3 & 19.1)
    """
    if not text:
        return ""
    
    # Trim whitespace
    cleaned = text.strip()
    
    # Hapus spasi berlebih
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    return cleaned

def extract_urls(text: str) -> list[str]:
    """Ekstraksi URL dari teks untuk deteksi tautan palsu / domain mencurigakan"""
    url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[/\w\-._~:?#[\]@!$&\'()*+,;=]*'
    return re.findall(url_pattern, text)
