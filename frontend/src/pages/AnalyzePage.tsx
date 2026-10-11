import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { TextInputPanel } from '../components/TextInputPanel';
import { AnalyzeButton } from '../components/AnalyzeButton';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorBanner } from '../components/ErrorBanner';
import { ClassificationCard } from '../components/ClassificationCard';
import { RiskAssessmentBadge } from '../components/RiskAssessmentBadge';
import { PatternIndicatorList } from '../components/PatternIndicatorList';
import { LimeExplanationPanel } from '../components/LimeExplanationPanel';
import { LimitationNotice } from '../components/LimitationNotice';
import { StateDemoToolbar, type DemoScenario } from '../components/StateDemoToolbar';
import { Footer } from '../components/Footer';

import type {
  AnalyzeResponse,
  UIState,
  ApiError,
} from '../types/analysis';
import { validateInputText } from '../utils/validators';
import {
  checkBackendHealth,
  analyzeText,
  getMockResponseForScenario,
  ApiException,
  SAMPLE_PRESETS,
} from '../api/analyzeApi';

export const AnalyzePage: React.FC = () => {
  // Input State
  const [inputText, setInputText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [charCount, setCharCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);

  // Analysis State
  const [uiState, setUiState] = useState<UIState>('initial');
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [currentError, setCurrentError] = useState<ApiError | Error | null>(null);

  // Health / Connection State
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  // Sync Input Stats & Clear Inline Error upon typing (Auto-reset stale results)
  const handleTextChange = (val: string) => {
    setInputText(val);
    const { charCount: chars, wordCount: words } = validateInputText(val);
    setCharCount(chars);
    setWordCount(words);
    if (validationError) {
      setValidationError(undefined);
    }
    // Auto-clear stale analysis result when typing fresh input
    if (analysisResult !== null || uiState !== 'initial') {
      setAnalysisResult(null);
      setUiState('initial');
      setActiveScenario(null);
      setCurrentError(null);
    }
  };

  // Check Backend Connectivity
  const verifyBackend = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const health = await checkBackendHealth();
      setBackendOnline(health.backend_active);
    } catch {
      setBackendOnline(false);
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    verifyBackend();
  }, [verifyBackend]);

  // Execute Analysis
  const handleAnalyze = async () => {
    const validation = validateInputText(inputText);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage);
      setUiState('invalid');
      return;
    }

    setValidationError(undefined);
    setUiState('loading');
    setCurrentError(null);

    // If backend is confirmed online, call real endpoint
    if (backendOnline) {
      try {
        const result = await analyzeText(inputText);
        setAnalysisResult(result);
        setUiState('success');
        const labelLower = result.classification.label.toLowerCase();
        setActiveScenario(labelLower === 'scam' ? 'scam' : labelLower === 'promosi' ? 'promo' : 'normal');
      } catch (err) {
        setActiveScenario(null);
        if (err instanceof ApiException) {
          if (err.errorCode === 'MODEL_UNAVAILABLE') {
            setUiState('model_unavailable');
          } else {
            setUiState('error');
          }
          setCurrentError({
            request_status: 'error',
            error_code: err.errorCode,
            message: err.message,
            detail: err.detail,
          });
        } else {
          setUiState('error');
          setCurrentError(err as Error);
        }
      }
    } else {
      // Backend offline: simulate realistic response based on text heuristics or fallback to demo
      setTimeout(() => {
        const lower = inputText.toLowerCase();
        let scenario: 'scam' | 'promo' | 'normal' = 'normal';
        if (lower.includes('undian') || lower.includes('klaim') || lower.includes('apk') || lower.includes('.xyz') || lower.includes('segera')) {
          scenario = 'scam';
        } else if (lower.includes('diskon') || lower.includes('promo') || lower.includes('cashback') || lower.includes('sale')) {
          scenario = 'promo';
        }
        const mockRes = getMockResponseForScenario(scenario);
        setAnalysisResult(mockRes);
        setUiState('success');
        setActiveScenario(scenario);
      }, 750);
    }
  };

  // Keyboard shortcut Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // State Switcher for Demo & Evaluation (PRD Chapter 12.3)
  const handleSelectDemoState = (
    state: UIState,
    scenario?: 'scam' | 'promo' | 'normal' | 'lime_fail'
  ) => {
    setUiState(state);
    setActiveScenario(scenario || null);
    setCurrentError(null);

    switch (state) {
      case 'initial':
        setInputText('');
        setAnalysisResult(null);
        setValidationError(undefined);
        break;
      case 'invalid':
        setInputText('');
        setValidationError('Pesan belum dimasukkan. Silakan ketik atau tempelkan teks pesan.');
        setAnalysisResult(null);
        break;
      case 'loading':
        setAnalysisResult(null);
        break;
      case 'success':
        if (scenario) {
          const sample =
            scenario === 'scam'
              ? SAMPLE_PRESETS[0].text
              : scenario === 'promo'
              ? SAMPLE_PRESETS[2].text
              : SAMPLE_PRESETS[3].text;
          setInputText(sample);
          const validation = validateInputText(sample);
          setCharCount(validation.charCount);
          setWordCount(validation.wordCount);
          setAnalysisResult(getMockResponseForScenario(scenario));
        }
        break;
      case 'lime_unavailable':
        setInputText(SAMPLE_PRESETS[1].text);
        setAnalysisResult(getMockResponseForScenario('lime_fail'));
        break;
      case 'model_unavailable':
        setCurrentError({
          request_status: 'error',
          error_code: 'MODEL_UNAVAILABLE',
          message: 'Model klasifikasi IndoBERT belum dimuat pada backend server (HTTP 503).',
        });
        setAnalysisResult(null);
        break;
      case 'error':
        setCurrentError({
          request_status: 'error',
          error_code: 'NETWORK_ERROR',
          message: 'Koneksi ke server backend terputus atau timeout (HTTP 500).',
        });
        setAnalysisResult(null);
        break;
    }
  };

  return (
    <div className="analyze-page-root">
      <Header
        backendOnline={backendOnline}
        onRefreshHealth={verifyBackend}
        isCheckingHealth={isCheckingHealth}
      />

      <main className="container main-content-wrap">
        {/* Interactive Evaluation Toolbar (PRD Verification) */}
        <StateDemoToolbar
          currentState={uiState}
          activeScenario={activeScenario}
          onSelectState={handleSelectDemoState}
          isBackendConnected={backendOnline}
        />

        {/* Input Panel */}
        <section aria-labelledby="message-input">
          <TextInputPanel
            text={inputText}
            onChange={handleTextChange}
            charCount={charCount}
            wordCount={wordCount}
            validationError={validationError}
            disabled={uiState === 'loading'}
          />

          <AnalyzeButton
            onClick={handleAnalyze}
            isLoading={uiState === 'loading'}
            disabled={charCount === 0 || charCount > 2000}
          />
        </section>

        {/* Loading State Animation */}
        {uiState === 'loading' && <LoadingIndicator />}

        {/* Error Banners */}
        {(uiState === 'error' || uiState === 'model_unavailable') && (
          <ErrorBanner
            error={currentError}
            onRetry={handleAnalyze}
            onUseDemoMode={() => handleSelectDemoState('success', 'scam')}
          />
        )}

        {/* Results Area */}
        {(uiState === 'success' || uiState === 'lime_unavailable') && analysisResult && (
          <section className="results-section animate-fade-in" aria-label="Hasil Analisis Pesan">
            <div className="results-grid-top">
              <ClassificationCard classification={analysisResult.classification} />
              <RiskAssessmentBadge assessment={analysisResult.risk_assessment} />
            </div>

            <PatternIndicatorList indicators={analysisResult.social_engineering_indicators} />

            <LimeExplanationPanel explanation={analysisResult.explanation} />

            <LimitationNotice
              warnings={analysisResult.warnings}
              isMock={analysisResult.is_mock}
            />
          </section>
        )}
      </main>

      <Footer />

      <style>{`
        .analyze-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content-wrap {
          flex: 1;
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }

        .results-section {
          margin-top: var(--space-4);
        }

        .results-grid-top {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-5);
          margin-bottom: var(--space-6);
        }

        @media (min-width: 768px) {
          .results-grid-top {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
