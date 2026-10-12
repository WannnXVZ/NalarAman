# 📊 NalarAman — Progress & Implementation Tracker

> **Status Dokumen**: Aktif & Terbarui  
> **Terakhir Diperbarui**: 11 Oktober 2026  
> **Tujuan**: Melacak status pengerjaan setiap fitur, modul, dan artefak penelitian NalarAman dari awal hingga siap publikasi/lomba.

---

## 📈 Ringkasan Progres Keseluruhan

| Fase | Nama Fase | Status | Progres | Catatan Utama |
|---|---|:---:|:---:|---|
| **Fase 0** | Scaffold & Struktur Repositori | ✅ Selesai | 100% | Struktur folder `docs/`, `frontend/`, `backend/`, `.gitignore`, & PRD |
| **Fase 1** | Fondasi UI Frontend | ✅ Selesai | 100% | 9 Komponen UI, Design Tokens PRD Bab 13, 9 State UI Bab 12.3 |
| **Fase 2** | Backend & Kontrak API | ✅ Selesai | 100% | FastAPI, endpoint `/health` & `/analyze`, Pytest 5/5 lulus, integrasi FE-BE live |
| **Fase 3** | Dataset & Model Klasifikasi ML | ✅ Selesai | 100% | Dataset 3 kelas seimbang, baseline TF-IDF+LR terlatih & terintegrasi ke API |
| **Fase 4** | Deteksi Pola Lanjutan, XAI & Risiko | ✅ Selesai | 100% | 8 Pola Social Engineering, integrasi real LIME XAI, penanganan risiko kasus ambigu |
| **Fase 5** | OCR & Screenshot (Tahap Lanjutan) | ✅ Selesai | 100% | Integrasi RapidOCR mandiri, upload drag-drop & editor teks hasil ekstraksi |
| **Fase 6** | Pengujian Lengkap & Dokumen LKTI | ✅ Selesai | 100% | 12/12 Unit tests, audit edge cases, limitations.md, experiment-log.md, & naskah-lkti.md lengkap |

```
TOTAL KESIAPAN SISTEM & RISET LKTI: [████████████████████] 100%
```

---

## 📋 Checklist Rinci per Fase

### ✅ Fase 0: Scaffold & Struktur Proyek (100% SELESAI)
- [x] Restrukturisasi folder proyek (`docs/`, `frontend/`, `backend/`).
- [x] Pemindahan dan preservasi [PRD_NalarAman.html](PRD_NalarAman.html) (37 Bab) ke dalam folder `docs/`.
- [x] Pembuatan root `.gitignore` terpadu (mengabaikan node_modules, venv, model artifacts, file sensitif).
- [x] Inisialisasi proyek Frontend dengan React + TypeScript + Vite.
- [x] Penyiapan struktur modular Backend FastAPI (`app/routers`, `app/schemas`, `app/services`, `app/ml`, `app/core`).
- [x] Pembuatan dokumen panduan [setup-guide.md](setup-guide.md), [api-contract.md](api-contract.md), dan [design-system.md](design-system.md).
- [x] Pembuatan file template konfigurasi `.env.example` untuk frontend dan backend.

---

