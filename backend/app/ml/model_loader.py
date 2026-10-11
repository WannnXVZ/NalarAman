import os
import joblib
from typing import Optional, Dict, Tuple

class ModelManager:
    _instance = None
    
    def __init__(self):
        self.classification_model = None
        self.vectorizer = None
        self.classes = []
        self.is_ready = False
        self._check_and_load_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def _check_and_load_models(self):
        """Memuat artefak model ML aktual dari disk (PRD Bab 16.4 & 20.1)"""
        base_dir = os.path.dirname(__file__)
        baseline_dir = os.path.join(base_dir, "artifacts/tfidf_lr_v1")
        
        model_path = os.path.join(baseline_dir, "model.joblib")
        vec_path = os.path.join(baseline_dir, "vectorizer.joblib")

        if os.path.exists(model_path) and os.path.exists(vec_path):
            try:
                self.classification_model = joblib.load(model_path)
                self.vectorizer = joblib.load(vec_path)
                self.classes = list(self.classification_model.classes_)
                self.is_ready = True
                print(f"[ModelManager] Model baseline berhasil dimuat. Kelas: {self.classes}")
            except Exception as e:
                print(f"[ModelManager] Gagal memuat artefak model: {e}")
                self.is_ready = False
        else:
            self.is_ready = False

    def predict(self, text: str) -> Tuple[str, float]:
        """
        Melakukan prediksi teks menggunakan model aktual.
        Mengembalikan: (label_tertinggi, skor_confidence)
        """
        if not self.is_ready or self.classification_model is None or self.vectorizer is None:
            # Fallback jika model belum termuat
            return "Normal", 0.50

        # Transformasi teks
        text_vec = self.vectorizer.transform([text])
        probabilities = self.classification_model.predict_proba(text_vec)[0]
        
        # Ambil probabilitas tertinggi
        max_idx = probabilities.argmax()
        label = self.classes[max_idx]
        confidence = float(probabilities[max_idx])

        return label, round(confidence, 4)

    def get_components_status(self) -> Dict[str, str]:
        return {
            "classification_model": "ready" if self.is_ready else "not_trained",
            "baseline_model": "ready" if self.is_ready else "not_configured",
            "lime_explainer": "ready",
            "ocr_engine": "not_configured"
        }

model_manager = ModelManager.get_instance()
