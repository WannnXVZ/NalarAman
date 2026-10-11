# Backend NalarAman

Layanan API untuk platform NalarAman berbasis FastAPI.

## Prasyarat
- Python 3.10+ (direkomendasikan Python 3.12)
- virtual environment (`venv`)

## Panduan Instalasi
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

## Menjalankan Server Pengembangan
```bash
uvicorn app.main:app --reload --port 8000
```
Server akan aktif di `http://localhost:8000` dengan dokumentasi interaktif Swagger di `http://localhost:8000/docs`.
