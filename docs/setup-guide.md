# Panduan Pengaturan & Menjalankan NalarAman

Panduan ini berisi langkah-langkah untuk menyiapkan dan menjalankan lingkungan pengujian aplikasi NalarAman secara lokal.

## 1. Menjalankan Frontend
1. Buka terminal pada folder `frontend`:
   ```bash
   cd frontend
   ```
2. Pastikan dependencies telah terpasang:
   ```bash
   npm install
   ```
3. Salin file environment:
   ```bash
   cp .env.example .env
   ```
4. Jalankan server pengembang:
   ```bash
   npm run dev
   ```
5. Buka peramban di `http://localhost:5173`.

---

## 2. Menjalankan Backend
1. Buka terminal pada folder `backend`:
   ```bash
   cd backend
   ```
2. Buat virtual environment Python:
   ```bash
   python -m venv venv
   ```
3. Aktifkan virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```
4. Pasang dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Jalankan server FastAPI:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
6. Dokumentasi API Swagger tersedia di `http://localhost:8000/docs`.
