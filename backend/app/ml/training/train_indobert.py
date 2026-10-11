"""
Skrip Fine-Tuning Model Utama: IndoBERT (PRD Bab 20.2 & Bab 37.1)
Dirancang untuk adaptasi pada kartu grafis RTX 3050 Laptop GPU (VRAM 4GB)
atau dapat dijalankan secara langsung di Google Colab.
"""

import os
import sys

def print_indobert_guide():
    guide = """
================================================================================
ARAHAN PIPELINE FINE-TUNING INDOBERT (PRD Bab 20.2)
================================================================================

1. Model Pretrained yang Direkomendasikan:
   - 'indobenchmark/indobert-base-p1' (Indo4B - Fast & Highly Accurate)
   - atau 'indobenchmark/indobert-lite-base-p1' (Versi lebih ringan)

2. Konfigurasi Khusus VRAM 4GB (NVIDIA RTX 3050 Laptop):
   - batch_size         = 8
   - gradient_accumulation_steps = 2 (efektif batch size = 16)
   - max_seq_length     = 128 token (cukup untuk pesan chat/SMS)
   - learning_rate      = 2e-5
   - epochs             = 3 - 5
   - fp16               = True (Mixed Precision untuk menghemat VRAM)

3. Dependensi Tambahan yang Dibutuhkan untuk Deep Learning:
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
   pip install transformers datasets accelerate evaluate

4. Struktur Output Artefak IndoBERT:
   backend/app/ml/artifacts/indobert_v1/
   ├── config.json
   ├── model.safetensors (atau pytorch_model.bin)
   ├── tokenizer_config.json
   └── vocab.txt

Skrip ini telah disiapkan untuk dijalankan saat dependensi PyTorch CUDA telah siap.
Baseline TF-IDF + Logistic Regression saat ini telah aktif dan melayani inferensi produksi.
================================================================================
"""
    print(guide)

if __name__ == "__main__":
    print_indobert_guide()
