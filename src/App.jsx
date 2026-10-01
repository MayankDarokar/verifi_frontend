import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScenarioSelector } from './components/investigation/ScenarioSelector';
import { InvestigationInput } from './components/investigation/InvestigationInput';
import { InvestigationProgress } from './components/investigation/InvestigationProgress';
import { StaleInputAlert } from './components/investigation/StaleInputAlert';
import { RiskHeroCard } from './components/risk/RiskHeroCard';
import { IntentMechanismComparator } from './components/comparison/IntentMechanismComparator';
import { EvidenceSection } from './components/evidence/EvidenceSection';
import { InvestigationTrace } from './components/trace/InvestigationTrace';
import { ActionPlanSection } from './components/actions/ActionPlanSection';
import { IncidentMode } from './components/incident/IncidentMode';
import { SCENARIOS } from './data/scenarios';
import { analysisService } from './services/analysisService';
import { computeInputFingerprint } from './utils/validators';
import { getInitialTheme, applyTheme } from './utils/theme';

export function App() {
  // Theme state (Dark / Light) with persistence
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation & Language
  const [activeMode, setActiveMode] = useState('analyze'); // 'analyze' | 'incident'
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Input states
  const [inputType, setInputType] = useState('text'); // 'text' | 'url' | 'qr'
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);

  // Explicit Investigation State Machine:
  // 'idle' | 'investigating' | 'completed' | 'stale' | 'error'
  const [investigationStatus, setInvestigationStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [submittedFingerprint, setSubmittedFingerprint] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const resultsRef = useRef(null);

  // Compute active input payload & fingerprint
  const getActivePayload = () => {
    if (inputType === 'text') return textInput;
    if (inputType === 'url') return urlInput;
    if (inputType === 'qr') return qrFile;
    return '';
  };

  const currentFingerprint = computeInputFingerprint(
    inputType,
    getActivePayload(),
    selectedScenarioId
  );

  // Check if current input differs from the submitted fingerprint
  useEffect(() => {
    if (investigationStatus === 'completed' && submittedFingerprint !== null) {
      if (currentFingerprint !== submittedFingerprint) {
        setInvestigationStatus('stale');
      }
    }
  }, [currentFingerprint, submittedFingerprint, investigationStatus]);

  // Handler: Selecting a Demo Scenario (Populates input, DOES NOT auto-execute)
  const handleSelectScenario = (scenarioId) => {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) return;

    // Reset any existing result so no results appear prior to execution
    setResult(null);
    setSubmittedFingerprint(null);
    setInvestigationStatus('idle');
    setErrorMessage('');

    setSelectedScenarioId(scenarioId);
    setInputType(scenario.inputType);

    if (scenario.inputType === 'text') {
      setTextInput(scenario.inputValue);
      setUrlInput('');
      setQrFile(null);
      setQrPreviewUrl(null);
    } else if (scenario.inputType === 'url') {
      setUrlInput(scenario.inputValue);
      setTextInput('');
      setQrFile(null);
      setQrPreviewUrl(null);
    } else if (scenario.inputType === 'qr') {
      setTextInput('');
      setUrlInput('');
    }
  };

  // Handler: Clear to custom input
  const handleClearToCustom = () => {
    setSelectedScenarioId(null);
    setTextInput('');
    setUrlInput('');
    setQrFile(null);
    setQrPreviewUrl(null);
    setResult(null);
    setSubmittedFingerprint(null);
    setInvestigationStatus('idle');
    setErrorMessage('');
  };

  // Notify when user types / alters input
  const handleInputChange = () => {
    if (investigationStatus === 'completed') {
      setInvestigationStatus('stale');
    }
  };

  // Handler: Explicit Execution Trigger
  const handleRunInvestigation = async () => {
    setInvestigationStatus('investigating');
    setErrorMessage('');
    setCurrentStage({ step: 1, label: 'Ingesting content & extracting entities...' });

    try {
      const activePayload = getActivePayload();
      const output = await analysisService.runAnalysis({
        inputType,
        payload: activePayload,
        scenarioId: selectedScenarioId,
        language: selectedLanguage,
        onProgress: (stage) => setCurrentStage(stage),
      });

      setResult(output);
      setSubmittedFingerprint(currentFingerprint);
      setInvestigationStatus('completed');

      // Smooth scroll to results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage('An error occurred during analysis. Please try again.');
      setInvestigationStatus('error');
    } finally {
      setCurrentStage(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navigation */}
      <Header
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeMode === 'analyze' ? (
          <div>
            {/* Quick Demo Scenario Bar */}
            <ScenarioSelector
              selectedScenarioId={selectedScenarioId}
              onSelectScenario={handleSelectScenario}
              onClearToCustom={handleClearToCustom}
            />

            {/* Investigation Input Workspace */}
            <InvestigationInput
              inputType={inputType}
              setInputType={setInputType}
              textInput={textInput}
              setTextInput={setTextInput}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              qrFile={qrFile}
              setQrFile={setQrFile}
              qrPreviewUrl={qrPreviewUrl}
              setQrPreviewUrl={setQrPreviewUrl}
              onRunInvestigation={handleRunInvestigation}
              isLoading={investigationStatus === 'investigating'}
              onInputChange={handleInputChange}
            />

            {/* Live Progress Stage Overlay */}
            {investigationStatus === 'investigating' && (
              <InvestigationProgress currentStage={currentStage} />
            )}

            {/* Stale Input Notice */}
            {investigationStatus === 'stale' && (
              <StaleInputAlert onRerun={handleRunInvestigation} />
            )}

            {/* Error Message */}
            {investigationStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-semibold mb-6">
                {errorMessage}
              </div>
            )}

            {/* Investigation Results Surface — STRICTLY visible ONLY when completed */}
            {investigationStatus === 'completed' && result && (
              <div ref={resultsRef} className="pt-2">
                {/* 1. Primary Risk Hero Card */}
                <RiskHeroCard result={result} />

                {/* 2. Flagship Intent vs Mechanism Comparison */}
                <IntentMechanismComparator result={result} />

                {/* 3. Discovered Technical Evidence */}
                <EvidenceSection evidence={result.evidence} />

                {/* 4. Investigation Steps Trace */}
                <InvestigationTrace trace={result.trace} />

                {/* 5. Recommended Action Plan */}
                <ActionPlanSection actionPlan={result.actionPlan} />
              </div>
            )}
          </div>
        ) : (
          /* Incident Response Mode */
          <IncidentMode />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
