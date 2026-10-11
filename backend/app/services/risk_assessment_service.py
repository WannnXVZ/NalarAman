from typing import List, Literal
from app.schemas.analyze_response import RiskAssessment, SocialEngineeringIndicator

def assess_risk(
    label: Literal["Normal", "Scam", "Promosi"],
    confidence: float,
    indicators: List[SocialEngineeringIndicator]
) -> RiskAssessment:
    """
    Penilaian risiko transparan berdasarkan pemetaan aturan PRD Bab 23.2 & Bab 23.3.
    Menggabungkan probabilitas prediksi model ML dan sinyal pola manipulasi psikologis.
    """
    indicator_names = [i.indicator for i in indicators]
    num_indicators = len(indicators)

    # Indikator berisiko tinggi / kritis
    critical_signals = [
        name for name in indicator_names
        if any(keyword in name for keyword in ["Kredensial", "Modus APK", "Tautan / Domain", "Ancaman"])
    ]
    has_critical = len(critical_signals) > 0

    # 1. Kasus Risiko Tinggi
    # Label Scam dengan indikator kritis ATAU akumulasi >= 2 indikator pola
    if label == "Scam" and (has_critical or num_indicators >= 2):
        return RiskAssessment(
            level="tinggi",
            basis=f"Model memprediksi Scam (keyakinan {round(confidence * 100)}%) diperkuat oleh {num_indicators} indikator pola ({', '.join(critical_signals) if critical_signals else 'multi-indikator'})."
        )

    # Prinsip Kehati-hatian untuk Kasus Ambigu (PRD Bab 23.3):
    # Meskipun label model bukan Scam, keberadaan berkas APK atau permintaan OTP wajib berisiko Tinggi
    if any("Modus APK" in name or "Kredensial" in name for name in critical_signals):
        return RiskAssessment(
            level="tinggi",
            basis=f"Meskipun model memprediksi {label}, terdapat sinyal bahaya kritis ({', '.join(critical_signals)}) yang berpotensi membobol data pribadi/finansial."
        )

    if label == "Scam":
        return RiskAssessment(
            level="tinggi" if confidence >= 0.85 else "sedang",
            basis=f"Model mengklasifikasikan pesan sebagai Scam dengan skor keyakinan {round(confidence * 100)}%."
        )

    # 2. Kasus Risiko Sedang
    if num_indicators >= 2:
        return RiskAssessment(
            level="sedang",
            basis=f"Ditemukan {num_indicators} indikator manipulasi psikologis terdeteksi pada teks pesan."
        )

    if has_critical:
        return RiskAssessment(
            level="sedang",
            basis=f"Terdapat indikator mencurigakan ({critical_signals[0]}) yang memerlukan verifikasi manual lebih lanjut."
        )

    if label == "Promosi" and num_indicators == 1:
        return RiskAssessment(
            level="sedang",
            basis=f"Pesan promosi komersial dengan unsur tekanan psikologis ({indicators[0].indicator})."
        )

    # 3. Kasus Risiko Rendah
    if label == "Normal" and num_indicators == 0:
        return RiskAssessment(
            level="rendah",
            basis="Model memprediksi pola komunikasi wajar tanpa ditemukan indikator rekayasa sosial atau ancaman."
        )

    if label == "Promosi" and num_indicators == 0:
        return RiskAssessment(
            level="rendah",
            basis="Pesan promosi pemasaran wajar tanpa indikator manipulasi berbahaya atau tautan ilegal."
        )

    return RiskAssessment(
        level="rendah",
        basis=f"Pesan dikategorikan {label} dengan tingkat risiko rendah dan tidak memuat permintaan data sensitif."
    )
