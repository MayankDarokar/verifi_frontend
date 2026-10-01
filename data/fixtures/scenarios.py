"""Hermetic scenario fixtures for VeriFi demo & testing.

Provides deterministic test cases across all 4 risk levels:
1. CRITICAL (Intent-Mechanism Mismatch: Cashback QR scam)
2. HIGH (Urgency & Phishing APK: Electricity disconnection threat)
3. SUSPICIOUS (Unverified domain lottery prize claim)
4. NO_STRONG_INDICATORS (Legitimate transaction receipt / aligned intent)
"""

from typing import Dict
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


SCENARIOS: Dict[str, AnalysisResult] = {
    "cashback_qr_mismatch": AnalysisResult(
        input_type="qr",
        user_input_preview="QR image with message: 'Congratulations! Scan to receive ₹5,000 cashback directly in your bank.'",
        language="English",
        risk=RiskAssessment(
            score=85,
            level="CRITICAL",
            score_breakdown=[
                {"signal": "Intent–Mechanism Mismatch", "points": 40},
                {"signal": "UPI Payment Request (Collection) Detected", "points": 25},
                {"signal": "Deceptive Reward / Urgency Framing", "points": 20},
            ]
        ),
        intent=IntentInfo(
            label="RECEIVE_MONEY",
            confidence=0.96,
            stated_amount=5000.0,
            summary="User is told they will RECEIVE ₹5,000 as cashback reward."
        ),
        mechanism=MechanismInfo(
            label="SEND_MONEY",
            actual_amount=5000.0,
            target_upi_id="claim_cashback99@okicici",
            target_url="upi://pay?pa=claim_cashback99@okicici&pn=CashbackPortal&am=5000&cu=INR",
            summary="The QR encodes a UPI 'pay' command that will DEBIT ₹5,000 from the user's account."
        ),
        mismatch=MismatchInfo(
            detected=True,
            severity="CRITICAL",
            explanation="CRITICAL CONFLICT: The message promises that you will RECEIVE ₹5,000, but scanning this QR code actually executes a payment instruction to SEND ₹5,000 to an unknown UPI handle."
        ),
        evidence=[
            EvidenceItem(
                title="UPI Protocol Direction Mismatch",
                detail="Payload is 'upi://pay' with parameter am=5000 instead of a credit authorization.",
                category="UPI / QR Mechanism",
                severity="CRITICAL"
            ),
            EvidenceItem(
                title="Deceptive Cashback Claim",
                detail="Legitimate UPI cashbacks are credited directly to bank accounts without scanning payment QRs or entering UPI PIN.",
                category="Social Engineering",
                severity="HIGH"
            ),
            EvidenceItem(
                title="Unverified Private VPA",
                detail="Destination VPA 'claim_cashback99@okicici' is a private account, not a verified corporate merchant.",
                category="UPI / QR Mechanism",
                severity="HIGH"
            ),
        ],
        trace=[
            TraceEvent(step_number=1, title="Content received for payment verification", status="done", detail="Input extracted successfully"),
            TraceEvent(step_number=2, title="Intent identified: User told they will RECEIVE ₹5,000", status="done", detail="Confidence: 96%"),
            TraceEvent(step_number=3, title="QR decoded: Extracted UPI payment URI payload", status="done", detail="Payload successfully parsed"),
            TraceEvent(step_number=4, title="Mechanism identified: Technical instruction requests user to SEND ₹5,000", status="done", detail="Action: UPI Debit"),
            TraceEvent(step_number=5, title="Conflict detected: Intent–Mechanism Mismatch confirmed", status="warning", detail="Receive Intent vs Send Mechanism"),
            TraceEvent(step_number=6, title="Risk assessed: 85/100 — Critical deception indicators present", status="warning", detail="Score >= 75 triggers CRITICAL tier"),
            TraceEvent(step_number=7, title="Action plan: Immediate defensive guidance prepared", status="action", detail="Dispatched emergency guidance"),
        ],
        action_plan=ActionPlan(
            summary="DO NOT scan this QR code and NEVER enter your UPI PIN to receive money.",
            steps=[
                "Remember: You NEVER need to enter your UPI PIN or scan a QR code to receive money.",
                "Do not authorize any pending collect requests in GPay, PhonePe, or Paytm.",
                "Block and report the sender's mobile number or chat account immediately.",
                "If you already entered your PIN, immediately call 1930 or contact your bank to block your UPI ID and freeze the transaction."
            ],
            helpline="National Cyber Crime Helpline: 1930 | https://cybercrime.gov.in"
        ),
        explanation="This is a classic Intent–Mechanism mismatch scam. You are promised ₹5,000, but authorizing this QR will transfer ₹5,000 out of your account."
    ),

    "electricity_bill_scam": AnalysisResult(
        input_type="text",
        user_input_preview="Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact our officer at 9876543210 or visit https://bses-bill-update.xyz/pay",
        language="English",
        risk=RiskAssessment(
            score=68,
            level="HIGH",
            score_breakdown=[
                {"signal": "Urgent Disconnection Threat / Time Pressure", "points": 30},
                {"signal": "Suspicious Unofficial Domain (.xyz)", "points": 25},
                {"signal": "Personal Mobile Number as Support Contact", "points": 13},
            ]
        ),
        intent=IntentInfo(
            label="PAY_BILL",
            confidence=0.88,
            stated_amount=None,
            summary="Message claims urgent disconnection due to unpaid electricity bill."
        ),
        mechanism=MechanismInfo(
            label="PHISHING_PAGE",
            actual_amount=None,
            target_url="https://bses-bill-update.xyz/pay",
            summary="Directs victim to an unverified third-party domain likely hosting credential harvesting forms or rogue APK downloads."
        ),
        mismatch=MismatchInfo(
            detected=True,
            severity="HIGH",
            explanation="CONFLICT: Official utility companies do not send abrupt disconnection threats via personal SMS with generic phone numbers and unverified '.xyz' domains."
        ),
        evidence=[
            EvidenceItem(
                title="Unofficial Domain Registration",
                detail="Domain 'bses-bill-update.xyz' is not associated with official state DISCOMs.",
                category="Domain & URL",
                severity="HIGH"
            ),
            EvidenceItem(
                title="Extreme Artificial Urgency",
                detail="Threatens power disconnection within hours to panic the recipient into bypassing verification.",
                category="Social Engineering",
                severity="HIGH"
            ),
            EvidenceItem(
                title="Personal Mobile Contact",
                detail="Provides a personal 10-digit mobile number rather than an official DISCOM toll-free customer care line.",
                category="Pattern",
                severity="SUSPICIOUS"
            ),
        ],
        trace=[
            TraceEvent(step_number=1, title="Text message scanned for financial solicitations and entities", status="done", detail="Length: 198 characters"),
            TraceEvent(step_number=2, title="Stated purpose: Urgent electricity disconnection threat", status="done", detail="4 entities identified"),
            TraceEvent(step_number=3, title="URL analyzed: Unofficial third-party domain flagged", status="warning", detail="Flagged as non-official TLD"),
            TraceEvent(step_number=4, title="Social engineering signals: Extreme artificial urgency detected", status="warning", detail="Threat of immediate disconnection"),
            TraceEvent(step_number=5, title="Risk assessed: 68/100 — High phishing and panic-inducement signals", status="warning", detail="Score >= 50 triggers HIGH tier"),
            TraceEvent(step_number=6, title="Action plan: Safe verification protocol prepared", status="action", detail="Provided official verification steps"),
        ],
        action_plan=ActionPlan(
            summary="DO NOT click the link, download any app, or call the mobile number in the message.",
            steps=[
                "Check your electricity bill status directly through your official electricity board website or mobile app.",
                "Power utilities do not send personal mobile numbers for bill resolution.",
                "Never install remote screen-sharing applications (AnyDesk, TeamViewer, QuickSupport) if instructed by caller.",
                "Report this SMS to the Chakshu portal (sancharsaathi.gov.in) or 1930."
            ],
            helpline="Chakshu Portal: sancharsaathi.gov.in | Cyber Crime: 1930"
        ),
        explanation="High-risk phishing message mimicking an electricity utility to induce panic. Verify only on your official utility app."
    ),

    "lottery_prize_url": AnalysisResult(
        input_type="url",
        user_input_preview="https://kbc-lucky-winner-draw-2026.online/claim-prize?user_id=89234",
        language="English",
        risk=RiskAssessment(
            score=42,
            level="SUSPICIOUS",
            score_breakdown=[
                {"signal": "Unsolicited Prize / Lottery Claim", "points": 22},
                {"signal": "Newly Registered Domain (.online)", "points": 20},
            ]
        ),
        intent=IntentInfo(
            label="CLAIM_REWARD",
            confidence=0.91,
            stated_amount=2500000.0,
            summary="Claims user has won a ₹25,00,000 lucky draw prize from a popular TV show."
        ),
        mechanism=MechanismInfo(
            label="CREDENTIAL_HARVESTING",
            actual_amount=None,
            target_url="https://kbc-lucky-winner-draw-2026.online",
            summary="Web form prompting user to enter bank account details, Aadhaar number, and processing fee deposit."
        ),
        mismatch=MismatchInfo(
            detected=True,
            severity="HIGH",
            explanation="SUSPICIOUS: You cannot win a lottery or lucky draw you never officially participated in, and legitimate lotteries do not ask for upfront processing fees."
        ),
        evidence=[
            EvidenceItem(
                title="Impersonation of Known Brand",
                detail="Uses 'kbc' brand name in an unofficial domain structure.",
                category="Domain & URL",
                severity="HIGH"
            ),
            EvidenceItem(
                title="Upfront Processing Fee Pattern",
                detail="Page demands advance registration fee or tax deposit before releasing alleged funds.",
                category="Pattern",
                severity="SUSPICIOUS"
            ),
        ],
        trace=[
            TraceEvent(step_number=1, title="Destination URL parsed and structure inspected", status="done", detail="Domain: kbc-lucky-winner-draw-2026.online"),
            TraceEvent(step_number=2, title="Domain age & registration records evaluated", status="warning", detail="Domain age: < 14 days"),
            TraceEvent(step_number=3, title="Content analysis: Unsolicited prize & advance-fee patterns flagged", status="warning", detail="Keywords: lucky winner, processing fee"),
            TraceEvent(step_number=4, title="Risk assessed: 42/100 — Suspicious advance-fee indicators", status="warning", detail="Score in 25-49 range"),
            TraceEvent(step_number=5, title="Action plan: Precautionary exit guidance prepared", status="action", detail="Advising immediate closure"),
        ],
        action_plan=ActionPlan(
            summary="Close the page immediately. Do not share your bank account or Aadhaar details.",
            steps=[
                "Do not pay any 'processing fee', 'GST charge', or 'customs fee' to claim a prize.",
                "Legitimate organizations never require advance fee deposits to deliver legitimate prizes.",
                "Block the sender and report the URL on cybercrime.gov.in."
            ],
            helpline="National Cyber Crime Helpline: 1930"
        ),
        explanation="Suspicious prize solicitation. Advance-fee scams promise large sums in exchange for small upfront 'clearance' fees."
    ),

    "legitimate_merchant_receipt": AnalysisResult(
        input_type="text",
        user_input_preview="Paid ₹450 to Nature Fresh Grocery via UPI on 01 Oct 2026. UPI Ref: 427819203810. For order support, visit naturefresh.in/orders",
        language="English",
        risk=RiskAssessment(
            score=8,
            level="NO_STRONG_INDICATORS",
            score_breakdown=[
                {"signal": "Standard Transaction Confirmation", "points": 8},
            ]
        ),
        intent=IntentInfo(
            label="PAYMENT_RECEIPT",
            confidence=0.98,
            stated_amount=450.0,
            summary="Notification confirming a routine ₹450 grocery purchase payment."
        ),
        mechanism=MechanismInfo(
            label="SEND_MONEY",
            actual_amount=450.0,
            summary="Recorded debit of ₹450 aligned with merchant purchase receipt."
        ),
        mismatch=MismatchInfo(
            detected=False,
            severity="NONE",
            explanation="NO MISMATCH: The message describes a completed payment for goods purchased, and the transaction details are consistent."
        ),
        evidence=[
            EvidenceItem(
                title="Consistent Transaction Details",
                detail="Contains valid 12-digit standard UPI Reference number format without suspicious links or PIN requests.",
                category="Pattern",
                severity="INFO"
            ),
            EvidenceItem(
                title="No Coercive Language",
                detail="No urgency, threats, or demands for immediate action.",
                category="Social Engineering",
                severity="INFO"
            ),
        ],
        trace=[
            TraceEvent(step_number=1, title="Transaction confirmation details extracted", status="done", detail="Identified transaction confirmation"),
            TraceEvent(step_number=2, title="Intent identified: Routine purchase payment confirmation", status="done", detail="Confidence: 98%"),
            TraceEvent(step_number=3, title="Mechanism verified: Aligned with standard merchant debit record", status="done", detail="No active payment trigger found"),
            TraceEvent(step_number=4, title="Consistency check: Standard reference format, no coercive signals", status="done", detail="Status: Aligned"),
            TraceEvent(step_number=5, title="Risk assessed: 8/100 — No strong indicators of fraud", status="done", detail="Score < 25"),
            TraceEvent(step_number=6, title="Action plan: Standard vigilance guidance provided", status="action", detail="Standard security practices recommended"),
        ],
        action_plan=ActionPlan(
            summary="No immediate threat indicators found in this receipt. Standard vigilance recommended.",
            steps=[
                "Cross-check with your bank SMS or UPI transaction history if you do not recall this purchase.",
                "Always verify merchant names on bank statements."
            ],
            helpline="National Cyber Crime Helpline: 1930"
        ),
        explanation="No strong indicators of fraud detected. The message structure and details match standard payment confirmation receipts."
    ),
}