### ✅ Fase 1: Fondasi UI Frontend (100% SELESAI)
- [x] **Design System Token (`tokens.css`)**: Palet ungu resmi (`#6D28D9`, `#8B5CF6`, `#2E1065`, `#F5F3FF`) dan warna semantik risiko.
- [x] **Global Styling (`global.css`)**: Typography *Plus Jakarta Sans*, tata letak responsif (desktop, tablet, mobile), card glassmorphism.
- [x] **TypeScript Schemas (`types/analysis.ts`)**: Pemetaan tipe request/response analisis, status komponen, dan UI states.
- [x] **Komponen Modular**:
  - [x] `Header.tsx`: Identitas brand NalarAman & indikator status backend (hijau/merah/kuning).
  - [x] `TextInputPanel.tsx`: Area input textarea, word counter, character limit (2000), paste & clear buttons, dan 4 preset pesan contoh.
  - [x] `AnalyzeButton.tsx`: Tombol periksa pesan interaktif dengan loading spinner dan shortcut `Ctrl + Enter`.
  - [x] `LoadingIndicator.tsx`: Animasi visual scanning pipeline NLP & XAI.
  - [x] `ErrorBanner.tsx`: Tampilan error informatif saat backend mati atau model 503 dengan tombol retry.
  - [x] `ClassificationCard.tsx`: Kartu label kelas (*Normal*, *Scam*, *Promosi*) dengan progress bar skor keyakinan (*confidence*).
  - [x] `RiskAssessmentBadge.tsx`: Chip tingkat risiko (*● Rendah*, *▲ Sedang*, *■ Tinggi*) sesuai PRD Bab 13.2 disertai saran tindakan.
  - [x] `PatternIndicatorList.tsx`: Daftar indikator rekayasa sosial / manipulasi psikologis yang terdeteksi beserta dasar aturannya.
  - [x] `LimeExplanationPanel.tsx`: Visualisasi horizontal bar chart kontribusi token/kata metode Explainable AI (LIME).
  - [x] `LimitationNotice.tsx`: Peringatan tetap integritas ilmiah dan batasan sistem (PRD Bab 34).
  - [x] `StateDemoToolbar.tsx`: Toolbar penguji 9 state UI (Bab 12.3) dengan tombol minimize/collapse.
  - [x] `Footer.tsx`: Atribusi riset ilmiah LKTI dan tautan dokumentasi.
- [x] **Auto-Reset Input**: State analisis lama otomatis dibersihkan begitu pengguna mulai mengetik teks baru (*mencegah stale state*).
- [x] **Verifikasi Build**: Lulus `npm run build` dan terverifikasi di browser subagent.

---

### ✅ Fase 2: Backend & Kontrak API (100% SELESAI)
- [x] Server FastAPI berjalan dengan router modular.
- [x] **Endpoint Health (`GET /api/v1/health`)**: Mengembalikan keaktifan backend dan status komponen model AI.
- [x] **Endpoint Analyze (`POST /api/v1/analyze`)**: Orkestrasi pipeline pemrosesan teks.
- [x] Skema data request/response menggunakan Pydantic v2 dengan validasi input.
- [x] Konfigurasi CORS Middleware untuk origin frontend lokal (`http://localhost:5173`).
- [x] Logging privasi aman (tidak menyimpan isi pesan pengguna ke file log permanen, PRD Bab 26).
- [x] Exception handling terstruktur (`MODEL_UNAVAILABLE`, `INVALID_INPUT`, `INTERNAL_ERROR`).
- [x] **Pengujian Otomatis**: 5 dari 5 unit test di `backend/tests/` lulus (`pytest`).
- [x] **Integrasi End-to-End**: Frontend terhubung live ke backend lokal secara real-time.

---

### ✅ Fase 3: Dataset & Model Klasifikasi ML (100% SELESAI & DIPERLUAS)
- [x] **3.1 Pengadaan & Kurasi Dataset Skala Penuh**:
  - [x] Integrasi dataset sintetis dari folder `datatraining/` (5.176 sampel).
  - [x] Integrasi dataset nyata benchmark akademik SMS Fraud Indonesia (Kurniawan/Rahmawati, 1.142 sampel).
  - [x] Integrasi dataset nyata kurasi modern penipuan APK/WhatsApp (90 sampel).
  - [x] Total dataset bersih setelah deduplikasi: **6.408 sampel** unik dengan metadata provenance lengkap.
  - [x] Stratified Split (Seed 42): Train 70% (4.485 sampel), Val 15% (961 sampel), Test 15% (962 sampel).
- [x] **3.2 Implementasi Pipeline Training Baseline v2 Terkalibrasi**:
  - [x] Vektorisasi teks menggunakan **TF-IDF Vectorizer** (5.000 fitur unigram & bigram).
  - [x] Pelatihan algoritma **Logistic Regression** terkalibrasi ($C=10.0$) dengan pembobotan kelas seimbang (`app/ml/training/train_baseline.py`).
