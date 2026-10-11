import React from 'react';

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <div className="analyze-button-container">
      <button
        type="button"
        id="btn-analyze"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`btn-analyze-primary ${isLoading ? 'is-loading' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="spinner-icon"></span>
            <span>Menganalisis Pola & XAI...</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            <span>Periksa Pesan Sekarang</span>
          </>
        )}
      </button>

      <span className="shortcut-hint">
        Tekan <kbd>Ctrl</kbd> + <kbd>Enter</kbd> untuk menganalisis langsung
      </span>

      <style>{`
        .analyze-button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-8);
        }

        .btn-analyze-primary {
          width: 100%;
          max-width: 380px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          background: linear-gradient(135deg, var(--primary-purple) 0%, var(--accent-purple) 100%);
          color: var(--white);
          font-weight: 700;
          font-size: 1.05rem;
          padding: 14px 28px;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 16px rgba(109, 40, 217, 0.35);
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .btn-analyze-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(109, 40, 217, 0.45);
          filter: brightness(1.06);
        }

        .btn-analyze-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-analyze-primary:disabled {
          background: #CBD5E1;
          color: #94A3B8;
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.65;
        }

        .btn-analyze-primary.is-loading {
          opacity: 0.9;
          cursor: wait;
        }

        .spinner-icon {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .shortcut-hint {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .shortcut-hint kbd {
          background: var(--white);
          border: 1px solid var(--border-neutral);
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--dark-purple);
          box-shadow: 0 1px 0 rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};
