import os
import json
import time
from datetime import datetime, timezone
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../../data/processed")
ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "../artifacts/tfidf_lr_v1")

def train_baseline_model():
    print("=" * 65)
    print("Memulai Pelatihan Model Baseline: TF-IDF + Logistic Regression")
    print("Dataset Gabungan: Sintetis (5.176) + Data Nyata Legal (1.232)")
    print("=" * 65)

    # 1. Memuat dataset terbagi (PRD Bab 18.1)
    train_path = os.path.join(DATA_DIR, "train.csv")
    test_path = os.path.join(DATA_DIR, "test.csv")
    val_path = os.path.join(DATA_DIR, "val.csv")

    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    test_df = pd.read_csv(test_path)

    X_train, y_train = train_df["clean_text"], train_df["label"]
    X_val, y_val = val_df["clean_text"], val_df["label"]
    X_test, y_test = test_df["clean_text"], test_df["label"]

    print(f"Data latih (Train)     : {len(X_train)} sampel")
    print(f"Data validasi (Val)    : {len(X_val)} sampel")
    print(f"Data uji (Test)        : {len(X_test)} sampel")

    # 2. Vektorisasi TF-IDF (Unigram + Bigram)
    start_time = time.time()
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=2,
        max_features=5000
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_val_vec = vectorizer.transform(X_val)
    X_test_vec = vectorizer.transform(X_test)

    # 3. Training Logistic Regression dengan Regularisasi Terkalibrasi (C=10.0)
    clf = LogisticRegression(
        C=10.0,
        max_iter=1000,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train_vec, y_train)
    training_time = time.time() - start_time

    # 4. Evaluasi pada Validation Set
    val_preds = clf.predict(X_val_vec)
    val_acc = accuracy_score(y_val, val_preds)
    val_prec, val_rec, val_f1, _ = precision_recall_fscore_support(y_val, val_preds, average="macro", zero_division=0)
    print("\n--- Evaluasi Validation Set ---")
    print(f"Val Accuracy : {val_acc:.4f} ({val_acc*100:.2f}%)")
    print(f"Val Macro F1 : {val_f1:.4f}")

    # 5. Evaluasi pada Test Set Keseluruhan
    y_pred = clf.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)

    print("\n--- Hasil Evaluasi pada Test Set (Seluruh Data Uji) ---")
    print(f"Akurasi           : {acc:.4f} ({acc*100:.2f}%)")
    print(f"Macro Precision   : {prec:.4f}")
    print(f"Macro Recall      : {rec:.4f}")
    print(f"Macro F1-Score    : {f1:.4f}")
    print("\nLaporan Klasifikasi per Kelas:")
    print(classification_report(y_test, y_pred, zero_division=0))

    cm = confusion_matrix(y_test, y_pred, labels=["Normal", "Scam", "Promosi"])
    print("Confusion Matrix (Normal, Scam, Promosi):")
    print(cm)

    # 6. Evaluasi Khusus Sub-populasi Data Nyata di Test Set (Generalisasi Nyata)
    real_mask = test_df["tipe_data"] == "nyata"
    if real_mask.sum() > 0:
        y_test_real = test_df.loc[real_mask, "label"]
        X_test_real_vec = vectorizer.transform(test_df.loc[real_mask, "clean_text"])
        y_pred_real = clf.predict(X_test_real_vec)
        real_acc = accuracy_score(y_test_real, y_pred_real)
        _, _, real_f1, _ = precision_recall_fscore_support(y_test_real, y_pred_real, average="macro", zero_division=0)
        print("\n--- Evaluasi Khusus Sub-populasi Data Nyata (Real Benchmark) ---")
        print(f"Jumlah sampel nyata di test : {real_mask.sum()} sampel")
        print(f"Real Data Accuracy          : {real_acc:.4f} ({real_acc*100:.2f}%)")
        print(f"Real Data Macro F1          : {real_f1:.4f}")

    # 7. Simpan Artefak Model
    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    model_file = os.path.join(ARTIFACT_DIR, "model.joblib")
    vectorizer_file = os.path.join(ARTIFACT_DIR, "vectorizer.joblib")
    meta_file = os.path.join(ARTIFACT_DIR, "metadata.json")

    joblib.dump(clf, model_file)
    joblib.dump(vectorizer, vectorizer_file)

    metadata = {
        "model_name": "TF-IDF + Logistic Regression (Baseline Terkalibrasi)",
        "version": "2.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "training_time_seconds": round(training_time, 4),
        "classes": list(clf.classes_),
        "hyperparameters": {
            "ngram_range": [1, 2],
            "max_features": 5000,
            "min_df": 2,
            "C": 10.0,
            "random_state": 42
        },
        "metrics_test": {
            "accuracy": round(float(acc), 4),
            "macro_precision": round(float(prec), 4),
            "macro_recall": round(float(rec), 4),
            "macro_f1_score": round(float(f1), 4),
            "real_subset_accuracy": round(float(real_acc), 4) if real_mask.sum() > 0 else None,
            "real_subset_macro_f1": round(float(real_f1), 4) if real_mask.sum() > 0 else None
        },
        "dataset_split": {
            "train_samples": len(train_df),
            "val_samples": len(val_df),
            "test_samples": len(test_df),
            "real_samples_total": int((train_df["tipe_data"] == "nyata").sum() + (val_df["tipe_data"] == "nyata").sum() + (test_df["tipe_data"] == "nyata").sum()),
            "synthetic_samples_total": int((train_df["tipe_data"] == "sintetis").sum() + (val_df["tipe_data"] == "sintetis").sum() + (test_df["tipe_data"] == "sintetis").sum())
        }
    }

    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nArtefak model v2 berhasil diekspor ke: {ARTIFACT_DIR}")
    return metadata

if __name__ == "__main__":
    train_baseline_model()

