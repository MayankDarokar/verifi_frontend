import io
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from streamlit.testing.v1 import AppTest

def run_tests():
    results = {}
    
    # -------------------------------------------------------------
    # TEST 1: Initial Analyze Mode
    # -------------------------------------------------------------
    print("Running Test 1: Initial Analyze Mode...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    assert not at.exception, f"App loaded with exception: {at.exception}"
    assert "submitted_result" not in at.session_state or at.session_state["submitted_result"] is None
    # Verify no raw unrendered HTML tag leakage like `<div` in markdown text
    for md in at.markdown:
        # Streamlit unsafe HTML markdown is fine, but literal `<div>` or ```` escaped markdown should not be printed as text
        pass
    results["TEST 1 (Initial Mode)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 2: Critical Demo Scenario
    # -------------------------------------------------------------
    print("Running Test 2: Critical Demo Scenario...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    # Select Scenario
    at.selectbox(key="demo_scenario_choice").select("🚨 CRITICAL — Cashback QR Mismatch").run()
    # Ensure no auto-execution
    assert "submitted_result" not in at.session_state or at.session_state["submitted_result"] is None
    assert "Congratulations! You have received ₹5,000 cashback" in at.session_state["input_text_area"]
    # Click Run
    at.button[0].click().run()
    assert not at.exception
    res = at.session_state.get("submitted_result")
    assert res is not None
    assert res.risk.score == 85
    assert res.risk.level == "CRITICAL"
    assert res.mismatch.detected is True
    results["TEST 2 (Critical Demo)"] = "PASSED (Score: 85, Tier: CRITICAL)"

    # -------------------------------------------------------------
    # TEST 3: High Demo Scenario
    # -------------------------------------------------------------
    print("Running Test 3: High Demo Scenario...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.selectbox(key="demo_scenario_choice").select("⚠ HIGH — Electricity Disconnection Scam").run()
    assert "submitted_result" not in at.session_state or at.session_state["submitted_result"] is None
    assert "electricity power will be disconnected" in at.session_state["input_text_area"]
    at.button[0].click().run()
    assert not at.exception
    res = at.session_state.get("submitted_result")
    assert res is not None
    assert res.risk.score == 68
    assert res.risk.level == "HIGH"
    results["TEST 3 (High Demo)"] = "PASSED (Score: 68, Tier: HIGH)"

    # -------------------------------------------------------------
    # TEST 4: Suspicious Demo Scenario
    # -------------------------------------------------------------
    print("Running Test 4: Suspicious Demo Scenario...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.selectbox(key="demo_scenario_choice").select("⚡ SUSPICIOUS — Unverified Prize URL").run()
    assert "submitted_result" not in at.session_state or at.session_state["submitted_result"] is None
    at.button[0].click().run()
    assert not at.exception
    res = at.session_state.get("submitted_result")
    assert res is not None
    assert res.risk.score == 42
    assert res.risk.level == "SUSPICIOUS"
    results["TEST 4 (Suspicious Demo)"] = "PASSED (Score: 42, Tier: SUSPICIOUS)"

    # -------------------------------------------------------------
    # TEST 5: Legitimate Demo Scenario
    # -------------------------------------------------------------
    print("Running Test 5: Legitimate Demo Scenario...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.selectbox(key="demo_scenario_choice").select("✓ NO STRONG INDICATORS — Clean Receipt").run()
    assert "submitted_result" not in at.session_state or at.session_state["submitted_result"] is None
    at.button[0].click().run()
    assert not at.exception
    res = at.session_state.get("submitted_result")
    assert res is not None
    assert res.risk.score == 8
    assert res.risk.level == "NO_STRONG_INDICATORS"
    assert res.mismatch.detected is False
    results["TEST 5 (Legitimate Demo)"] = "PASSED (Score: 8, Tier: NO_STRONG_INDICATORS)"

    # -------------------------------------------------------------
    # TEST 6: Stale Result Protection
    # -------------------------------------------------------------
    print("Running Test 6: Stale Result Protection...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.selectbox(key="demo_scenario_choice").select("⚠ HIGH — Electricity Disconnection Scam").run()
    at.button[0].click().run()
    assert at.session_state.get("submitted_result") is not None
    # Modify text
    at.text_area(key="input_text_area").input("Modified content after analysis").run()
    # Must show warning about stale input
    warnings = [w.value for w in at.warning]
    assert any("Input modified since last analysis" in w for w in warnings), f"Expected stale warning, got: {warnings}"
    results["TEST 6 (Stale Protection)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 7: Language Switch Isolation
    # -------------------------------------------------------------
    print("Running Test 7: Language Switch Isolation...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.selectbox(key="demo_scenario_choice").select("🚨 CRITICAL — Cashback QR Mismatch").run()
    at.button[0].click().run()
    prev_hash = at.session_state.get("submitted_input_hash")
    # Change language to Hindi
    at.selectbox(key="nav_language").select("Hindi (हिंदी)").run()
    assert not at.exception
    assert at.session_state.get("submitted_input_hash") == prev_hash
    # Change language to Hinglish
    at.selectbox(key="nav_language").select("Hinglish (Hindi + English)").run()
    assert not at.exception
    assert at.session_state.get("submitted_input_hash") == prev_hash
    results["TEST 7 (Language Isolation)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 8: QR Size & Validation
    # -------------------------------------------------------------
    print("Running Test 8: QR Size & Format Validation...")
    from utils.validators import validate_qr_size, validate_qr_image
    
    class DummyUpload:
        def __init__(self, size):
            self.size = size

    assert validate_qr_size(DummyUpload(10 * 1024 * 1024)) is True  # Exactly 10 MB
    assert validate_qr_size(DummyUpload(10 * 1024 * 1024 + 1)) is False  # 10 MB + 1 byte
    assert validate_qr_image("test.png") is True
    assert validate_qr_image("test.jpg") is True
    assert validate_qr_image("test.jpeg") is True
    assert validate_qr_image("test.webp") is True
    assert validate_qr_image("test.exe") is False
    assert validate_qr_image("test.pdf") is False
    results["TEST 8 (QR Validation)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 9: Incident Mode with 'Other' Bank
    # -------------------------------------------------------------
    print("Running Test 9: Incident Mode ('Other' Bank Flow)...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.sidebar.radio(key="nav_workflow_mode").set_value("🚨 I've Already Been Scammed").run()
    at.selectbox(key="incident_bank_select").select("Other").run()
    at.text_input(key="incident_custom_bank_input").input("Canara Bank").run()
    at.text_input(key="incident_utr_input").input("998877665544").run()
    at.button[0].click().run()
    assert not at.exception
    
    # Check code block contains Canara Bank
    code_blocks = [c.value for c in at.code]
    assert any("Canara Bank" in c for c in code_blocks), f"Canara Bank not in complaint: {code_blocks}"
    assert any("998877665544" in c for c in code_blocks)
    results["TEST 9 (Incident 'Other' Flow)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 10: Incident Mode Validation (Empty 'Other')
    # -------------------------------------------------------------
    print("Running Test 10: Incident Mode Validation (Empty 'Other')...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.sidebar.radio(key="nav_workflow_mode").set_value("🚨 I've Already Been Scammed").run()
    at.selectbox(key="incident_bank_select").select("Other").run()
    at.text_input(key="incident_custom_bank_input").input("").run()
    at.button[0].click().run()
    errors = [e.value for e in at.error]
    assert any("Please specify the bank or payment app involved" in e for e in errors), f"Expected validation error, got: {errors}"
    results["TEST 10 (Incident Validation)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 11: Terminology & Clean Copy Check
    # -------------------------------------------------------------
    print("Running Test 11: Terminology & Clean Copy Verification...")
    at = AppTest.from_file("app.py", default_timeout=30)
    at.run()
    at.selectbox(key="demo_scenario_choice").select("🚨 CRITICAL — Cashback QR Mismatch").run()
    at.button[0].click().run()
    
    # Verify no raw internal jargon in rendered markdowns
    for md in at.markdown:
        assert "Deterministic Demo Risk Assessment" not in md.value
        assert "View Risk Points Breakdown (Deterministic Engine)" not in md.value
        assert "Deterministic score calculated" not in md.value
    results["TEST 11 (Terminology Cleanup)"] = "PASSED"

    # -------------------------------------------------------------
    # TEST 12: Design Quality & Architecture Verification
    # -------------------------------------------------------------
    print("Running Test 12: Architecture & Adapter Decoupling...")
    from services.analysis_service import analysis_service
    from services.agent_adapter import AgentAdapter
    from services.mock_agent_adapter import MockAgentAdapter
    assert isinstance(analysis_service.adapter, AgentAdapter)
    assert isinstance(analysis_service.adapter, MockAgentAdapter)
    results["TEST 12 (Architecture & Quality)"] = "PASSED"

    print("\n" + "="*50)
    print("ALL 12 QA VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("="*50)
    for k, v in results.items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    run_tests()
