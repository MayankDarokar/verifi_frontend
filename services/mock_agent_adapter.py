"""Provisional Mock Agent Adapter for VeriFi.

Simulates the intelligence layer, tool invocations, and deterministic risk output
until Aditya's real LangGraph agent backend is integrated.
"""

from typing import Optional
from data.fixtures.scenarios import SCENARIOS
from models.analysis_result import (
    AnalysisResult,
    RiskAssessment,
    IntentInfo,
    MechanismInfo,
    MismatchInfo,
    EvidenceItem,
    TraceEvent,
    ActionPlan,
)
from services.agent_adapter import AgentAdapter


class MockAgentAdapter(AgentAdapter):
    """
    Mock implementation of AgentAdapter for frontend development & hermetic demos.
    """

    def analyze(
        self,
        user_input: str,
        input_type: str = "text",
        language: str = "English",
        scenario_key: Optional[str] = None,
    ) -> AnalysisResult:
        """
        Produce a structured AnalysisResult using fixtures or dynamic heuristics.
        """
        # If explicit fixture scenario requested, return it directly
        if scenario_key and scenario_key in SCENARIOS:
            res = SCENARIOS[scenario_key].model_copy(deep=True)
            res.language = language
            return res

        text_lower = user_input.lower().strip()

        # Dynamic heuristic simulation for arbitrary text/URL inputs
        if "cashback" in text_lower or "claim" in text_lower or "qr" in text_lower or "scan" in text_lower or input_type == "qr":
            res = SCENARIOS["cashback_qr_mismatch"].model_copy(deep=True)
            res.input_type = input_type
            res.user_input_preview = user_input[:150] + ("..." if len(user_input) > 150 else "")
            res.language = language
            return res

        elif "electricity" in text_lower or "power" in text_lower or "disconnect" in text_lower or "bill" in text_lower:
            res = SCENARIOS["electricity_bill_scam"].model_copy(deep=True)
            res.input_type = input_type
            res.user_input_preview = user_input[:150] + ("..." if len(user_input) > 150 else "")
            res.language = language
            return res

        elif "lottery" in text_lower or "winner" in text_lower or "prize" in text_lower or "kbc" in text_lower or input_type == "url":
            res = SCENARIOS["lottery_prize_url"].model_copy(deep=True)
            res.input_type = input_type
            res.user_input_preview = user_input[:150] + ("..." if len(user_input) > 150 else "")
            res.language = language
            return res

        elif "paid" in text_lower or "receipt" in text_lower or "order" in text_lower or "ref" in text_lower:
            res = SCENARIOS["legitimate_merchant_receipt"].model_copy(deep=True)
            res.input_type = input_type
            res.user_input_preview = user_input[:150] + ("..." if len(user_input) > 150 else "")
            res.language = language
            return res

        # Generic Suspicious fallback when unknown text is provided
        return AnalysisResult(
            input_type=input_type, # type: ignore
            user_input_preview=user_input[:150] + ("..." if len(user_input) > 150 else ""),
            language=language,
            risk=RiskAssessment(
                score=35,
                level="SUSPICIOUS",
                score_breakdown=[
                    {"signal": "Unverified Financial Instruction", "points": 20},
                    {"signal": "Unknown Counterparty Pattern", "points": 15},
                ]
            ),
            intent=IntentInfo(
                label="TRANSACTION_REQUEST",
                confidence=0.75,
                summary="Unidentified financial solicitation or payment instruction."
            ),
            mechanism=MechanismInfo(
                label="MANUAL_ACTION",
                summary="Prompts the recipient to take an unverified action or follow external links."
            ),
            mismatch=MismatchInfo(
                detected=True,
                severity="HIGH",
                explanation="SUSPICIOUS: The message requests financial action without standard institutional authentication or verified identity."
            ),
            evidence=[
                EvidenceItem(
                    title="Unverified Message Origin",
                    detail="Originating source is unauthenticated and not linked to verified merchant records.",
                    category="Pattern",
                    severity="SUSPICIOUS"
                ),
            ],
            trace=[
                TraceEvent(step_number=1, title="User submitted content parsed", status="done", detail="Input normalized"),
                TraceEvent(step_number=2, title="Entity Extractor: Evaluated key phrases and financial context", status="done", detail="Heuristics scanned"),
                TraceEvent(step_number=3, title="Risk Engine: Deterministic score calculated = 35 (SUSPICIOUS)", status="warning", detail="Borderline risk tier"),
                TraceEvent(step_number=4, title="Planner: Recommended verification before taking action", status="action", detail="Dispatched precautionary checklist"),
            ],
            action_plan=ActionPlan(
                summary="Exercise caution. Verify the sender's identity through official independent channels.",
                steps=[
                    "Do not transfer funds, share OTPs, or scan QR codes until independently verified.",
                    "Call the official institution's verified customer support number directly.",
                    "If in doubt, ignore and report the message."
                ],
                helpline="National Cyber Crime Helpline: 1930"
            ),
            explanation="The provided input contains unverified financial solicitations. Verify credentials before acting."
        )
