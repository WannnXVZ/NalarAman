import React from 'react';
import type { ApiError } from '../types/analysis';

interface ErrorBannerProps {
  error: ApiError | Error | null;
  onRetry: () => void;
  onUseDemoMode?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry, onUseDemoMode }) => {
  if (!error) return null;

  const isModelUnavailable = (error as ApiError).error_code === 'MODEL_UNAVAILABLE';
  const isNetworkError = (error as ApiError).error_code === 'NETWORK_ERROR';

  return (
    <div className="error-banner-card animate-fade-in" role="alert">
      <div className="error-icon-box">
        {isModelUnavailable ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
      </div>

      <div className="error-content">
        <h4 className="error-title">
          {isModelUnavailable
            ? 'Model AI Belum Siap Digunakan'
            : isNetworkError
            ? 'Tidak Dapat Terhubung ke Layanan Backend'
            : 'Terjadi Kendala Pemrosesan'}
        </h4>
        <p className="error-message">
          {error.message || 'Gagal menghubungi server. Pastikan backend FastAPI sedang berjalan.'}
        </p>

        <div className="error-actions">
          <button type="button" className="btn-error-retry" onClick={onRetry}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Coba Ulangi
          </button>

          {onUseDemoMode && (
            <button type="button" className="btn-error-demo" onClick={onUseDemoMode}>
              Jalankan Mode Demonstrasi UI (Mock)
            </button>
          )}
        </div>
      </div>

      <style>{`
        .error-banner-card {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          background: #FEF2F2;
          border: 1.5px solid #FCA5A5;
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-5);
          margin-bottom: var(--space-6);
        }

        .error-icon-box {
          color: #DC2626;
          background: #FEE2E2;
          border-radius: var(--radius-md);
          padding: var(--space-2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .error-content {
          flex: 1;
        }

        .error-title {
          font-size: 1rem;
          font-weight: 700;
          color: #991B1B;
          margin-bottom: 2px;
        }

        .error-message {
          font-size: 0.875rem;
          color: #B91C1C;
          line-height: 1.5;
          margin-bottom: var(--space-3);
        }

        .error-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .btn-error-retry {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #DC2626;
          color: var(--white);
          font-size: 0.8125rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .btn-error-retry:hover {
          background: #B91C1C;
        }

        .btn-error-demo {
          display: inline-flex;
          align-items: center;
          background: var(--white);
          color: #991B1B;
          border: 1px solid #FCA5A5;
          font-size: 0.8125rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .btn-error-demo:hover {
          background: #FEE2E2;
        }
      `}</style>
    </div>
  );
};
