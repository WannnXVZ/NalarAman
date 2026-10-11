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
| **Fase 5** | OCR & Screenshot (Tahap Lanjutan) | ⏳ Belum Dimulai | 0% | Integrasi Tesseract OCR, upload drag-drop & editor teks hasil ekstraksi |
| **Fase 6** | Pengujian Lengkap & Dokumen LKTI | ⏳ Belum Dimulai | 35% | 10/10 Unit tests passed, log eksperimen & evaluasi tercatat di `docs/` |

```
TOTAL KESIAPAN SISTEM MVP: [████████████████████] ~85%
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

### ✅ Fase 3: Dataset & Model Klasifikasi ML (100% SELESAI)
- [x] **3.1 Pengadaan & Kurasi Dataset**:
  - [x] Dataset pesan digital berbahasa Indonesia terkurasi 3 kelas (*Normal*, *Scam*, *Promosi*) disimpan di `backend/data/raw/dataset_messages.csv`.
  - [x] Pembersihan data (validasi teks kosong, penghapusan duplikasi).
  - [x] Stratified Split: Train 70% (63 sampel), Val 15% (13 sampel), Test 15% (14 sampel) dengan random seed 42 di `backend/data/processed/`.
- [x] **3.2 Implementasi Pipeline Training Baseline**:
  - [x] Vektorisasi teks menggunakan unigram dan bigram **TF-IDF Vectorizer**.
  - [x] Pelatihan algoritma **Logistic Regression** teratur dengan pembobotan kelas seimbang (`app/ml/training/train_baseline.py`).
- [x] **3.3 Evaluasi & Pencatatan Hasil Nyata**:
  - [x] Evaluasi pada data uji (*Test Set*): Akurasi 100%, Macro Precision 1.0, Macro Recall 1.0, Macro F1 1.0.
  - [x] Dokumentasi hasil aktual, confusion matrix, dan parameter dicatat di [docs/experiment-log.md](experiment-log.md).
- [x] **3.4 Penyimpanan Artefak & Integrasi ke API**:
  - [x] Bobot model (`model.joblib`), vectorizer (`vectorizer.joblib`), dan `metadata.json` tersimpan di `app/ml/artifacts/tfidf_lr_v1/`.
  - [x] `app/ml/model_loader.py` memuat model aktual ke memori saat server startup.
  - [x] `app/services/classification_service.py` memprediksi probabilitas nyata secara instan menggunakan model terlatih.
- [x] **3.5 Penyiapan Arsitektur IndoBERT**:
  - [x] Skrip panduan fine-tuning IndoBERT siap pakai di `app/ml/training/train_indobert.py` untuk GPU RTX 3050 / Google Colab.

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

### ⏳ Fase 5: OCR & Analisis Screenshot Percakapan (TAHAP LANJUTAN)
> *Fokus: Menerima input gambar tangkapan layar chat (WhatsApp, SMS, Bukti Transfer).*

- [ ] **5.1 Komponen Frontend Gambar**:
  - [ ] Membuat komponen `ImageUploadZone.tsx` (drag-and-drop file gambar JPG/PNG, ukuran maks 5 MB).
  - [ ] Membuat pratinjau gambar (*image preview*).
  - [ ] Membuat komponen `OcrTextEditor.tsx` (kolom teks hasil ekstraksi yang wajib dikoreksi/diedit oleh pengguna sebelum dianalisis, PRD Bab 24.2).
- [ ] **5.2 Backend OCR Service**:
  - [ ] Integrasi mesin OCR **Tesseract** (`pytesseract`).
  - [ ] Membuat endpoint `POST /api/v1/analyze-image` (PRD Bab 17.3).
  - [ ] Validasi keamanan tipe MIME gambar aktual (bukan hanya ekstensi).
  - [ ] Penghapusan file gambar sementara segera setelah OCR selesai (PRD Bab 26).
- [ ] **5.3 Alur Integrasi**:
  - [ ] Menghubungkan teks yang telah disetujui pengguna dari OCR langsung ke pipeline `/api/v1/analyze`.

---

### ⏳ Fase 6: Pengujian Menyeluruh & Dokumentasi Final LKTI
> *Fokus: Verifikasi kualitas menyeluruh dan kelengkapan naskah ilmiah.*

- [ ] **6.1 Pengujian Sistem End-to-End**:
  - [ ] Pengujian seluruh skenario uji PRD Bab 27.1 (pesan kosong, teks sangat panjang, pesan ambigu, gambar buram).
  - [ ] Pengujian ketahanan beban (*stress/latency test*) saat komputasi LIME aktif.
  - [ ] Pengujian audit privasi (memastikan tidak ada kebocoran data pribadi di log).
- [ ] **6.2 Dokumentasi Hasil Penelitian**:
  - [ ] Menulis laporan eksperimen model di `docs/experiment-log.md` (arsitektur, loss curve, metrik f1).
  - [ ] Menulis dokumentasi keterbatasan sistem di `docs/limitations.md`.
  - [ ] Menyusun ringkasan metodologi dan hasil untuk dimasukkan ke naskah karya tulis ilmiah (LKTI).

---

## 🎯 Panduan Langkah Selanjutnya (Next Immediate Action)

Untuk melanjutkan proyek, hal pertama yang perlu dilakukan adalah memulai **Fase 3: Dataset**:

1. **Siapkan File Dataset**:
   - Format yang ideal adalah CSV atau JSON dengan minimal dua kolom: `teks_pesan` dan `label` (`Normal`, `Scam`, `Promosi`).
   - Jika Anda sudah memiliki file dataset mentah, simpan di folder baru misalnya `backend/data/raw/`.
2. **Jalankan Training Baseline**:
   - Kita akan membuat skrip pelatihan TF-IDF + Logistic Regression terlebih dahulu sebagai pembanding awal tanpa perlu GPU berat.
3. **Fine-Tuning IndoBERT**:
   - Setelah baseline berjalan, kita lanjutkan ke fine-tuning IndoBERT dan menyimpan bobot modelnya ke `backend/app/ml/artifacts/`.
