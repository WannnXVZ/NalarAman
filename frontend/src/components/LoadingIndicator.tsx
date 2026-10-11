import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-state-card glass-card animate-fade-in">
      <div className="scanner-animation">
        <div className="scanner-glow"></div>
        <div className="scanner-pulse">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      </div>

      <div className="loading-text-wrap">
        <h3 className="loading-title">Sedang Menjalankan Pipeline Analisis AI</h3>
        <p className="loading-subtitle">
          Memproses teks pesan: tokenisasi, inferensi model klasifikasi, ekstraksi pola social engineering, dan kalkulasi kontribusi bobot LIME...
        </p>
      </div>

      <div className="loading-steps-pills">
        <span className="step-pill active">1. Preprocessing Teks</span>
        <span className="step-pill active">2. Klasifikasi Model</span>
        <span className="step-pill active">3. Analisis Pola Heuristik</span>
        <span className="step-pill pulse">4. Penghitungan LIME XAI</span>
      </div>

      <style>{`
        .loading-state-card {
          padding: var(--space-8) var(--space-6);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-4);
          margin-bottom: var(--space-8);
          background: linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%);
          border: 1.5px solid var(--border-lavender);
        }

        .scanner-animation {
          position: relative;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-purple);
        }

        .scanner-pulse {
          position: relative;
          z-index: 2;
          animation: spin 3s linear infinite;
        }

        .scanner-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(109, 40, 217, 0) 70%);
          animation: pulseGlow 1.5s ease-in-out infinite;
        }

        .loading-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--dark-purple);
          margin-bottom: var(--space-1);
        }

        .loading-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          max-width: 580px;
          margin: 0 auto;
        }

        .loading-steps-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }

        .step-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: var(--lavender-surface);
          color: var(--text-secondary);
          border: 1px solid var(--border-lavender);
        }

        .step-pill.active {
          color: var(--primary-purple);
          background: #EDE9FE;
        }

        .step-pill.pulse {
          color: var(--white);
          background: var(--primary-purple);
          border-color: var(--primary-purple);
          animation: pulseGlow 1.2s infinite;
        }
      `}</style>
    </div>
  );
};
