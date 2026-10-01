import json
import random
from typing import List

from models.analysis_result import MockAnalysisResult, EvidenceItem


# --- Mock scenarios ---

SAFE_SCENARIO = {
    "intent": "RECEIVE_MONEY",
    "mechanism": "SEND_MONEY",
    "mismatch": False,
    "risk_level": "NO_STRONG_INDICATORS",
    "risk_score": 5,
    "evidence": [
        EvidenceItem(title="Payment request detected", detail="No conflicting payment mechanism found"),
        EvidenceItem(title="Message intent", detail="Clear receipt intent, no deception signals"),
    ],
    "explanation": "The message and mechanism align; no strong indicators of fraud.",
    "recommended_action": "Proceed with the transaction as normal, keeping standard security practices.",
    "trace": ["✓ Input received", "✓ Intent extracted", "✓ Mechanism identified", "✓ No mismatch detected", "✓ Risk calculated"],
}

SUSPICIOUS_SCENARIO = {
    "intent": "RECEIVE_MONEY",
    "mechanism": "SEND_MONEY",
    "mismatch": True,
    "risk_level": "SUSPICIOUS",
    "risk_score": 35,
    "evidence": [
        EvidenceItem(title="Intent–Mechanism mismatch", detail="Message claims receive, QR requests pay"),
        EvidenceItem(title="Payment request detected", detail="QR code encodes a UPI payment request"),
        EvidenceItem(title="Urgency detected", detail="Message urges immediate action"),
    ],
    "explanation": "Mismatch between stated intent and payment mechanism triggers a suspicious classification.",
    "recommended_action": "Verify the request through an official channel before proceeding.",
    "trace": ["✓ Input received", "✓ Intent extracted", "✓ QR decoded", "✓ Mechanism identified", "⚠ Mismatch detected", "✓ Risk calculated"],
},

HIGH_RISK_SCENARIO = {
    "intent": "RECEIVE_MONEY",
    "mechanism": "SEND_MONEY",
    "mismatch": True,
    "risk_level": "CRITICAL",
    "risk_score": 82,
    "evidence": [
        EvidenceItem(title="Intent–Mechanism mismatch", detail="Message claims receive ₹5,000, QR actually debits ₹5,000"),
        EvidenceItem(title="UPI collection request", detail="QR encodes upi://pay?pa=scammer@okicici&am=5000"),
        EvidenceItem(title="Urgency detected", detail="Message creates time pressure to scan immediately"),
        EvidenceItem(title="Payment request detected", detail="QR code requests user to send money"),
    ],
    "explanation": "CRITICAL: The stated purpose directly contradicts the actual payment mechanism. This is direct evidence of deception.",
    "recommended_action": "Do not complete the transaction. Verify the request through official channels.",
    "trace": ["✓ Input received", "✓ Intent extracted", "✓ QR decoded", "✓ Mechanism identified", "⚠ Intent–Mechanism mismatch detected", "✓ Risk calculated", "→ Action plan generated"],
},

# Pool of scenarios for random selection
SCENARIOS = [SAFE_SCENARIO, SUSPICIOUS_SCENARIO, HIGH_RISK_SCENARIO]


def get_scenario_by_name(name: str) -> dict:
    """Return a scenario dict by name, or raise ValueError."""
    mapping = {
        "safe": SAFE_SCENARIO,
        "suspicious": SUSPICIOUS_SCENARIO,
        "high_risk": HIGH_RISK_SCENARIO,
    }
    if name not in mapping:
        raise ValueError(f"Unknown scenario name: {name}")
    return mapping[name]


def get_random_scenario() -> dict:
    """Return a randomly selected scenario."""
    return random.choice(SCENARIOS)


def mock_analysis(
    user_input: str,
    input_type: str = "text",
    scenario: str | None = None,
) -> MockAnalysisResult:
    """
    Provisional mock analysis service.

    This simulates the structured response the real agent will eventually provide.
    The frontend should call this service (or a real adapter) and render the
    returned MockAnalysisResult — it must not re-implement the analysis logic.

    Args:
        user_input: The text/URL/QR content provided by the user.
        input_type: One of "text", "url", "qr".
        scenario: Optional scenario name ("safe", "suspicious", "high_risk").
            If omitted, a scenario is chosen at random.

    Returns:
        A MockAnalysisResult instance containing all structured fields the UI expects.
    """
    if scenario is None:
        scenario_data = get_random_scenario()
    else:
        scenario_data = get_scenario_by_name(scenario)

    # Build evidence list from scenario
    evidence_items = scenario_data["evidence"]

    # Construct trace from scenario's trace + input-specific steps
    base_trace = scenario_data["trace"]
    input_steps = {
        "text": ["✓ Input received", "✓ Intent extracted"],
        "url": ["✓ Input received", "✓ URL validated", "✓ Intent extracted"],
        "qr": ["✓ Input received", "✓ QR decoded", "✓ Intent extracted"],
    }
    trace = base_trace + input_steps.get(input_type, ["✓ Input received"])

    # Select appropriate intent/mechanism based on scenario
    intent = scenario_data["intent"]
    mechanism = scenario_data["mechanism"]

    # Build a human-readable mismatch explanation if mismatch is present
    if scenario_data["mismatch"]:
        mismatch_explanation = (
            f'User appears to be {intent.lower()}, but the '
            f'{input_type} mechanism requires the user to {mechanism.lower().replace("_", " ")}.'
        )
    else:
        mismatch_explanation = (
            "The stated purpose aligns with the payment mechanism; no conflict detected."
        )

    result = MockAnalysisResult(
        risk_level=scenario_data["risk_level"],
        risk_score=scenario_data["risk_score"],
        intent=intent,
        mechanism=mechanism,
        mismatch_detected=scenario_data["mismatch"],
        mismatch_explanation=mismatch_explanation,
        evidence=evidence_items,
        explanation=scenario_data["explanation"],
        recommended_action=scenario_data["recommended_action"],
        input_type=input_type,
        trace=trace,
    )

    return result