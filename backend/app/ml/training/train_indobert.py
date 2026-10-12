"""
Skrip Pelatihan & Fine-Tuning IndoBERT (PRD Bab 20.2 & Bab 37.1)
Arsitektur: Transformer Pre-trained 'indobenchmark/indobert-base-p1'
Optimasi Perangkat: NVIDIA GeForce RTX 3050 Laptop GPU (VRAM 4GB) / CPU / Google Colab
"""

import os
import sys
import json
import time
from datetime import datetime, timezone
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "../../../data/processed")
OUTPUT_DIR = os.path.join(BASE_DIR, "../artifacts/indobert_v1")

def check_dependencies():
    """Memeriksa kesiapan dependensi PyTorch (CUDA) dan HuggingFace Transformers."""
    missing = []
    has_torch = False
    has_transformers = False
    cuda_available = False
    gpu_name = "None"

    try:
        import torch
        has_torch = True
        cuda_available = torch.cuda.is_available()
        if cuda_available:
            gpu_name = torch.cuda.get_device_name(0)
    except ImportError:
        missing.append("torch (PyTorch)")

    try:
        import transformers
        has_transformers = True
    except ImportError:
        missing.append("transformers")

    try:
        import accelerate
    except ImportError:
        missing.append("accelerate")

    return {
        "ready": len(missing) == 0,
        "missing": missing,
        "cuda_available": cuda_available,
        "gpu_name": gpu_name
    }

def print_setup_instructions(dep_status):
    print("=" * 70)
    print("STATUS KESIAPAN LINGKUNGAN DEEP LEARNING (INDOBERT)")
    print("=" * 70)
    print(f"CUDA Hardware Terdeteksi: {dep_status['cuda_available']} ({dep_status['gpu_name']})")
    
    if not dep_status["ready"]:
        print("\n[!] Dependensi Deep Learning belum terinstal di virtualenv:")
        for m in dep_status["missing"]:
            print(f"  - {m}")
        print("\nUntuk menjalankan fine-tuning IndoBERT pada GPU RTX 3050 Laptop:")
        print("Jalankan perintah instalasi berikut di terminal (backend/):")
        print("  .\\venv\\Scripts\\pip install torch --index-url https://download.pytorch.org/whl/cu121")
        print("  .\\venv\\Scripts\\pip install transformers datasets accelerate evaluate scikit-learn")
        print("=" * 70)
        return False
    return True

def run_indobert_finetuning(epochs: int = 3, batch_size: int = 8, lr: float = 2e-5):
    """
    Menjalankan fine-tuning IndoBERT menggunakan PyTorch & Transformers
    dengan konfigurasi ramah VRAM 4GB (RTX 3050 Laptop).
    """
    dep_status = check_dependencies()
    if not print_setup_instructions(dep_status):
        return

    import torch
    from transformers import (
        AutoTokenizer, 
        AutoModelForSequenceClassification, 
        TrainingArguments, 
        Trainer
    )
    from sklearn.metrics import accuracy_score, precision_recall_fscore_support

    print(f"\nMemulai pipeline fine-tuning IndoBERT pada device: {dep_status['gpu_name']}...")

    # 1. Muat Dataset
    train_df = pd.read_csv(os.path.join(DATA_DIR, "train.csv"))
    val_df = pd.read_csv(os.path.join(DATA_DIR, "val.csv"))
    test_df = pd.read_csv(os.path.join(DATA_DIR, "test.csv"))

    label2id = {"Normal": 0, "Promosi": 1, "Scam": 2}
    id2label = {v: k for k, v in label2id.items()}

    train_df["label_id"] = train_df["label"].map(label2id)
    val_df["label_id"] = val_df["label"].map(label2id)
    test_df["label_id"] = test_df["label"].map(label2id)

    # 2. Tokenizer
    model_name = "indobenchmark/indobert-base-p1"
    print(f"Memuat tokenizer: {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    class TextDataset(torch.utils.data.Dataset):
        def __init__(self, texts, labels, tokenizer, max_len=128):
            self.texts = texts.tolist()
            self.labels = labels.tolist()
            self.tokenizer = tokenizer
            self.max_len = max_len

        def __len__(self):
            return len(self.texts)

        def __getitem__(self, idx):
            item = self.tokenizer(
                self.texts[idx],
                truncation=True,
                padding="max_length",
                max_length=self.max_len,
                return_tensors="pt"
            )
            item = {key: val.squeeze(0) for key, val in item.items()}
            item["labels"] = torch.tensor(self.labels[idx], dtype=torch.long)
            return item

    train_dataset = TextDataset(train_df["clean_text"], train_df["label_id"], tokenizer)
    val_dataset = TextDataset(val_df["clean_text"], val_df["label_id"], tokenizer)
    test_dataset = TextDataset(test_df["clean_text"], test_df["label_id"], tokenizer)

    # 3. Model
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=3,
        id2label=id2label,
        label2id=label2id
    )

    def compute_metrics(pred):
        labels = pred.label_ids
        preds = pred.predictions.argmax(-1)
        acc = accuracy_score(labels, preds)
        p, r, f1, _ = precision_recall_fscore_support(labels, preds, average="macro", zero_division=0)
        return {
            "accuracy": acc,
            "macro_precision": p,
            "macro_recall": r,
            "macro_f1": f1
        }

    # 4. Training Arguments (Disesuaikan untuk VRAM 4GB RTX 3050)
    use_fp16 = dep_status["cuda_available"]
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=epochs,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        gradient_accumulation_steps=2,
        learning_rate=lr,
        weight_decay=0.01,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="macro_f1",
        fp16=use_fp16,
        logging_steps=50,
        save_total_limit=2,
        seed=42
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics
    )

    print("\nMelatih model IndoBERT...")
    start_t = time.time()
    trainer.train()
    train_time = time.time() - start_t

    # 5. Evaluasi pada Test Set
    print("\nEvaluasi pada Test Set...")
    test_res = trainer.evaluate(test_dataset)
    print("Hasil Evaluasi Test Set IndoBERT:", test_res)

    # 6. Simpan Model & Tokenizer
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    metadata = {
        "model_name": "IndoBERT (indobenchmark/indobert-base-p1)",
        "version": "1.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "training_time_seconds": round(train_time, 2),
        "classes": ["Normal", "Promosi", "Scam"],
        "metrics_test": test_res,
        "hardware": dep_status["gpu_name"]
    }
    with open(os.path.join(OUTPUT_DIR, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nModel IndoBERT berhasil disimpan ke: {OUTPUT_DIR}")

if __name__ == "__main__":
    if "--train" in sys.argv:
        run_indobert_finetuning()
    else:
        status = check_dependencies()
        print_setup_instructions(status)
