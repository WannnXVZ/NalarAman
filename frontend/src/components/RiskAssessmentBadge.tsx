import React from 'react';
import type { RiskAssessment } from '../types/analysis';

interface RiskAssessmentBadgeProps {
  assessment: RiskAssessment;
}

export const RiskAssessmentBadge: React.FC<RiskAssessmentBadgeProps> = ({ assessment }) => {
  const { level, basis } = assessment;

  const getRiskDetails = () => {
    switch (level) {
      case 'tinggi':
        return {
          chipLabel: '■ Risiko Tinggi',
          chipClass: 'risk-high',
          badgeColor: 'var(--risk-high)',
          bgColor: 'var(--risk-high-bg)',
          borderColor: 'var(--risk-high-border)',
          summary: 'Potensi penipuan atau ancaman manipulasi sangat kuat.',
          actionTip: 'Waspada! Jangan buka tautan, jangan instal berkas apa pun, dan jangan berikan informasi pribadi seperti kode OTP/PIN.',
        };
      case 'sedang':
        return {
          chipLabel: '▲ Risiko Sedang',
          chipClass: 'risk-med',
          badgeColor: 'var(--risk-med)',
          bgColor: 'var(--risk-med-bg)',
          borderColor: 'var(--risk-med-border)',
          summary: 'Pesan memuat indikasi manipulasi psikologis atau konteks yang mencurigakan.',
          actionTip: 'Lakukan verifikasi silang langsung ke nomor resmi pihak terkait sebelum mengambil tindakan apa pun.',
        };
      case 'rendah':
      default:
        return {
          chipLabel: '● Risiko Rendah',
          chipClass: 'risk-low',
          badgeColor: 'var(--risk-low)',
          bgColor: 'var(--risk-low-bg)',
          borderColor: 'var(--risk-low-border)',
          summary: 'Tidak ditemukan indikasi manipulasi atau pola social engineering yang signifikan.',
          actionTip: 'Pesan relatif aman, namun tetap waspada jika ada permintaan transfer mendadak di kemudian waktu.',
        };
    }
  };

  const details = getRiskDetails();

  return (
    <div className="risk-card glass-card">
      <div className="risk-header">
        <div className="risk-title-wrap">
          <span className="card-label-caption">Tingkat Risiko Pesan</span>
          <h3 className="risk-headline">Penilaian Risiko</h3>
        </div>
        <div
          className={`risk-chip-pill ${details.chipClass}`}
          style={{
            background: details.bgColor,
            color: details.badgeColor,
            borderColor: details.borderColor,
          }}
        >
          {details.chipLabel}
        </div>
      </div>

      <p className="risk-summary">{details.summary}</p>

      <div className="risk-basis-box">
        <span className="basis-label">Dasar Penilaian Transparan:</span>
        <p className="basis-text">{basis}</p>
      </div>

      <div className="risk-recommendation-box">
        <div className="rec-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="rec-content">
          <span className="rec-title">Saran Tindakan:</span>
          <p className="rec-text">{details.actionTip}</p>
        </div>
      </div>

      <style>{`
        .risk-card {
          padding: var(--space-5);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .risk-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }

        .card-label-caption {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .risk-headline {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--dark-purple);
        }

        .risk-chip-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 700;
          border: 1px solid;
          letter-spacing: 0.01em;
        }

        .risk-summary {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
          line-height: 1.5;
        }

        .risk-basis-box {
          background: var(--lavender-bg);
          border: 1px solid var(--border-lavender);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-3);
        }

        .basis-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--dark-purple);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          display: block;
          margin-bottom: 2px;
        }

        .basis-text {
          font-size: 0.8125rem;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.45;
        }

        .risk-recommendation-box {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          background: #F8FAFC;
          border: 1px solid var(--border-neutral);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
        }

        .rec-icon {
          color: var(--primary-purple);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .rec-content {
          display: flex;
          flex-direction: column;
        }

        .rec-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--dark-purple);
        }

        .rec-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
};
