"""Pydantic models defining the structured contracts for VeriFi."""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


RiskLevel = Literal["CRITICAL", "HIGH", "SUSPICIOUS", "NO_STRONG_INDICATORS"]


class EvidenceItem(BaseModel):
    """An individual piece of verifiable evidence observed by the agent."""
    title: str = Field(..., description="Short descriptive title of the evidence")
    detail: str = Field(..., description="Factual detail observed (not speculation)")
    category: str = Field(
        default="General",
        description="Category: e.g. 'UPI / QR Mechanism', 'Domain & URL', 'Social Engineering', 'Header / Meta'"
    )
    severity: Literal["CRITICAL", "HIGH", "SUSPICIOUS", "INFO"] = Field(
        default="INFO",
        description="Severity contribution of this specific evidence item"
    )


class TraceEvent(BaseModel):
    """An observable step in the agent's decision trace."""
    step_number: int = Field(..., description="Sequence number of the action")
    title: str = Field(..., description="Observable action taken by the agent")
    status: Literal["done", "warning", "action", "pending"] = Field(
        default="done",
        description="Visual status icon for the trace: 'done' (✓), 'warning' (⚠), 'action' (→), 'pending' (○)"
    )
    detail: Optional[str] = Field(
        default=None,
        description="Optional supporting context for the trace step"
    )


class IntentInfo(BaseModel):
    """Stated or implied intent extracted from the user input/message."""
    label: str = Field(..., description="E.g. RECEIVE_MONEY, CLAIM_REWARD, VERIFY_ACCOUNT, PAY_BILL")
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Confidence in intent extraction")
    stated_amount: Optional[float] = Field(default=None, description="Amount stated in the message (if any)")
    summary: str = Field(..., description="Plain-language description of what the message promises or claims")


class MechanismInfo(BaseModel):
    """Actual technical payment/action mechanism discovered from QR, link, or instruction."""
    label: str = Field(..., description="E.g. SEND_MONEY, UPI_COLLECT, CREDENTIAL_HARVESTING, PHISHING_PAGE")
    actual_amount: Optional[float] = Field(default=None, description="Actual amount that will be debited or transferred")
    target_upi_id: Optional[str] = Field(default=None, description="Extracted UPI ID (VPA) if present")
    target_url: Optional[str] = Field(default=None, description="Destination URL if present")
    summary: str = Field(..., description="Plain-language description of what the technical mechanism will actually execute")


class MismatchInfo(BaseModel):
    """Intent vs Mechanism mismatch analysis — Tier-1 Core Feature."""
    detected: bool = Field(..., description="Whether intent and mechanism conflict")
    severity: Literal["CRITICAL", "HIGH", "NONE"] = Field(
        default="NONE",
        description="Severity of the detected mismatch"
    )
    explanation: str = Field(..., description="Clear explanation of why intent and mechanism conflict or align")


class ActionPlan(BaseModel):
    """Actionable guidance and next steps for the user."""
    summary: str = Field(..., description="Immediate primary recommendation")
    steps: List[str] = Field(default_factory=list, description="Ordered actionable checklist")
    helpline: Optional[str] = Field(
        default="National Cyber Crime Helpline: 1930 | cybercrime.gov.in",
        description="Official helpline / portal reference"
    )


class RiskAssessment(BaseModel):
    """Deterministic risk assessment calculated by the backend risk engine."""
    score: int = Field(..., ge=0, le=135, description="Deterministic risk score (0-135)")
    level: RiskLevel = Field(..., description="Deterministic category: CRITICAL, HIGH, SUSPICIOUS, NO_STRONG_INDICATORS")
    score_breakdown: List[dict] = Field(
        default_factory=list,
        description="Points breakdown by signal, e.g. [{'signal': 'Intent–Mechanism Mismatch', 'points': 40}]"
    )


class AnalysisResult(BaseModel):
    """
    Provisional Top-Level Contract for VeriFi Analysis.
    
    This is the structured result returned by the agent adapter to the frontend.
    The frontend renders this data without calculating or overriding risk.
    """
    input_type: Literal["text", "url", "qr"] = Field(..., description="Type of input analyzed")
    user_input_preview: str = Field(..., description="Truncated or sanitized preview of the input")
    language: str = Field(default="English", description="Target language: English, Hinglish, Hindi")
    
    risk: RiskAssessment = Field(..., description="Risk assessment object")
    intent: IntentInfo = Field(..., description="Extracted intent details")
    mechanism: MechanismInfo = Field(..., description="Extracted mechanism details")
    mismatch: MismatchInfo = Field(..., description="Intent vs mechanism mismatch evaluation")
    
    evidence: List[EvidenceItem] = Field(default_factory=list, description="Observed factual evidence items")
    trace: List[TraceEvent] = Field(default_factory=list, description="Observable agent decision trace")
    action_plan: ActionPlan = Field(..., description="Recommended user action plan")
    explanation: str = Field(default="", description="Executive summary synthesized by the agent")


# Backward compatibility alias
MockAnalysisResult = AnalysisResult