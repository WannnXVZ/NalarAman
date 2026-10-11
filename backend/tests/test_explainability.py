from app.services.explainability_service import explain_prediction

def test_explain_prediction_scam_message():
    text = "Selamat nomor Anda memenangkan undian Rp 50.000.000 dari BRImo. Klaim segera di link http://hadiah-brimo.xyz"
    explanation = explain_prediction(text, "Scam")
    
    assert explanation.method == "LIME"
    assert explanation.available is True
    assert len(explanation.contributions) > 0
    assert explanation.computation_time_ms is not None
    assert explanation.computation_time_ms > 0
    
    tokens = [c.token.lower() for c in explanation.contributions]
    # Salah satu token pemicu scam harus teridentifikasi
    assert any(t in tokens for t in ["undian", "hadiah", "klaim", "segera", "brimo", "link", "xyz"])

def test_explain_prediction_normal_message():
    text = "Halo bu besok arisan keluarga jadi di rumah paman jam 10 ya terima kasih."
    explanation = explain_prediction(text, "Normal")
    
    assert explanation.method == "LIME"
    assert explanation.available is True
    assert len(explanation.contributions) > 0