- [x] **3.3 Evaluasi & Pencatatan Hasil Nyata**:
  - [x] Evaluasi Test Set (962 sampel): Akurasi **99.27%**, Macro F1 **0.9927**.
  - [x] Evaluasi Sub-populasi Data Nyata (194 sampel di Test Set): Akurasi **96.39%**, Macro F1 **0.9590**.
  - [x] Dokumentasi lengkap, confusion matrix, dan parameter dicatat di [docs/experiment-log.md](experiment-log.md).
- [x] **3.4 Penyimpanan Artefak & Integrasi ke API**:
  - [x] Bobot model (`model.joblib`), vectorizer (`vectorizer.joblib`), dan `metadata.json` tersimpan di `app/ml/artifacts/tfidf_lr_v1/`.
  - [x] `app/ml/model_loader.py` aktif melayani inferensi cepat dengan skor keyakinan yang tegas dan representatif (95%–98% untuk pesan berbobot kuat).
- [x] **3.5 Penyiapan Arsitektur & Skrip IndoBERT**:
  - [x] Skrip fine-tuning IndoBERT siap pakai di `app/ml/training/train_indobert.py` dioptimalkan untuk GPU RTX 3050 Laptop (VRAM 4GB).

---

### ✅ Fase 4: Deteksi Pola Lanjutan, XAI (LIME), & Penilaian Risiko (100% SELESAI)
- [x] **4.1 Integrasi Library LIME Nyata**:
  - [x] Instalasi library `lime` dan dependensi visualisasi matematika di backend.
  - [x] Membangun explainer `LimeTextExplainer` di `app/services/explainability_service.py` yang memanggil `predict_proba` dari model ML aktual.
  - [x] Pengukuran waktu komputasi inference LIME aktual (~1.200 ms).
  - [x] Penanganan fallback graceful jika LIME timeout atau memori terbatas.
- [x] **4.2 Deteksi Lengkap 8 Pola Social Engineering (PRD Bab 21)**:
  - [x] Urgensi & Tekanan Waktu.
  - [x] Iming-iming Hadiah / Keuntungan Tidak Wajar.
  - [x] Ancaman & Pemblokiran / Konsekuensi Negatif.
  - [x] Penyebaran Berkas Berbahaya (.apk / malware).
  - [x] Permintaan Informasi Kredensial Sensitif (OTP/PIN/CVV).
  - [x] Tautan / Domain Mencurigakan & Pemendek URL.
  - [x] Penyamaran Identitas Institusi Resmi (*Impersonation*).
  - [x] Modus Krisis Keluarga / Darurat Palsu.
- [x] **4.3 Penilaian Risiko Ilmiah & Kasus Ambigu (PRD Bab 23)**:
  - [x] Formula penilaian risiko memadukan probabilitas prediksi model dan sinyal pola.
  - [x] Penerapan *Safety-First Principle* (kasus ambigu berisiko tinggi saat ada APK/OTP terdeteksi).
  - [x] Penambahan unit tests di `backend/tests/` (10 dari 10 unit test lulus 100%).

---

### ✅ Fase 5: OCR & Analisis Screenshot Percakapan (100% SELESAI)
> *Fokus: Menerima input gambar tangkapan layar chat (WhatsApp, SMS, Bukti Transfer).*

- [x] **5.1 Komponen Frontend Gambar**:
  - [x] Membuat komponen `ImageUploadZone.tsx` (drag-and-drop file gambar JPG/PNG/WebP, ukuran maks 5 MB).
  - [x] Menampilkan pratinjau gambar (*image preview*) beserta metadata nama & ukuran file.
  - [x] Membuat komponen `OcrTextEditor.tsx` (kolom teks hasil ekstraksi yang wajib dikoreksi/diedit oleh pengguna sebelum dianalisis, PRD Bab 24.2).
