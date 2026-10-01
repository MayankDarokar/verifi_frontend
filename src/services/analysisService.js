/**
 * VeriFi Analysis Service
 * Coordinates investigation logic, mock agent adapters, and deterministic scoring.
 */

import { SCENARIOS } from '../data/scenarios.js';

export class AnalysisService {
  /**
   * Run full investigation on input.
   * If a preset scenario is provided, returns the verified deterministic scenario fixture.
   * If custom input is provided, evaluates dynamic fraud signals.
   */
  async runAnalysis({ inputType, payload, scenarioId, language = 'English', onProgress }) {
    // 1. If matching known scenario fixture, execute simulated progress stages
    if (scenarioId && SCENARIOS[scenarioId]) {
      await this.simulateInvestigationStages(onProgress);
      return {
        ...SCENARIOS[scenarioId],
        language,
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Custom input analysis
    await this.simulateInvestigationStages(onProgress);
    return this.evaluateCustomInput(inputType, payload, language);
  }

  /**
   * Progressively notify caller through realistic investigation milestones.
   */
  async simulateInvestigationStages(onProgress) {
    const stages = [
      { step: 1, label: 'Ingesting content & extracting entities...' },
      { step: 2, label: 'Parsing payment payload & technical URIs...' },
      { step: 3, label: 'Cross-verifying user Intent vs Payment Mechanism...' },
      { step: 4, label: 'Evaluating threat intelligence & social engineering signals...' },
      { step: 5, label: 'Synthesizing evidence & compiling actionable defense plan...' },
    ];

    if (!onProgress) return;

    for (let i = 0; i < stages.length; i++) {
      onProgress(stages[i]);
      // Small realistic processing interval
      await new Promise((resolve) => setTimeout(resolve, 320));
    }
  }

  /**
   * Dynamic heuristic evaluation for arbitrary custom messages / URLs.
   */
  evaluateCustomInput(inputType, payload, language) {
    const text = typeof payload === 'string' ? payload.toLowerCase() : '';
    let score = 20;
    let level = 'NO_STRONG_INDICATORS';
    const breakdown = [];
    const evidence = [];
    let mismatchDetected = false;
    let mismatchSeverity = 'NONE';
    let mismatchExplanation = 'No direct Intent–Mechanism conflict detected in submitted content.';

    // Rule 1: Cashback / Lottery / Prize reward claims
    if (text.includes('cashback') || text.includes('winner') || text.includes('lottery') || text.includes('prize') || text.includes('won')) {
      score += 35;
      breakdown.push({ signal: 'Unsolicited Reward / Cashback Incentive', points: 35 });
      evidence.push({
        title: 'Unsolicited Financial Incentive',
        detail: 'Message promises sudden monetary rewards or cashback to induce user action.',
        category: 'Social Engineering',
        severity: 'HIGH',
      });
      mismatchDetected = true;
      mismatchSeverity = 'HIGH';
      mismatchExplanation = 'SUSPICIOUS: The message promises a reward, but requests you to scan/click to authenticate.';
    }

    // Rule 2: Urgent disconnection / threats
    if (text.includes('disconnect') || text.includes('block') || text.includes('suspend') || text.includes('urgent') || text.includes('tonight')) {
      score += 30;
      breakdown.push({ signal: 'High Urgency / Account Suspension Threat', points: 30 });
      evidence.push({
        title: 'Coercive Urgency Pattern',
        detail: 'Threatens immediate service cutoff or account closure to bypass standard scrutiny.',
        category: 'Social Engineering',
        severity: 'HIGH',
      });
    }

    // Rule 3: Suspicious link / APK / unofficial domain
    if (text.includes('.xyz') || text.includes('.top') || text.includes('.online') || text.includes('bit.ly') || text.includes('tinyurl')) {
      score += 25;
      breakdown.push({ signal: 'Unofficial / Low-Reputation Domain Structure', points: 25 });
      evidence.push({
        title: 'Unverified Web Destination',
        detail: 'Destination URL uses generic or newly registered top-level domains.',
        category: 'Domain & URL',
        severity: 'HIGH',
      });
    }

    // Rule 4: QR Image Payload
    if (inputType === 'qr') {
      score += 20;
      breakdown.push({ signal: 'QR Code Payment Trigger Detected', points: 20 });
      evidence.push({
        title: 'Embedded Payment Payload',
        detail: 'Attached QR contains a payment instruction requiring verification.',
        category: 'Payment Protocol',
        severity: 'SUSPICIOUS',
      });
    }

    // Cap score at 100
    score = Math.min(score, 100);

    if (score >= 75) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 25) level = 'SUSPICIOUS';
    else level = 'NO_STRONG_INDICATORS';

    return {
      id: 'custom_analysis',
      title: 'Custom Content Investigation',
      badgeText: `${level} RISK`,
      score,
      level,
      inputType,
      inputValue: typeof payload === 'string' ? payload : payload?.name || 'Uploaded QR',
      explanation: score >= 50
        ? 'High indicators of financial deception or phishing detected. Do not proceed with payment or credential entry.'
        : 'Evidence evaluated. Exercise standard caution with unverified payment requests.',
      intent: {
        label: score >= 50 ? 'FINANCIAL_SOLICITATION' : 'GENERAL_COMMUNICATION',
        confidence: 0.85,
        stated_amount: null,
        summary: 'Parsed solicitation from submitted message content.',
      },
      mechanism: {
        label: inputType === 'url' ? 'WEB_PORTAL' : inputType === 'qr' ? 'UPI_QR_DEBIT' : 'MESSAGE_INSTRUCTION',
        actual_amount: null,
        target_url: inputType === 'url' ? payload : null,
        summary: 'Target destination or instruction requested by the sender.',
      },
      mismatch: {
        detected: mismatchDetected,
        severity: mismatchSeverity,
        explanation: mismatchExplanation,
      },
      scoreBreakdown: breakdown.length > 0 ? breakdown : [{ signal: 'Baseline Verification Check', points: score }],
      evidence: evidence.length > 0 ? evidence : [
        {
          title: 'Standard Message Structure',
          detail: 'No overt high-severity indicators identified in the current input sample.',
          category: 'Pattern Analysis',
          severity: 'INFO',
        },
      ],
      trace: [
        { step: 1, title: 'Input ingested and normalized', status: 'done', detail: `${inputType.toUpperCase()} format processed` },
        { step: 2, title: 'Intent analysis completed', status: 'done', detail: 'Pattern heuristics executed' },
        { step: 3, title: 'Technical mechanism parsed', status: 'done', detail: 'Identified payload structure' },
        { step: 4, title: `Risk calculated: ${score}/100 (${level})`, status: score >= 50 ? 'warning' : 'done', detail: 'Heuristic engine evaluation' },
        { step: 5, title: 'Protective guidance dispatched', status: 'action', detail: 'Standard defense protocol' },
      ],
      actionPlan: {
        summary: score >= 50 ? 'DO NOT authorize payments, share OTPs, or click links.' : 'Verify the request independently before proceeding.',
        steps: [
          'Never enter your UPI PIN unless you are actively making a verified outbound purchase.',
          'Cross-verify sender identity via official phone numbers or apps.',
          'If in doubt, report the interaction to 1930 (National Cyber Crime Helpline).',
        ],
        helpline: 'National Cyber Crime Helpline: 1930 | https://cybercrime.gov.in',
      },
      language,
      timestamp: new Date().toISOString(),
    };
  }
}

export const analysisService = new AnalysisService();
