import time
import traceback
from typing import List, Literal, Optional
from lime.lime_text import LimeTextExplainer
from app.schemas.analyze_response import LimeExplanation, LimeContribution
from app.ml.model_loader import model_manager
from app.core.logging import logger

_explainer_instance: Optional[LimeTextExplainer] = None

def get_lime_explainer() -> LimeTextExplainer:
    """Menginisialisasi explainer LIME dengan kelas prediksi model"""
    global _explainer_instance
    if _explainer_instance is None:
        classes = model_manager.classes if model_manager.classes else ["Normal", "Promosi", "Scam"]
        _explainer_instance = LimeTextExplainer(
            class_names=classes,
            random_state=42,
            bow=True
        )
    return _explainer_instance

def explain_prediction(text: str, predicted_label: Literal["Normal", "Scam", "Promosi"]) -> LimeExplanation:
    """
    Menghasilkan penjelasan Explainable AI menggunakan LIME (PRD Bab 22).
    Mengukur kontribusi lokal kata/frasa terhadap probabilitas kelas prediksi model.
    """
    start_time = time.time()

    # Periksa apakah model ML aktual telah siap dimuat
    if not model_manager.is_ready or model_manager.classification_model is None or model_manager.vectorizer is None:
        return LimeExplanation(
            method="LIME",
            available=False,
            contributions=[],
            reason="Komponen LIME tidak dapat dijalankan karena model klasifikasi belum siap dimuat.",
            computation_time_ms=None
        )

    try:
        explainer = get_lime_explainer()

        # Fungsi probabilitas untuk evaluasi lokal LIME
        def predict_proba_fn(texts: list) -> list:
            vecs = model_manager.vectorizer.transform(texts)
            return model_manager.classification_model.predict_proba(vecs)

        # Temukan index target kelas prediksi di classes
        classes = list(model_manager.classes)
        target_idx = classes.index(predicted_label) if predicted_label in classes else 0
        scam_idx = classes.index("Scam") if "Scam" in classes else 0

        # Jalankan estimasi perturbasi lokal LIME (200 sampel untuk latensi cepat)
        exp = explainer.explain_instance(
            text_instance=text,
            classifier_fn=predict_proba_fn,
            labels=[target_idx, scam_idx],
            num_features=6,
            num_samples=200
        )

        # Ambil kontribusi fitur terkait Scam
        raw_contributions = exp.as_list(label=scam_idx)
        contributions: List[LimeContribution] = []

        for token, weight in raw_contributions:
            token_clean = token.strip()
            if not token_clean:
                continue

            if weight > 0:
                direction = "mendukung_scam"
            elif weight < 0:
                direction = "menurunkan_skor_scam"
            else:
                direction = "netral"

            contributions.append(LimeContribution(
                token=token_clean,
                weight=round(float(weight), 4),
                direction=direction
            ))

        # Urutkan berdasarkan nilai mutlak bobot
        contributions.sort(key=lambda x: abs(x.weight), reverse=True)
        computation_time = int((time.time() - start_time) * 1000)

        return LimeExplanation(
            method="LIME",
            available=True,
            contributions=contributions[:6],
            reason=None,
            computation_time_ms=computation_time
        )

    except Exception as e:
        logger.warning(f"LIME calculation failed gracefully: {e}\n{traceback.format_exc()}")
        computation_time = int((time.time() - start_time) * 1000)
        return LimeExplanation(
            method="LIME",
            available=False,
            contributions=[],
            reason=f"Perhitungan LIME mengalami kendala: {str(e)}",
            computation_time_ms=computation_time
        )
