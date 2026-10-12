import React, { useState } from 'react';
import type { OcrExtractionData } from '../types/analysis';

interface OcrTextEditorProps {
  ocrResult: OcrExtractionData;
  warnings: string[];
  onConfirmAndAnalyze: (confirmedText: string) => void;
  onReupload: () => void;
  isAnalyzing: boolean;
}

export const OcrTextEditor: React.FC<OcrTextEditorProps> = ({
  ocrResult,
  warnings,
  onConfirmAndAnalyze,
  onReupload,
  isAnalyzing,
}) => {
  const [editedText, setEditedText] = useState<string>(ocrResult.extracted_text);
  const [isCopied, setIsCopied] = useState(false);

  const charCount = editedText.length;
  const wordCount = editedText.trim() ? editedText.trim().split(/\s+/).length : 0;
  const confidencePercent = Math.round(ocrResult.confidence * 100);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="ocr-editor-wrapper card">
      <div className="ocr-header">
        <div className="ocr-title-row">
          <div className="ocr-badge-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Teks Berhasil Diekstraksi
          </div>
          <div className="ocr-meta-chips">
            <span className="chip-meta">Keyakinan OCR: ~{confidencePercent}%</span>
            <span className="chip-meta">{wordCount} kata</span>
            <span className="chip-meta">{charCount} karakter</span>
          </div>
        </div>
        <p className="ocr-subheading">
          Silakan periksa dan koreksi teks di bawah ini jika terdapat huruf/angka yang kurang tepat sebelum melanjutkan analisis.
        </p>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="ocr-warning-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="warning-text-list">
            {warnings.map((w, idx) => (
              <span key={idx} className="warning-item">{w}</span>
            ))}
          </div>
        </div>
      )}

      <div className="editor-container">
        <div className="editor-toolbar">
          <label htmlFor="ocr-text-input" className="editor-label">
            Editor Teks Hasil Ekstraksi (Dapat Diedit):
          </label>
          <button
            type="button"
            className="btn-toolbar"
            onClick={handleCopy}
            title="Salin teks ke clipboard"
          >
            {isCopied ? 'Tersalin!' : 'Salin Teks'}
          </button>
        </div>

        <textarea
          id="ocr-text-input"
          className="ocr-textarea"
          rows={4}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          placeholder="Teks hasil ekstraksi OCR akan tampil di sini..."
          disabled={isAnalyzing}
        />
      </div>

      <div className="ocr-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReupload}
          disabled={isAnalyzing}
        >
          Unggah Gambar Lain
        </button>
        <button
          type="button"
          className="btn btn-primary btn-confirm"
          onClick={() => onConfirmAndAnalyze(editedText)}
          disabled={isAnalyzing || !editedText.trim()}
        >
          {isAnalyzing ? (
            <>
              <span className="spinner-sm" />
              Menganalisis Pesan...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Konfirmasi & Analisis Pesan
            </>
          )}
        </button>
      </div>

      <style>{`
        .ocr-editor-wrapper {
          margin-bottom: var(--space-6);
          border: 1px solid var(--border-lavender);
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          padding: var(--space-6);
        }

        .ocr-header {
          margin-bottom: var(--space-4);
        }

        .ocr-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .ocr-badge-success {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: #DCFCE7;
          color: #15803D;
          font-weight: 700;
          font-size: var(--font-sm);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid #BBF7D0;
        }

        .ocr-meta-chips {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .chip-meta {
          font-size: var(--font-xs);
          padding: 4px 10px;
          background: #F1F5F9;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .ocr-subheading {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          margin-top: var(--space-2);
          line-height: 1.5;
        }

        .ocr-warning-box {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          background: var(--risk-med-bg, #FEF3C7);
          color: var(--risk-med, #B45309);
          border: 1px solid var(--risk-med-border, #FDE68A);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-4);
          font-size: var(--font-xs);
          line-height: 1.6;
        }

        .ocr-warning-box svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .warning-text-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .warning-item {
          font-weight: 500;
        }

        .editor-container {
          margin-bottom: var(--space-2);
        }

        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }

        .editor-label {
          font-size: var(--font-xs);
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .btn-toolbar {
          background: #F8FAFC;
          border: 1px solid var(--border-neutral);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-toolbar:hover {
          background: #EDE9FE;
          border-color: var(--border-lavender);
        }

        .ocr-textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1.5px solid var(--border-neutral);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          font-family: inherit;
          font-size: var(--font-sm);
          line-height: 1.6;
          color: var(--text-primary);
          background: #FAFAFC;
          resize: vertical;
          min-height: 120px;
          transition: all var(--transition-fast);
        }

        .ocr-textarea:focus {
          outline: none;
          border-color: var(--primary);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.12);
        }

        .ocr-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: var(--space-3);
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-neutral);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-family: inherit;
          font-size: var(--font-sm);
          font-weight: 600;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          cursor: pointer;
          border: none;
          transition: all var(--transition-fast);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #F8FAFC;
          color: var(--text-primary);
          border: 1px solid var(--border-neutral);
        }

        .btn-secondary:hover:not(:disabled) {
          background: #F1F5F9;
          border-color: var(--border-lavender);
          color: var(--primary);
        }

        .btn-confirm {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(109, 40, 217, 0.25);
          padding: 10px 24px;
        }

        .btn-confirm:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);
          box-shadow: 0 4px 12px rgba(109, 40, 217, 0.35);
          transform: translateY(-1px);
        }

        .spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .ocr-title-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .ocr-actions {
            flex-direction: column;
          }
          .ocr-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
