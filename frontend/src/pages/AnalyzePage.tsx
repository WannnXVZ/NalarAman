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
import { ImageUploadZone } from '../components/ImageUploadZone';
import { OcrTextEditor } from '../components/OcrTextEditor';
import { Footer } from '../components/Footer';

import type {
  AnalyzeResponse,
  UIState,
  ApiError,
  OcrResponse,
} from '../types/analysis';
import { validateInputText } from '../utils/validators';
import {
  checkBackendHealth,
  analyzeText,
  uploadAndExtractImage,
  getMockResponseForScenario,
  ApiException,
  SAMPLE_PRESETS,
} from '../api/analyzeApi';

export const AnalyzePage: React.FC = () => {
  // Input Mode: 'text' | 'screenshot' (PRD Bab 12.2 & 24)
  const [inputMode, setInputMode] = useState<'text' | 'screenshot'>('text');

  // Text Input State
  const [inputText, setInputText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [charCount, setCharCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);

  // OCR Screenshot State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isExtractingOcr, setIsExtractingOcr] = useState<boolean>(false);
  const [ocrData, setOcrData] = useState<OcrResponse | null>(null);

  // Analysis State
  const [uiState, setUiState] = useState<UIState>('initial');
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [currentError, setCurrentError] = useState<ApiError | Error | null>(null);

  // Health / Connection State
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  // Sync Input Stats & Clear Inline Error upon typing
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

  // Execute Analysis with Given Text
  const executeAnalysis = async (textToAnalyze: string) => {
    const validation = validateInputText(textToAnalyze);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage);
      setUiState('invalid');
      return;
    }

    setValidationError(undefined);
    setUiState('loading');
    setCurrentError(null);

    if (backendOnline) {
      try {
        const result = await analyzeText(textToAnalyze);
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
      // Backend offline fallback
      setTimeout(() => {
        const lower = textToAnalyze.toLowerCase();
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

  const handleAnalyze = () => {
    executeAnalysis(inputText);
  };

  // Reset analysis results, input text, and OCR data when switching mode tabs (PRD Bab 12.2)
  const handleSwitchTab = (newMode: 'text' | 'screenshot') => {
    if (newMode !== inputMode) {
      setInputMode(newMode);
      setInputText('');
      setCharCount(0);
      setWordCount(0);
      setValidationError(undefined);
      setSelectedImage(null);
      setOcrData(null);
      setAnalysisResult(null);
      setUiState('initial');
      setActiveScenario(null);
      setCurrentError(null);
    }
  };

  // Reset analysis results and input state when a new image is selected
  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setInputText('');
    setCharCount(0);
    setWordCount(0);
    setValidationError(undefined);
    setAnalysisResult(null);
    setUiState('initial');
    setActiveScenario(null);
    setCurrentError(null);
    setOcrData(null);
  };

  // OCR Handlers
  const handleExtractOcr = async (file: File) => {
    setIsExtractingOcr(true);
    setCurrentError(null);
    setAnalysisResult(null);
    setUiState('initial');
    setActiveScenario(null);

    try {
      const response = await uploadAndExtractImage(file);
      setOcrData(response);
      setInputText(response.ocr_result.extracted_text);
      const validation = validateInputText(response.ocr_result.extracted_text);
      setCharCount(validation.charCount);
      setWordCount(validation.wordCount);
    } catch (err) {
      if (err instanceof ApiException) {
        setCurrentError({
          request_status: 'error',
          error_code: err.errorCode,
          message: err.message,
          detail: err.detail,
        });
        setUiState('ocr_failed');
      } else {
        setCurrentError(err as Error);
        setUiState('error');
      }
    } finally {
      setIsExtractingOcr(false);
    }
  };

  const handleConfirmOcrAndAnalyze = (confirmedText: string) => {
    setInputText(confirmedText);
    const validation = validateInputText(confirmedText);
    setCharCount(validation.charCount);
    setWordCount(validation.wordCount);
    executeAnalysis(confirmedText);
  };

  const handleClearOcr = () => {
    setSelectedImage(null);
    setOcrData(null);
    setInputText('');
    setCharCount(0);
    setWordCount(0);
    setAnalysisResult(null);
    setUiState('initial');
    setActiveScenario(null);
    setCurrentError(null);
  };

  // Keyboard shortcut Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (inputMode === 'text') {
          e.preventDefault();
          handleAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputMode, inputText]);

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
        setOcrData(null);
        setSelectedImage(null);
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
      case 'ocr_failed':
        setCurrentError({
          request_status: 'error',
          error_code: 'OCR_FAILED',
          message: 'OCR tidak menemukan teks yang dapat dibaca pada gambar. Silakan gunakan input manual.',
        });
        setAnalysisResult(null);
        break;
      default:
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

        {/* Input Mode Selector Tabs (PRD Bab 12.2) */}
        <div className="mode-tabs-container">
          <button
            type="button"
            className={`mode-tab-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('text')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Mode Teks Manual
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${inputMode === 'screenshot' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('screenshot')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Mode Screenshot (OCR)
            <span className="mode-badge-pill">Fase 5</span>
          </button>
        </div>

        {/* Mode Teks Manual */}
        {inputMode === 'text' && (
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
        )}

        {/* Mode Screenshot (OCR) */}
        {inputMode === 'screenshot' && (
          <section aria-labelledby="screenshot-ocr">
            {!ocrData ? (
              <ImageUploadZone
                selectedFile={selectedImage}
                onImageSelected={handleImageSelected}
                onExtract={handleExtractOcr}
                isExtracting={isExtractingOcr}
                onClear={handleClearOcr}
              />
            ) : (
              <OcrTextEditor
                ocrResult={ocrData.ocr_result}
                warnings={ocrData.warnings}
                onConfirmAndAnalyze={handleConfirmOcrAndAnalyze}
                onReupload={handleClearOcr}
                isAnalyzing={uiState === 'loading'}
              />
            )}
          </section>
        )}

        {/* Loading State Animation */}
        {uiState === 'loading' && <LoadingIndicator />}

        {/* Error Banners */}
        {(uiState === 'error' || uiState === 'model_unavailable' || uiState === 'ocr_failed') && (
          <ErrorBanner
            error={currentError}
            onRetry={inputMode === 'text' ? handleAnalyze : () => selectedImage && handleExtractOcr(selectedImage)}
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

        .mode-tabs-container {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
          background: #FFFFFF;
          padding: 6px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-lavender);
          box-shadow: var(--shadow-sm);
        }

        .mode-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: 12px 20px;
          border: 1px solid transparent;
          background: transparent;
          border-radius: var(--radius-md);
          font-size: var(--font-sm);
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mode-tab-btn svg {
          stroke: currentColor;
          flex-shrink: 0;
        }

        .mode-tab-btn:hover:not(.active) {
          color: var(--primary);
          background: #FAF5FF;
        }

        .mode-tab-btn.active {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(109, 40, 217, 0.28) !important;
        }

        .mode-tab-btn.active svg {
          stroke: #FFFFFF !important;
        }

        .mode-badge-pill {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .mode-tab-btn.active .mode-badge-pill {
          background: rgba(255, 255, 255, 0.25) !important;
          color: #FFFFFF !important;
        }

        .mode-tab-btn:not(.active) .mode-badge-pill {
          background: #EDE9FE;
          color: var(--primary);
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
