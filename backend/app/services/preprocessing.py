import os
import re

# Kamus kata umum dan istilah penipuan/percakapan Indonesia untuk segmentasi kata menempel
INDONESIAN_CORE_VOCAB = {
    'peringatan', 'darurat', 'akun', 'anda', 'terdeteksi', 'melakukan', 'aktivitas', 'ilegal',
    'kami', 'dari', 'tim', 'keamanan', 'pusat', 'menginformasikan', 'bahwa', 'terindikasi',
    'pelanggaran', 'serius', 'dan', 'akan', 'dinonaktifkan', 'permanen', 'dalam', 'menit',
    'jam', 'hari', 'seluruh', 'akses', 'data', 'layanan', 'berpotensi', 'diblokir', 'tanpa',
    'pemberitahuan', 'lebih', 'lanjut', 'segera', 'lakukan', 'verifikasi', 'sekarang', 'jika',
    'mengabaikan', 'pesan', 'ini', 'sistem', 'menganggap', 'sebagai', 'pihak', 'yang',
    'bertanggung', 'jawab', 'atas', 'mencurigakan', 'tersebut', 'jangan', 'tutup', 'tunda',
    'status', 'sedang', 'pemeriksaan', 'hadiah', 'undian', 'menang', 'klaim', 'uang', 'tunai',
    'jutaan', 'rupiah', 'nomor', 'whatsapp', 'terpilih', 'gebyar', 'klik', 'link', 'tautan',
    'sebelum', 'hangus', 'paket', 'kurir', 'surat', 'tilang', 'undangan', 'pernikahan', 'file',
    'dokumen', 'apk', 'buka', 'unduh', 'instal', 'install', 'bank', 'bca', 'bri', 'bni',
    'mandiri', 'brimo', 'livin', 'dana', 'ovo', 'gopay', 'shopeepay', 'otp', 'pin', 'cvv',
    'password', 'kata', 'sandi', 'transfer', 'rekening', 'transaksi', 'saldo', 'halo', 'teman',
    'besok', 'ada', 'praktikum', 'pemrograman', 'web', 'pukul', 'laboratorium', 'komputer',
    'silakan', 'bawa', 'membawa', 'laptop', 'menyelesaikan', 'tugas', 'sudah', 'diberikan',
    'pertanyaan', 'kita', 'bisa', 'berdiskusi', 'grup', 'kelas', 'terima', 'kasih', 'info',
    'resmi', 'promo', 'diskon', 'belanja', 'voucher', 'cashback', 'khusus', 'hanya', 'hari',
    'memenangkan', 'menangkan', 'dilakukan', 'dinyatakan', 'berikutnya', 'dialihkan',
    'kesempatan', 'terbatas', 'berlaku', 'kedepan', 'menyesal', 'terlambat', 'pemenang',
    'konfirmasi', 'berikut'
}

# Muat leksikon bahasa Indonesia lengkap jika file kata_dasar_indonesia.txt tersedia
_lexicon_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "lexicon", "kata_dasar_indonesia.txt")
if os.path.exists(_lexicon_path):
    try:
        with open(_lexicon_path, "r", encoding="utf-8") as _f:
            for _line in _f:
                _w = _line.strip().lower()
                if _w and len(_w) >= 2:
                    INDONESIAN_CORE_VOCAB.add(_w)
    except Exception:
        pass

def segment_compound_word(word: str) -> str:
    """
    Memecah kata majemuk yang menempel tanpa spasi menggunakan Dynamic Programming
    berdasarkan kamus kosakata bahasa Indonesia (misal: 'AKUNANDATERDETEKSI' -> 'AKUN ANDA TERDETEKSI').
    """
    clean_w = re.sub(r'[^A-Za-z]', '', word)
    if len(clean_w) < 7:
        return word
    
    s = clean_w.lower()
    if s in INDONESIAN_CORE_VOCAB:
        return word

    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    parent = [-1] * (n + 1)

    for i in range(1, n + 1):
        for j in range(max(0, i - 20), i):
            if dp[j] and s[j:i] in INDONESIAN_CORE_VOCAB:
                dp[i] = True
                parent[i] = j
                break

    if dp[n]:
        # Rekonstruksi kata yang terpisah sesuai casing aslinya
        parts = []
        curr = n
        while curr > 0:
            prev = parent[curr]
            parts.append(clean_w[prev:curr])
            curr = prev
        parts.reverse()
        segmented = ' '.join(parts)
        # Jika ada simbol non-alfabet yang menempel di ujung kata, satukan kembali
        return word.replace(clean_w, segmented)

    return word

def restore_word_boundaries(text: str) -> str:
    """
    Memulihkan spasi dan batas kata yang hilang akibat kompresi OCR atau format teks:
    1. Memisahkan tanda baca yang diikuti langsung oleh huruf (contoh: 'halo,teman' -> 'halo, teman').
    2. Menjaga URL (http://, https://) dan entitas seperti WhatsApp/BRImo agar tidak rusak.
    3. Mengurai kata-kata majemuk yang menempel rapat via Dynamic Programming leksikon KBBI.
    """
    if not text:
        return ""

    res = text
    # 1. Lindungi URL sebelum normalisasi tanda baca
    urls = extract_urls(res)
    url_placeholders = {}
    for idx, u in enumerate(urls):
        ph = f"__URL_PLACEHOLDER_{idx}__"
        url_placeholders[ph] = u
        res = res.replace(u, ph)

    # 2. Spasi setelah tanda baca jika diikuti langsung oleh huruf/angka (tanpa spasi sebelum tanda baca)
    res = re.sub(r'([,;:!?])([A-Za-z0-9])', r'\1 \2', res)

    # 3. Lindungi entitas populer dari pemisahan camelCase
    protected_tokens = {"whatsapp", "brimo", "gopay", "shopeepay", "dana", "ovo", "bca", "bri", "bni"}
    tokens = res.split()
    segmented_tokens = []
    for tok in tokens:
        clean_tok = re.sub(r'[^A-Za-z]', '', tok).lower()
        if clean_tok in protected_tokens:
            segmented_tokens.append(tok)
            continue
        segmented_tokens.append(segment_compound_word(tok))

    res = ' '.join(segmented_tokens)

    # 4. Kembalikan URL asli
    for ph, u in url_placeholders.items():
        res = res.replace(ph, u)

    return res

def normalize_text(text: str) -> str:
    """
    Normalisasi teks konsisten untuk tahap training dan inference (PRD Bab 16.3 & 19.1).
    Secara otomatis memulihkan batas spasi kata (*word boundaries*).
    """
    if not text:
        return ""

    # Pulihkan spasi dan batas kata yang menempel
    restored = restore_word_boundaries(text)

    # Hapus spasi berlebih
    cleaned = re.sub(r'\s+', ' ', restored).strip()

    return cleaned

def extract_urls(text: str) -> list[str]:
    """Ekstraksi URL dari teks untuk deteksi tautan palsu / domain mencurigakan"""
    url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[/\w\-._~:?#[\]@!$&\'()*+,;=]*'
    return re.findall(url_pattern, text)

