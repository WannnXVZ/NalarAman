import React from 'react';
import type { ClassificationResult } from '../types/analysis';

interface ClassificationCardProps {
  classification: ClassificationResult;
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ classification }) => {
  const { label, confidence } = classification;
  const confidencePercent = Math.round(confidence * 100);

  const getLabelConfig = () => {
    switch (label) {
      case 'Scam':
        return {
          title: 'Terindikasi Penipuan (Scam)',
          badgeClass: 'badge-scam',
          color: 'var(--class-scam)',
          bgColor: 'var(--class-scam-bg)',
          borderColor: 'var(--risk-high-border)',
          description: 'Pesan memiliki indikasi kuat manipulasi bermotif penipuan digital, pencurian identitas, atau kerugian finansial.',
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ),
        };
      case 'Promosi':
        return {
          title: 'Pesan Promosi / Pemasaran',
          badgeClass: 'badge-promo',
          color: 'var(--class-promo)',
          bgColor: 'var(--class-promo-bg)',
          borderColor: '#BFDBFE',
          description: 'Pesan memuat penawaran komersial atau promosi bisnis resmi tanpa indikasi kejahatan siber eksplisit.',
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          ),
        };
      case 'Normal':
      default:
        return {
          title: 'Komunikasi Wajar (Normal)',
          badgeClass: 'badge-normal',
          color: 'var(--class-normal)',
          bgColor: 'var(--class-normal-bg)',
          borderColor: 'var(--risk-low-border)',
          description: 'Pesan diklasifikasikan sebagai percakapan biasa dan tidak menunjukkan pola manipulatif yang mencurigakan.',
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ),
        };
    }
  };

  const config = getLabelConfig();

  return (
    <div className="classification-card glass-card">
      <div className="card-top">
        <div className="class-icon-wrapper" style={{ color: config.color, background: config.bgColor, borderColor: config.borderColor }}>
          {config.icon}
        </div>
        <div className="class-meta">
          <span className="card-label-caption">Hasil Klasifikasi Model</span>
          <h3 className="class-label-title" style={{ color: config.color }}>{config.title}</h3>
        </div>
      </div>

      <p className="class-description">{config.description}</p>

      {confidence > 0 && (
        <div className="confidence-meter-box">
          <div className="meter-label-row">
            <span className="meter-title">Skor Keyakinan Model (Confidence)</span>
            <span className="meter-percentage" style={{ color: config.color }}>{confidencePercent}%</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{
                width: `${confidencePercent}%`,
                background: config.color,
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .classification-card {
          padding: var(--space-5);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .class-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .class-meta {
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

        .class-label-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .class-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: var(--space-4);
        }

        .confidence-meter-box {
          background: #F8FAFC;
          border: 1px solid var(--border-neutral);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
        }

        .meter-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .meter-title {
          color: var(--text-secondary);
        }

        .meter-track {
          width: 100%;
          height: 8px;
          background: #E2E8F0;
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
