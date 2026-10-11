# NalarAman

> *"Kenali Risikonya, Pahami Alasannya."*  
> **Platform Deteksi Penipuan Digital Berbasis Explainable AI**

---

## 📌 Ringkasan Proyek

NalarAman adalah prototipe penelitian berupa platform deteksi penipuan digital berbahasa Indonesia berbasis *Explainable AI (XAI)*. Sistem ini dirancang sebagai *decision-support tool* untuk membantu masyarakat memeriksa potensi penipuan (scam) dan manipulasi psikologis (*social engineering*) pada pesan digital.

## 🗂️ Struktur Repositori

```
LKTI/
├── docs/                 # Dokumen kebutuhan produk (PRD), spesifikasi, dan panduan
│   └── PRD_NalarAman.html
├── frontend/             # Aplikasi antarmuka pengguna (React + TypeScript + Vite)
├── backend/              # Layanan API & pipeline analisis (FastAPI + Python)
│   └── app/
│       ├── routers/      # Router endpoint API (/api/v1/health, /api/v1/analyze)
│       ├── schemas/      # Skema validasi Pydantic
│       ├── services/     # Layanan logika & pipeline analisis
│       ├── ml/           # Training, evaluasi, dan pemuat model
│       └── core/         # Konfigurasi, logging, dan error handling
├── .gitignore
└── README.md
```

## 🚀 Memulai Proyek

### Frontend (Pengembangan)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Pengembangan)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 📖 Dokumentasi Lengkap
- 📋 **Progress & Implementation Tracker**: [docs/progress-tracker.md](docs/progress-tracker.md) *(Pantau status pengerjaan fitur)*
- 📑 **Product Requirements Document (PRD)**: [docs/PRD_NalarAman.html](docs/PRD_NalarAman.html)
- 🔌 **Spesifikasi Kontrak API**: [docs/api-contract.md](docs/api-contract.md)
- 🎨 **Design System & Tokens**: [docs/design-system.md](docs/design-system.md)
- 🛠️ **Panduan Instalasi & Pengaturan**: [docs/setup-guide.md](docs/setup-guide.md)
