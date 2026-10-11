import React from 'react';
import { MAX_TEXT_LENGTH } from '../utils/validators';
import { SAMPLE_PRESETS } from '../api/analyzeApi';

interface TextInputPanelProps {
  text: string;
  onChange: (val: string) => void;
  charCount: number;
  wordCount: number;
  validationError?: string;
  disabled?: boolean;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  text,
  onChange,
  charCount,
  wordCount,
  validationError,
  disabled = false,
}) => {
  const isOverLimit = charCount > MAX_TEXT_LENGTH;

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) onChange(clipText);
    } catch {
      // Clipboard access denied, user can still paste manually
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="text-input-panel glass-card">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <label htmlFor="message-input" className="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Teks Pesan Digital yang Dicurigai
          </label>
          <span className="panel-subtitle">WhatsApp, SMS, Email, DM Media Sosial, atau Bukti Chat Transaksi</span>
        </div>

        <div className="panel-actions">
          <button
            type="button"
            className="action-link-btn"
            onClick={handlePaste}
            disabled={disabled}
            title="Tempel teks dari clipboard"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            </svg>
            Tempel
          </button>
          {text && (
            <button
              type="button"
              className="action-link-btn clear"
              onClick={handleClear}
              disabled={disabled}
              title="Kosongkan kolom input"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      <div className="textarea-wrapper">
        <textarea
          id="message-input"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Tempel atau ketikkan isi pesan mencurigakan di sini... Contoh: 'Selamat Anda mendapatkan hadiah uang tunai... Klik tautan berikut...'"
          rows={6}
          className={`input-textarea ${validationError ? 'has-error' : ''} ${isOverLimit ? 'over-limit' : ''}`}
        />
      </div>

      {validationError && (
        <div className="inline-validation-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{validationError}</span>
        </div>
      )}

      <div className="panel-footer">
        <div className="presets-wrapper">
          <span className="presets-label">Gunakan Contoh:</span>
          <div className="preset-buttons">
            {SAMPLE_PRESETS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-btn"
                onClick={() => onChange(sample.text)}
                disabled={disabled}
                title={sample.text}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        <div className={`counter-badge ${isOverLimit ? 'limit-exceeded' : ''}`}>
          <span>{wordCount} kata</span>
          <span className="counter-sep">•</span>
          <span>
            {charCount}/{MAX_TEXT_LENGTH} karakter
          </span>
        </div>
      </div>

      <style>{`
        .text-input-panel {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .panel-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--dark-purple);
        }

        .panel-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .panel-actions {
          display: flex;
          gap: var(--space-2);
        }

        .action-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--lavender-surface);
          color: var(--primary-purple);
          border: 1px solid var(--border-lavender);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .action-link-btn:hover:not(:disabled) {
          background: #DDD6FE;
          color: var(--primary-purple-hover);
        }

        .action-link-btn.clear:hover:not(:disabled) {
          background: #FEE2E2;
          color: #B91C1C;
          border-color: #FCA5A5;
        }

        .textarea-wrapper {
          position: relative;
        }

        .input-textarea {
          width: 100%;
          border: 1.5px solid var(--border-neutral);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-primary);
          background: #FAFAFF;
          resize: vertical;
          min-height: 140px;
          transition: all var(--transition-fast);
        }

        .input-textarea:focus {
          outline: none;
          border-color: var(--accent-purple);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .input-textarea.has-error {
          border-color: #EF4444;
          background: #FEF2F2;
        }

        .input-textarea.over-limit {
          border-color: #DC2626;
        }

        .inline-validation-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: #DC2626;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-top: var(--space-2);
        }

        .panel-footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          margin-top: var(--space-4);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-neutral);
        }

        .presets-wrapper {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .presets-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .preset-btn {
          background: var(--lavender-bg);
          border: 1px solid var(--border-lavender);
          color: var(--dark-purple);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .preset-btn:hover:not(:disabled) {
          background: var(--primary-purple);
          color: var(--white);
          border-color: var(--primary-purple);
          transform: translateY(-1px);
        }

        .counter-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--lavender-surface);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .counter-badge.limit-exceeded {
          color: #DC2626;
          background: #FEE2E2;
        }

        .counter-sep {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};
