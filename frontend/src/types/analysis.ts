// TypeScript Definitions for NalarAman API & State

export type ClassificationLabel = 'Normal' | 'Scam' | 'Promosi';

export type RiskLevel = 'rendah' | 'sedang' | 'tinggi';

export interface ClassificationResult {
  label: ClassificationLabel;
  confidence: number; // 0.0 - 1.0
}

export interface SocialEngineeringIndicator {
  indicator: string;
  description: string;
  basis: string; // e.g. "rule-based" or "model"
}

export interface RiskAssessment {
  level: RiskLevel;
  basis: string;
}

export interface LimeContribution {
  token: string;
  weight: number; // -1.0 to 1.0
  direction: 'mendukung_scam' | 'menurunkan_skor_scam' | 'netral';
}

export interface LimeExplanation {
  method: 'LIME';
  available: boolean;
  contributions?: LimeContribution[];
  reason?: string | null;
  computation_time_ms?: number | null;
}

export interface AnalyzeResponse {
  request_status: 'success' | 'error';
  classification: ClassificationResult;
  social_engineering_indicators: SocialEngineeringIndicator[];
  risk_assessment: RiskAssessment;
  explanation: LimeExplanation;
  warnings: string[];
  is_mock?: boolean; // Label jelas jika berasal dari demonstrasi UI
}

export interface ComponentStatus {
  classification_model: string;
  baseline_model: string;
  lime_explainer: string;
  ocr_engine?: string;
}

export interface HealthResponse {
  status: string;
  backend_active: boolean;
  components: ComponentStatus;
  timestamp: string;
}

export interface OcrExtractionData {
  extracted_text: string;
  confidence: number;
  requires_review: boolean;
  word_count: number;
}

export interface OcrResponse {
  request_status: 'ocr_extracted';
  ocr_result: OcrExtractionData;
  warnings: string[];
}

export interface ApiError {
  request_status: 'error';
  error_code: 'INVALID_INPUT' | 'MODEL_UNAVAILABLE' | 'LIME_FAILED' | 'OCR_FAILED' | 'INTERNAL_ERROR' | 'NETWORK_ERROR';
  message: string;
  detail?: unknown;
}

export type UIState =
  | 'initial'
  | 'invalid'
  | 'loading'
  | 'success'
  | 'error'
  | 'model_unavailable'
  | 'lime_unavailable'
  | 'ocr_processing'
  | 'ocr_success'
  | 'ocr_failed';
