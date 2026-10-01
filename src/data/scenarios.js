/**
 * VeriFi Pre-Verified Deterministic Scenarios
 * Grounded in authentic financial threat intelligence & UPI payment protocols.
 */

export const SCENARIOS = {
  cashback_qr_mismatch: {
    id: 'cashback_qr_mismatch',
    title: 'Cashback QR Mismatch',
    badgeText: 'CRITICAL RISK',
    badgeType: 'critical',
    score: 85,
    level: 'CRITICAL',
    inputType: 'text',
    inputValue: 'Congratulations! You have received ₹5,000 cashback from PhonePe. Scan the QR code to receive money into your bank.',
    explanation: 'This is a classic Intent–Mechanism mismatch scam. You are promised ₹5,000, but authorizing this QR will transfer ₹5,000 out of your account.',
    intent: {
      label: 'RECEIVE_MONEY',
      confidence: 0.96,
      stated_amount: 5000,
      summary: 'User is told they will receive a ₹5,000 cashback reward deposited directly into their bank account.',
    },
    mechanism: {
      label: 'SEND_MONEY (UPI Debit)',
      actual_amount: 5000,
      target_upi_id: 'phonepe.cashback.claim@okaxis',
      summary: 'QR code contains a standard UPI payment payload requesting an immediate debit transfer of ₹5,000.',
    },
    mismatch: {
      detected: true,
      severity: 'CRITICAL',
      explanation: 'CLAIM: Receive ₹5,000 cashback. EXECUTION: Authorizes ₹5,000 debit from your bank account. UPI does NOT require scanning a QR or entering a PIN to receive money.',
    },
    scoreBreakdown: [
      { signal: 'Intent vs Mechanism Conflict (Receive vs Send)', points: 40 },
      { signal: 'Fake Promotion / Brand Impersonation (PhonePe)', points: 25 },
      { signal: 'UPI PIN Coercion Trigger', points: 20 },
    ],
    evidence: [
      {
        title: 'UPI Payload Conflict',
        detail: "Embedded URI structure 'upi://pay?pa=phonepe.cashback.claim@okaxis&am=5000' is an outbound debit trigger, directly contradicting the 'receive cashback' claim.",
        category: 'Payment Protocol',
        severity: 'CRITICAL',
      },
      {
        title: 'Brand Impersonation',
        detail: "Uses 'PhonePe' brand imagery and messaging patterns from an unverified source to manipulate user trust.",
        category: 'Social Engineering',
        severity: 'HIGH',
      },
      {
        title: 'Reverse Payment Vector',
        detail: 'Scammer relies on victim confusing the merchant payment screen with a fund receipt confirmation.',
        category: 'Pattern Analysis',
        severity: 'HIGH',
      },
    ],
    trace: [
      { step: 1, title: 'Content received for payment verification', status: 'done', detail: 'Payload extracted and tokenized' },
      { step: 2, title: 'Intent identified: User told they will RECEIVE ₹5,000', status: 'done', detail: 'Confidence: 96%' },
      { step: 3, title: 'QR decoded: Extracted UPI payment URI payload', status: 'done', detail: 'Payload successfully parsed' },
      { step: 4, title: 'Mechanism identified: Technical instruction requests user to SEND ₹5,000', status: 'done', detail: 'Action: Outbound UPI Debit' },
      { step: 5, title: 'Conflict detected: Intent–Mechanism Mismatch confirmed', status: 'warning', detail: 'Receive Intent vs Send Mechanism' },
      { step: 6, title: 'Risk assessed: 85/100 — Critical deception indicators present', status: 'warning', detail: 'Score >= 75 triggers CRITICAL tier' },
      { step: 7, title: 'Action plan: Immediate defensive guidance prepared', status: 'action', detail: 'Dispatched emergency protection protocol' },
    ],
    actionPlan: {
      summary: 'DO NOT scan this QR code and NEVER enter your UPI PIN to receive money.',
      steps: [
        'Remember: You NEVER need to enter your UPI PIN or scan a QR code to receive money.',
        'Do not authorize any pending collect requests in GPay, PhonePe, or Paytm.',
        'Block and report the sender mobile number or chat account immediately.',
        'If you already entered your PIN, immediately call 1930 or contact your bank to freeze the transaction.',
      ],
      helpline: 'National Cyber Crime Helpline: 1930 | https://cybercrime.gov.in',
    },
  },

  electricity_bill_scam: {
    id: 'electricity_bill_scam',
    title: 'Electricity Disconnection Scam',
    badgeText: 'HIGH RISK',
    badgeType: 'high',
    score: 68,
    level: 'HIGH',
    inputType: 'text',
    inputValue: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact our officer at 9876543210 or visit https://bses-bill-update.xyz/pay',
    explanation: 'High-risk phishing message mimicking an electricity utility to induce panic. Verify only on your official utility app.',
    intent: {
      label: 'PAY_BILL',
      confidence: 0.88,
      stated_amount: null,
      summary: 'Message claims urgent power disconnection due to an alleged un-updated monthly utility bill.',
    },
    mechanism: {
      label: 'PHISHING_PAGE',
      actual_amount: null,
      target_url: 'https://bses-bill-update.xyz/pay',
      summary: 'Directs victim to an unverified third-party domain hosting credential harvesting forms or rogue APK downloads.',
    },
    mismatch: {
      detected: true,
      severity: 'HIGH',
      explanation: 'CONFLICT: Official utility companies do not send abrupt disconnection threats via personal SMS with 10-digit mobile numbers and unverified .xyz domains.',
    },
    scoreBreakdown: [
      { signal: 'Urgent Disconnection Threat / Artificial Urgency', points: 30 },
      { signal: 'Suspicious Unofficial Domain (.xyz)', points: 25 },
      { signal: 'Personal Mobile Number as Support Contact', points: 13 },
    ],
    evidence: [
      {
        title: 'Unofficial Domain Registration',
        detail: "Domain 'bses-bill-update.xyz' is not associated with official state DISCOMs.",
        category: 'Domain & URL',
        severity: 'HIGH',
      },
      {
        title: 'Extreme Artificial Urgency',
        detail: 'Threatens power disconnection within hours to panic the recipient into bypassing verification.',
        category: 'Social Engineering',
        severity: 'HIGH',
      },
      {
        title: 'Personal Mobile Contact',
        detail: 'Provides a personal 10-digit mobile number rather than an official DISCOM toll-free customer care line.',
        category: 'Pattern Analysis',
        severity: 'SUSPICIOUS',
      },
    ],
    trace: [
      { step: 1, title: 'Text message scanned for financial solicitations and entities', status: 'done', detail: 'Length: 198 characters' },
      { step: 2, title: 'Stated purpose: Urgent electricity disconnection threat', status: 'done', detail: '4 entities identified' },
      { step: 3, title: 'URL analyzed: Unofficial third-party domain flagged', status: 'warning', detail: 'Flagged non-official TLD (.xyz)' },
      { step: 4, title: 'Social engineering signals: Extreme artificial urgency detected', status: 'warning', detail: 'Threat of immediate disconnection' },
      { step: 5, title: 'Risk assessed: 68/100 — High phishing and panic-inducement signals', status: 'warning', detail: 'Score >= 50 triggers HIGH tier' },
      { step: 6, title: 'Action plan: Safe verification protocol prepared', status: 'action', detail: 'Provided official verification steps' },
    ],
    actionPlan: {
      summary: 'DO NOT click the link, download any app, or call the mobile number in the message.',
      steps: [
        'Check your electricity bill status directly through your official electricity board website or mobile app.',
        'Power utilities never provide personal 10-digit mobile numbers for bill resolution.',
        'Never install remote screen-sharing applications (AnyDesk, TeamViewer, QuickSupport) if instructed by caller.',
        'Report this SMS to the Chakshu portal (sancharsaathi.gov.in) or dial 1930.',
      ],
      helpline: 'Chakshu Portal: sancharsaathi.gov.in | Cyber Crime: 1930',
    },
  },

  lottery_prize_url: {
    id: 'lottery_prize_url',
    title: 'Unverified Lottery Prize URL',
    badgeText: 'SUSPICIOUS ACTIVITY',
    badgeType: 'suspicious',
    score: 42,
    level: 'SUSPICIOUS',
    inputType: 'url',
    inputValue: 'https://kbc-lucky-winner-draw-2026.online/claim-prize?user_id=89234',
    explanation: 'Suspicious prize solicitation. Advance-fee scams promise large sums in exchange for small upfront clearance fees.',
    intent: {
      label: 'CLAIM_REWARD',
      confidence: 0.91,
      stated_amount: 2500000,
      summary: 'Claims user has won a ₹25,00,000 lucky draw prize from a popular TV program.',
    },
    mechanism: {
      label: 'CREDENTIAL_HARVESTING',
      actual_amount: null,
      target_url: 'https://kbc-lucky-winner-draw-2026.online',
      summary: 'Web form prompting user to enter bank account details, Aadhaar number, and an upfront processing fee deposit.',
    },
    mismatch: {
      detected: true,
      severity: 'HIGH',
      explanation: 'SUSPICIOUS: You cannot win a lottery you never participated in, and legitimate lotteries never ask for upfront processing fees.',
    },
    scoreBreakdown: [
      { signal: 'Unsolicited Prize / Lottery Claim', points: 22 },
      { signal: 'Newly Registered Domain (.online)', points: 20 },
    ],
    evidence: [
      {
        title: 'Impersonation of Known Brand',
        detail: "Uses 'kbc' brand name in an unofficial domain structure without official corporate credentials.",
        category: 'Domain & URL',
        severity: 'HIGH',
      },
      {
        title: 'Upfront Processing Fee Pattern',
        detail: 'Page demands advance registration fee or tax deposit before releasing alleged funds.',
        category: 'Pattern Analysis',
        severity: 'SUSPICIOUS',
      },
    ],
    trace: [
      { step: 1, title: 'Destination URL parsed and structure inspected', status: 'done', detail: 'Domain: kbc-lucky-winner-draw-2026.online' },
      { step: 2, title: 'Domain age & registration records evaluated', status: 'warning', detail: 'Domain age: < 14 days' },
      { step: 3, title: 'Content analysis: Unsolicited prize & advance-fee patterns flagged', status: 'warning', detail: 'Keywords: lucky winner, processing fee' },
      { step: 4, title: 'Risk assessed: 42/100 — Suspicious advance-fee indicators', status: 'warning', detail: 'Score in 25-49 range' },
      { step: 5, title: 'Action plan: Precautionary exit guidance prepared', status: 'action', detail: 'Advising immediate closure' },
    ],
    actionPlan: {
      summary: 'Close the page immediately. Do not share your bank account or Aadhaar details.',
      steps: [
        "Do not pay any 'processing fee', 'GST charge', or 'customs fee' to claim a prize.",
        'Legitimate organizations never require advance fee deposits to deliver legitimate prizes.',
        'Block the sender and report the URL on cybercrime.gov.in.',
      ],
      helpline: 'National Cyber Crime Helpline: 1930',
    },
  },

  legitimate_merchant_receipt: {
    id: 'legitimate_merchant_receipt',
    title: 'Clean Merchant Receipt',
    badgeText: 'NO STRONG INDICATORS',
    badgeType: 'clean',
    score: 8,
    level: 'NO_STRONG_INDICATORS',
    inputType: 'text',
    inputValue: 'Paid ₹450 to Nature Fresh Grocery via UPI on 01 Oct 2026. UPI Ref: 427819203810. For order support, visit naturefresh.in/orders',
    explanation: 'No strong indicators of fraud detected. The message structure and details match standard payment confirmation receipts.',
    intent: {
      label: 'PAYMENT_RECEIPT',
      confidence: 0.98,
      stated_amount: 450,
      summary: 'Notification confirming a routine ₹450 grocery purchase payment.',
    },
    mechanism: {
      label: 'SEND_MONEY (Merchant Debit)',
      actual_amount: 450,
      target_upi_id: null,
      summary: 'Recorded debit of ₹450 aligned with merchant purchase receipt.',
    },
    mismatch: {
      detected: false,
      severity: 'NONE',
      explanation: 'NO MISMATCH: The message describes a completed payment for goods purchased, and the transaction details are consistent.',
    },
    scoreBreakdown: [
      { signal: 'Standard Transaction Confirmation', points: 8 },
    ],
    evidence: [
      {
        title: 'Consistent Transaction Details',
        detail: 'Contains valid 12-digit standard UPI Reference number format without suspicious links or PIN requests.',
        category: 'Pattern Analysis',
        severity: 'INFO',
      },
      {
        title: 'No Coercive Language',
        detail: 'No urgency, threats, or demands for immediate action.',
        category: 'Social Engineering',
        severity: 'INFO',
      },
    ],
    trace: [
      { step: 1, title: 'Transaction confirmation details extracted', status: 'done', detail: 'Identified transaction confirmation' },
      { step: 2, title: 'Intent identified: Routine purchase payment confirmation', status: 'done', detail: 'Confidence: 98%' },
      { step: 3, title: 'Mechanism verified: Aligned with standard merchant debit record', status: 'done', detail: 'No active payment trigger found' },
      { step: 4, title: 'Consistency check: Standard reference format, no coercive signals', status: 'done', detail: 'Status: Aligned' },
      { step: 5, title: 'Risk assessed: 8/100 — No strong indicators of fraud', status: 'done', detail: 'Score < 25' },
      { step: 6, title: 'Action plan: Standard vigilance guidance provided', status: 'action', detail: 'Standard security practices recommended' },
    ],
    actionPlan: {
      summary: 'No immediate threat indicators found in this receipt. Standard vigilance recommended.',
      steps: [
        'Cross-check with your bank SMS or UPI transaction history if you do not recall this purchase.',
        'Always verify merchant names on bank statements.',
      ],
      helpline: 'National Cyber Crime Helpline: 1930',
    },
  },
};
