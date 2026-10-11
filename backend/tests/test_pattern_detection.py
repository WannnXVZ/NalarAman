from app.services.pattern_detection_service import detect_social_engineering_patterns

def test_detect_urgency_and_apk():
    text = "Segera buka berkas undangan pernikahan kami di lampiran surat_undangan.apk sebelum hangus hari ini."
    indicators = detect_social_engineering_patterns(text)
    indicator_names = [i.indicator for i in indicators]
    assert any("Urgensi" in name for name in indicator_names)
    assert any("APK" in name for name in indicator_names)

def test_detect_normal_message():
    text = "Halo ayah, besok kita kumpul makan malam bersama di rumah paman ya."
    indicators = detect_social_engineering_patterns(text)
    assert len(indicators) == 0
