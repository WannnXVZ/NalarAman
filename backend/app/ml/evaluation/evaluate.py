import os
import json
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support

def evaluate_saved_model(artifact_dir: str = None, test_csv_path: str = None):
    """
    Evaluasi independen terhadap artefak model yang tersimpan pada data uji (PRD Bab 28).
    """
    base_dir = os.path.dirname(__file__)
    if artifact_dir is None:
        artifact_dir = os.path.join(base_dir, "../artifacts/tfidf_lr_v1")
    if test_csv_path is None:
        test_csv_path = os.path.join(base_dir, "../../../data/processed/test.csv")

    model_path = os.path.join(artifact_dir, "model.joblib")
    vec_path = os.path.join(artifact_dir, "vectorizer.joblib")

    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        raise FileNotFoundError("Artefak model atau vectorizer tidak ditemukan!")

    model = joblib.load(model_path)
    vectorizer = joblib.load(vec_path)
    test_df = pd.read_csv(test_csv_path)

    X_test_vec = vectorizer.transform(test_df["clean_text"])
    y_test = test_df["label"]
    y_pred = model.predict(X_test_vec)

    acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=list(model.classes_))

    print("=== Evaluasi Independen Artefak Model ===")
    print(f"Accuracy : {acc:.4f}")
    print(f"Macro F1 : {f1:.4f}")
    print("\nConfusion Matrix:")
    print(cm)

    return {
        "accuracy": acc,
        "macro_precision": prec,
        "macro_recall": rec,
        "macro_f1": f1,
        "classes": list(model.classes_),
        "classification_report": report,
        "confusion_matrix": cm.tolist()
    }

if __name__ == "__main__":
    evaluate_saved_model()
