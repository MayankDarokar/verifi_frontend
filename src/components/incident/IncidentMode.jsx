import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, Building2, Copy, Check, FileText } from 'lucide-react';
import { POPULAR_BANKS, TIMELINE_OPTIONS } from '../../data/banks';

export function IncidentMode() {
  const [bankSelection, setBankSelection] = useState('sbi');
  const [customBankName, setCustomBankName] = useState('');
  const [amountLost, setAmountLost] = useState('10000');
  const [utrNumber, setUtrNumber] = useState('');
  const [timeline, setTimeline] = useState('golden_hour');
  const [narrative, setNarrative] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBankChange = (e) => {
    const val = e.target.value;
    setBankSelection(val);
    if (val !== 'other') {
      setCustomBankName('');
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setValidationError('');

    // Bank validation
    let effectiveBank = '';
    if (bankSelection === 'other') {
      if (!customBankName.trim()) {
        setValidationError('Please specify the name of the bank or payment service involved.');
        return;
      }
      effectiveBank = customBankName.trim();
    } else {
      const found = POPULAR_BANKS.find((b) => b.id === bankSelection);
      effectiveBank = found ? found.name : 'Your Bank';
    }

    // Amount validation (Accepts ANY positive amount without step restrictions)
    const sanitizedAmount = String(amountLost).replace(/,/g, '').trim();
    const parsedAmount = parseFloat(sanitizedAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter a valid positive monetary amount (e.g., 14455, 16000, 159901).');
      return;
    }
    if (parsedAmount > 1000000000) {
      setValidationError('Amount exceeds maximum plausible transaction limit.');
      return;
    }

    const selectedTimelineObj = TIMELINE_OPTIONS.find((t) => t.id === timeline);
    const currentDateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const utrDisplay = utrNumber.trim() ? utrNumber.trim() : '[Your Transaction ID / UTR]';

    const complaintText = `SUBJECT: Urgent Complaint regarding Financial Fraud / Cyber Deception of ₹${parsedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

To,
The Cyber Crime Reporting Cell / National Cybercrime Portal (cybercrime.gov.in)

Respected Officer,

I am writing to report an unauthorized financial fraud incident that occurred on ${currentDateStr}.

INCIDENT DETAILS:
- Bank / Payment Service: ${effectiveBank}
- Transaction Amount: ₹${parsedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Transaction ID / UTR: ${utrDisplay}
- Timeline: ${selectedTimelineObj?.label || 'Recent'}

BRIEF SUMMARY OF FRAUD:
${narrative.trim() ? narrative.trim() : 'The scammer coerced payment through deceptive messaging and fake payment triggers.'}

REQUEST:
I request the Cyber Crime Cell and the concerned banks to immediately initiate a lien/freeze on the beneficiary account to prevent withdrawal and help recover the defrauded funds.

Thank you.
[Complainant Name]
[Complainant Mobile Number]`;

    setGeneratedPlan({
      bankName: effectiveBank,
      amount: parsedAmount,
      utr: utrDisplay,
      timelineLabel: selectedTimelineObj?.label,
      complaintText,
    });
  };

  const handleCopyComplaint = () => {
    if (generatedPlan?.complaintText) {
      navigator.clipboard.writeText(generatedPlan.complaintText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full py-2 sm:py-4">
      {/* Golden-Hour Emergency Banner */}
      <div className="rounded-2xl bg-red-50/90 dark:bg-red-950/25 border border-red-200/90 dark:border-red-900/40 backdrop-blur-sm p-5 sm:p-6 mb-6 sm:mb-8 shadow-sm">
        <div className="flex items-start gap-3.5">
          <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse-subtle" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300 mb-1">
              Immediate Golden-Hour Priority (0–2 Hours Window)
            </div>
            <p className="text-xs sm:text-[13px] text-red-900/90 dark:text-slate-300 leading-relaxed">
              If an unauthorized debit happened within the last 0 to 2 hours, immediate notification to your bank fraud division and dialing <b>1930</b> can freeze the recipient account before stolen funds exit through mule networks.
            </p>
          </div>
        </div>
      </div>

      {/* Incident Details Form */}
      <div className="rounded-2xl bg-white/95 dark:bg-[#0f172a]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.5)] mb-6 sm:mb-8 transition-all">
        <div className="mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Incident Response Intake
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Provide the transaction parameters to prepare your emergency escalation steps and formal cybercrime complaint draft.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Bank Select */}
            <div className="space-y-1.5">
              <label htmlFor="incident-bank-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Bank or Payment Service
              </label>
              <select
                id="incident-bank-select"
                value={bankSelection}
                onChange={handleBankChange}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {POPULAR_BANKS.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>

              {/* Dynamic 'Other' Custom Bank Field */}
              {bankSelection === 'other' && (
                <div className="pt-2">
                  <label htmlFor="incident-custom-bank-input" className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                    Specify Bank / Payment Service *
                  </label>
                  <input
                    id="incident-custom-bank-input"
                    type="text"
                    value={customBankName}
                    onChange={(e) => setCustomBankName(e.target.value)}
                    placeholder="e.g., Canara Bank, Bank of Baroda, Amazon Pay"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-amber-300 dark:border-amber-700/60 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Amount Lost — NO STEP RESTRICTION */}
            <div className="space-y-1.5">
              <label htmlFor="incident-amount-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Amount Lost (₹)
              </label>
              <input
                id="incident-amount-input"
                type="number"
                min="0.01"
                step="any"
                value={amountLost}
                onChange={(e) => setAmountLost(e.target.value)}
                placeholder="e.g., 14455, 16000, 159901"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Enter the exact debited figure (any positive amount accepted).
              </p>
            </div>

            {/* Transaction ID / UTR */}
            <div className="space-y-1.5">
              <label htmlFor="incident-utr-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Transaction ID / UPI Reference / UTR
              </label>
              <input
                id="incident-utr-input"
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g., 427819203810"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Found in bank SMS notification or UPI transaction history.</p>
            </div>

            {/* Timeline */}
            <div className="space-y-1.5">
              <label htmlFor="incident-timeline-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                When did the transaction take place?
              </label>
              <select
                id="incident-timeline-select"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {TIMELINE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Narrative */}
          <div className="space-y-1.5">
            <label htmlFor="incident-narrative-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Brief Description of What Happened
            </label>
            <textarea
              id="incident-narrative-input"
              rows={3}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="e.g., 'Received a call claiming electricity bill was overdue. They asked to pay ₹10 for update via a link, after which ₹25,000 was debited.'"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-semibold">
              {validationError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="relative w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden group"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-white/25 pointer-events-none" />
            <AlertOctagon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
            <span>Generate Emergency Action Plan & Complaint Draft</span>
          </button>
        </form>
      </div>

      {/* Generated Response Protocol */}
      {generatedPlan && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Step 1: Call 1930 */}
          <div className="rounded-2xl bg-indigo-50/70 dark:bg-[#0f172a]/95 border border-indigo-200/90 dark:border-indigo-900/50 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 1: Call 1930 Immediately
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Dial <b>1930</b> (National Cyber Crime Reporting Helpline). Quote transaction reference <b className="font-mono text-slate-900 dark:text-white">{generatedPlan.utr}</b> and your account institution with <b className="text-indigo-600 dark:text-indigo-400">{generatedPlan.bankName}</b>. The desk can place a direct lien on beneficiary accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Contact Bank Fraud Cell */}
          <div className="rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 2: Contact {generatedPlan.bankName}'s Fraud Cell
                </h4>
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-decimal pl-4 leading-relaxed">
                  <li>Call <b>{generatedPlan.bankName}</b> 24x7 toll-free fraud helpline immediately.</li>
                  <li>Request an <b>immediate freeze on your UPI ID, net banking, or debit card</b> to prevent secondary withdrawals.</li>
                  <li>Obtain an official <b>Fraud Complaint / Ticket Reference Number</b>.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 3: Formal Cybercrime Complaint Draft */}
          <div className="rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 3: Formal Cybercrime Complaint Draft
                </h4>
              </div>

              <button
                type="button"
                onClick={handleCopyComplaint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Complaint'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Submit this formal complaint draft at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">cybercrime.gov.in</a>:
            </p>

            <pre className="p-4 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {generatedPlan.complaintText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