- [x] **5.2 Backend OCR Service**:
  - [x] Integrasi mesin OCR **Tesseract** (`pytesseract` & Pillow).
  - [x] Membuat endpoint `POST /api/v1/analyze-image` (PRD Bab 17.3).
  - [x] Validasi keamanan tipe MIME gambar aktual (bukan hanya ekstensi) dan ukuran maksimal 5 MB.
  - [x] Penghapusan file gambar sementara segera setelah OCR selesai (PRD Bab 26).
- [x] **5.3 Alur Integrasi & Mesin OCR Riil**:
  - [x] Integrasi mesin OCR mandiri deep learning berbasis ONNX (`rapidocr-onnxruntime`) yang berjalan langsung di Python tanpa memerlukan dependensi external binary/UAC installer di Windows.
  - [x] Menghilangkan mock fallback text; sistem kini mengekstrak teks nyata dari screenshot apa pun yang diunggah.
  - [x] Menghubungkan teks yang telah disetujui pengguna dari OCR langsung ke pipeline `/api/v1/analyze`.
  - [x] Uji unit test `tests/test_ocr_api.py` (12/12 unit tests passed).
  - [x] Verifikasi browser live dengan screenshot chat dosen riil (rekaman: `verify_real_ocr_dosen`, klasifikasi: Normal 100%).
  - [x] **Pembersihan State Bersih Total Antar Mode**: Teks masukan (`inputText`), kuota kata/karakter, status OCR (`ocrData`), file gambar terpilih (`selectedImage`), dan kartu hasil analisis (`analysisResult`) langsung di-reset bersih saat berpindah antara tab *Mode Teks Manual* dan *Mode Screenshot (OCR)*, serta saat pengguna memilih berkas gambar baru.

---

### ✅ Fase 6: Pengujian Menyeluruh & Dokumentasi Final LKTI (100% SELESAI)
> *Fokus: Verifikasi kualitas menyeluruh dan kelengkapan naskah ilmiah.*

- [x] **6.1 Pengujian Sistem End-to-End**:
  - [x] Pengujian seluruh skenario uji PRD Bab 27.1 (pesan kosong, spasi, teks <5 kar, teks >2000 kar, pesan ambigu, gambar buram/polos).
  - [x] Pengujian ketahanan beban (*stress/latency test*) saat komputasi LIME aktif (rata-rata ~650–780 ms, jauh di bawah SLA 2.000 ms).
  - [x] Pengujian audit privasi (memastikan tidak ada kebocoran data pribadi di log).
  - [x] Pengujian audit antarmuka UI/UX di Desktop (1920x945) dan Mobile Smartphone (390x844).
- [x] **6.2 Dokumentasi Hasil Penelitian & Naskah LKTI**:
  - [x] Pembaruan laporan eksperimen model di `docs/experiment-log.md` (metrik 99.27% test set, 96.39% data nyata, benchmark latensi komponen).
  - [x] Dokumentasi keterbatasan sistem & etika AI di `docs/limitations.md` (PRD Bab 34 & kepatuhan UU PDP).
  - [x] Naskah lengkap Karya Tulis Ilmiah (LKTI) terstruktur (Abstrak, Bab I–V, Daftar Pustaka IEEE/APA) siap publikasi/lomba di `docs/naskah-lkti.md`.

---

## 🏆 Status Akhir Proyek: Siap Publikasi & Kompetisi (Production & Competition Ready)

Seluruh komponen teknis platform dan dokumen riset ilmiah telah **100% selesai**:

1. **Aplikasi Web Siap Demo**:
   - Frontend: `http://localhost:5173/` (React + TypeScript + Vite)
   - Backend API: `http://127.0.0.1:8000/` (FastAPI + RapidOCR + LIME Explainer)
2. **Artefak & Dokumen Riset Siap Cetak**:
   - Naskah Karya Tulis Ilmiah: [docs/naskah-lkti.md](naskah-lkti.md)
   - Laporan Eksperimen Model: [docs/experiment-log.md](experiment-log.md)
   - Keterbatasan Sistem & Privasi: [docs/limitations.md](limitations.md)
   - Kontrak API: [docs/api-contract.md](api-contract.md)
   - Dokumen PRD 37 Bab: [docs/PRD_NalarAman.html](PRD_NalarAman.html)
