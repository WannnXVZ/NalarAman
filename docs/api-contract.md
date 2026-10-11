# Kontrak API NalarAman (v1)

> Berdasarkan spesifikasi pada PRD NalarAman Bab 17 dan Bab 25.

---

## 1. Health Check Endpoint

- **Metode**: `GET`
- **Path**: `/api/v1/health`
- **Deskripsi**: Memeriksa ketersediaan backend server dan kesiapan model ML maupun modul XAI.

### Response `200 OK`
```json
{
  "status": "ok",
  "backend_active": true,
  "components": {
    "classification_model": "ready",
    "baseline_model": "ready",
    "lime_explainer": "ready",
    "ocr_engine": "not_configured"
  },
  "timestamp": "2026-10-11T09:00:00Z"
}
```

---

## 2. Text Analysis Endpoint

- **Metode**: `POST`
- **Path**: `/api/v1/analyze`
- **Deskripsi**: Menjalankan pipeline klasifikasi, deteksi pola social engineering, kalkulasi risiko, dan penjelasan LIME.

### Request Body
```json
{
  "text": "Selamat! Anda memenangkan undian Rp 50.000.000. Segera klaim dalam 1 jam di link http://hadiah-resmi-bri.xyz"
}
```

### Response `200 OK`
```json
{
  "request_status": "success",
  "classification": {
    "label": "Scam",
    "confidence": 0.94
  },
  "social_engineering_indicators": [
    {
      "indicator": "urgensi_waktu",
      "description": "Pesan mengandung tekanan waktu yang mendesak (misal: segera, dalam 1 jam)",
      "basis": "rule-based"
    },
    {
      "indicator": "iming_iming_hadiah",
      "description": "Pesan menjanjikan hadiah uang tunai besar yang tidak wajar",
      "basis": "rule-based"
    },
    {
      "indicator": "tautan_palsu",
      "description": "Domain URL mencurigakan menyerupai instansi resmi",
      "basis": "rule-based"
    }
  ],
  "risk_assessment": {
    "level": "tinggi",
    "basis": "Kombinasi klasifikasi Scam dengan 3 indikator pola termasuk tautan palsu dan urgensi waktu"
  },
  "explanation": {
    "method": "LIME",
    "available": true,
    "contributions": [
      { "token": "undian", "weight": 0.42, "direction": "mendukung_scam" },
      { "token": "segera", "weight": 0.35, "direction": "mendukung_scam" },
      { "token": "klaim", "weight": 0.28, "direction": "mendukung_scam" },
      { "token": "http", "weight": 0.25, "direction": "mendukung_scam" }
    ],
    "reason": null
  },
  "warnings": [
    "Hasil ini adalah alat bantu analisis probabilitas dan bukan jaminan mutlak. Harap selalu lakukan konfirmasi melalui kanal resmi penyelenggara."
  ]
}
```

### Response Error
```json
{
  "request_status": "error",
  "error_code": "MODEL_UNAVAILABLE",
  "message": "Model klasifikasi belum siap dimuat. Silakan coba kembali beberapa saat lagi.",
  "detail": null
}
```
