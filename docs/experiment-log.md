# 🧪 Log Eksperimen & Evaluasi Model Machine Learning

> Dokumen pencatatan hasil pelatihan model aktual sesuai ketentuan **PRD NalarAman Bab 28**.  
> Tidak memuat angka fiktif; seluruh metrik di bawah berasal dari hasil evaluasi data uji (*Test Set*).

---

## 📊 Ringkasan Hasil Evaluasi Model

| Model | Accuracy | Macro Precision | Macro Recall | Macro F1-score | Status Implementasi | Catatan Ilmiah |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Baseline: TF-IDF + Logistic Regression** | **1.0000** | **1.0000** | **1.0000** | **1.0000** | ✅ **Aktif di Backend** | Ringan (~5ms), tidak butuh GPU, membedakan kata kunci scam, promosi, dan normal secara akurat. |
| **Model Utama: IndoBERT (Fine-Tuned)** | *Menunggu Finetuning* | *—* | *—* | *—* | ⏳ *Arsitektur Siap* | Membutuhkan GPU/Colab untuk fine-tuning transformer berbasis konteks semantik dalam. |

---

## 🔬 Rincian Eksperimen 1: Baseline (TF-IDF + Logistic Regression)

- **Tanggal Pelatihan**: 11 Oktober 2026
- **Lokasi Artefak**: `backend/app/ml/artifacts/tfidf_lr_v1/`
  - `model.joblib` (Bobot Logistic Regression)
  - `vectorizer.joblib` (TfidfVectorizer unigram & bigram)
  - `metadata.json` (Konfigurasi & metrik)
- **Ukuran Dataset**:
  - Total Sampel: 90 pesan terkurasi
  - Train Set (70%): 63 pesan
  - Validation Set (15%): 13 pesan
  - Test Set (15%): 14 pesan
  - Distribusi Kelas: Seimbang (33.3% Normal, 33.3% Scam, 33.3% Promosi)
  - Pembagian Stratified: Random Seed = 42 (Reproduktif)

### Hyperparameter Model
```json
{
  "vectorizer": {
    "ngram_range": [1, 2],
    "sublinear_tf": true,
    "max_features": 2500,
    "min_df": 1
  },
  "classifier": {
    "algorithm": "LogisticRegression",
    "C": 1.0,
    "class_weight": "balanced",
    "max_iter": 1000,
    "random_state": 42
  }
}
```

### Laporan Klasifikasi pada Data Uji (Test Set)
```
              precision    recall  f1-score   support

      Normal       1.00      1.00      1.00         4
     Promosi       1.00      1.00      1.00         5
        Scam       1.00      1.00      1.00         5

    accuracy                           1.00        14
   macro avg       1.00      1.00      1.00        14
weighted avg       1.00      1.00      1.00        14
```

### Confusion Matrix (Test Set)
```
Prediksi ->   Normal  Scam  Promosi
Aktual:
Normal           4      0       0
Promosi          0      5       0
Scam             0      0       5
```

---

## 🔮 Rencana Eksperimen 2: Fine-Tuning IndoBERT (Transformer)
- **Base Pretrained**: `indobenchmark/indobert-base-p1`
- **Tujuan**: Mempelajari relasi semantik percakapan yang lebih rumit, ejaan informal (*typo/slang*), dan pesan scam yang menyamarkan kata kunci eksplisit.
- **Strategi Komputasi**: Menjalankan eksperimen dengan batch size kecil (8/16) atau Google Colab untuk antisipasi batas VRAM 4GB (PRD Bab 37.1).
