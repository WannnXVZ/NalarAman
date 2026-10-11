import React from 'react';
import type { SocialEngineeringIndicator } from '../types/analysis';

interface PatternIndicatorListProps {
  indicators: SocialEngineeringIndicator[];
}

export const PatternIndicatorList: React.FC<PatternIndicatorListProps> = ({ indicators }) => {
  const hasIndicators = indicators.length > 0;

  return (
    <div className="pattern-indicators-card glass-card">
      <div className="card-heading-row">
        <div className="heading-title-group">
          <span className="card-label-caption">Analisis Manipulasi Psikologis</span>
          <h3 className="section-title">Indikator Pola Social Engineering</h3>
        </div>
        <span className={`count-pill ${hasIndicators ? 'has-detected' : 'zero-detected'}`}>
          {indicators.length} Terdeteksi
        </span>
      </div>

      <p className="section-intro">
        Deteksi indikator teknis & manipulasi emosional (seperti tekanan urgensi, iming-iming hadiah, penyamaran instansi, dan permintaan kredensial).
      </p>

      {hasIndicators ? (
        <div className="indicators-grid">
          {indicators.map((item, index) => (
            <div key={index} className="indicator-item-card">
              <div className="item-header">
                <div className="item-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h4 className="item-name">{item.indicator}</h4>
                <span className="basis-tag">{item.basis}</span>
              </div>
              <p className="item-description">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-state-box">
          <div className="clean-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="clean-content">
            <h4 className="clean-title">Tidak Terdeteksi Pola Social Engineering</h4>
            <p className="clean-desc">
              Pesan ini tidak memuat indikator manipulasi psikologis, paksaan waktu, maupun modus tautan/file mencurigakan.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .pattern-indicators-card {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }

        .card-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-2);
        }

        .heading-title-group {
          display: flex;
          flex-direction: column;
        }

        .card-label-caption {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--dark-purple);
        }

        .count-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid;
        }

        .count-pill.has-detected {
          background: #FEE2E2;
          color: #B91C1C;
          border-color: #FCA5A5;
        }

        .count-pill.zero-detected {
          background: #DCFCE7;
          color: #15803D;
          border-color: #86EFAC;
        }

        .section-intro {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
          line-height: 1.5;
        }

        .indicators-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        @media (min-width: 640px) {
          .indicators-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        .indicator-item-card {
          background: #FFFDF9;
          border: 1.5px solid #FED7AA;
          border-radius: var(--radius-md);
          padding: var(--space-4);
          transition: transform var(--transition-fast);
        }

        .indicator-item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.08);
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }

        .item-icon {
          color: #EA580C;
          flex-shrink: 0;
        }

        .item-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #9A3412;
          flex: 1;
        }

        .basis-tag {
          font-size: 0.6875rem;
          background: #FFEDD5;
          color: #9A3412;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
        }

        .item-description {
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0;
        }

        .clean-state-box {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }

        .clean-icon {
          color: #15803D;
          flex-shrink: 0;
        }

        .clean-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 2px;
        }

        .clean-desc {
          font-size: 0.8125rem;
          color: #15803D;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
