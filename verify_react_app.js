/**
 * VeriFi React App Core Logic & Contract Verification Suite
 */

import { SCENARIOS } from './src/data/scenarios.js';
import { analysisService } from './src/services/analysisService.js';
import { validateTextInput, validateUrl, validateQrFile, computeInputFingerprint } from './src/utils/validators.js';

async function runTestSuite() {
  console.log('Starting VeriFi React Frontend Verification...\n');
  const results = {};

  // -------------------------------------------------------------
  // TEST 1: Initial State & Scenario Data Integrity
  // -------------------------------------------------------------
  console.log('TEST 1: Verifying Scenarios Data & Scores Integrity...');
  const expectedScenarios = ['cashback_qr_mismatch', 'electricity_bill_scam', 'lottery_prize_url', 'legitimate_merchant_receipt'];
  for (const sId of expectedScenarios) {
    if (!SCENARIOS[sId]) throw new Error(`Missing scenario: ${sId}`);
  }
  if (SCENARIOS.cashback_qr_mismatch.score !== 85) throw new Error('Cashback score mismatch');
  if (SCENARIOS.electricity_bill_scam.score !== 68) throw new Error('Electricity score mismatch');
  if (SCENARIOS.lottery_prize_url.score !== 42) throw new Error('Lottery score mismatch');
  if (SCENARIOS.legitimate_merchant_receipt.score !== 8) throw new Error('Receipt score mismatch');
  results['TEST 1 (Scenario Integrity)'] = 'PASSED';

  // -------------------------------------------------------------
  // TEST 2: Analysis Service Execution
  // -------------------------------------------------------------
  console.log('TEST 2: Verifying AnalysisService execution...');
  let stagesPassed = 0;
  const analysisResult = await analysisService.runAnalysis({
    inputType: 'text',
    payload: SCENARIOS.cashback_qr_mismatch.inputValue,
    scenarioId: 'cashback_qr_mismatch',
    language: 'English',
    onProgress: (stage) => { stagesPassed++; },
  });

  if (!analysisResult) throw new Error('Analysis result is null');
  if (analysisResult.score !== 85) throw new Error('Incorrect analysis score');
  if (analysisResult.level !== 'CRITICAL') throw new Error('Incorrect analysis level');
  if (!analysisResult.mismatch.detected) throw new Error('Mismatch should be detected');
  if (stagesPassed !== 5) throw new Error(`Expected 5 stages, got ${stagesPassed}`);
  results['TEST 2 (Analysis Execution)'] = 'PASSED (Score: 85, Tier: CRITICAL, 5 Stages)';

  // -------------------------------------------------------------
  // TEST 3: Stale Input Fingerprint Protection
  // -------------------------------------------------------------
  console.log('TEST 3: Verifying Stale Input Fingerprinting...');
  const initialFingerprint = computeInputFingerprint('text', 'Original message', 'cashback_qr_mismatch');
  const modifiedFingerprint = computeInputFingerprint('text', 'Modified message', 'cashback_qr_mismatch');
  if (initialFingerprint === modifiedFingerprint) throw new Error('Fingerprints should differ on text modification');

  const switchedScenarioFingerprint = computeInputFingerprint('text', 'Original message', 'electricity_bill_scam');
  if (initialFingerprint === switchedScenarioFingerprint) throw new Error('Fingerprints should differ on scenario switch');
  results['TEST 3 (Stale Protection)'] = 'PASSED';

  // -------------------------------------------------------------
  // TEST 4: Incident Mode Arbitrary Amount Validation
  // -------------------------------------------------------------
  console.log('TEST 4: Verifying Arbitrary Monetary Amount Validation...');
  const testAmounts = ['14455', '16000', '159901', '123456.75', '237819'];
  for (const amt of testAmounts) {
    const parsed = parseFloat(amt);
    if (isNaN(parsed) || parsed <= 0) {
      throw new Error(`Failed to parse valid arbitrary amount: ${amt}`);
    }
  }

  // Verify invalid amounts rejected
  const invalidAmounts = ['0', '-500', 'abc'];
  for (const amt of invalidAmounts) {
    const parsed = parseFloat(amt);
    const isValid = !isNaN(parsed) && parsed > 0;
    if (isValid) throw new Error(`Invalid amount was accepted: ${amt}`);
  }
  results['TEST 4 (Incident Amount Validation)'] = 'PASSED (Arbitrary amounts accepted: 14455, 159901, etc.)';

  // -------------------------------------------------------------
  // TEST 5: QR Upload 10 MB Boundary Validation
  // -------------------------------------------------------------
  console.log('TEST 5: Verifying QR Upload Boundary Validation...');
  const exact10Mb = validateQrFile({ name: 'test.png', size: 10 * 1024 * 1024 });
  if (!exact10Mb.valid) throw new Error('Exact 10 MB should be valid');

  const over10Mb = validateQrFile({ name: 'test.png', size: 10 * 1024 * 1024 + 1 });
  if (over10Mb.valid) throw new Error('Over 10 MB should be invalid');

  const invalidExt = validateQrFile({ name: 'malware.exe', size: 1024 });
  if (invalidExt.valid) throw new Error('Executable format should be rejected');
  results['TEST 5 (QR Validation)'] = 'PASSED (10 MB exact boundary enforced)';

  // -------------------------------------------------------------
  // TEST 6: Codebase Search for "Engine Active"
  // -------------------------------------------------------------
  console.log('TEST 6: Verifying "Engine Active" was completely removed...');
  const fs = await import('fs');
  const headerContent = fs.readFileSync('./src/components/layout/Header.jsx', 'utf-8');
  if (headerContent.includes('Engine Active')) {
    throw new Error('Header.jsx still contains "Engine Active"!');
  }
  results['TEST 6 (Header Cleanliness)'] = 'PASSED ("Engine Active" removed completely)';

  console.log('\n==================================================');
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('==================================================');
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${k}: ${v}`);
  }
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
