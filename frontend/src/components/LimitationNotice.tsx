import React from 'react';

interface LimitationNoticeProps {
  warnings?: string[];
  isMock?: boolean;
}

export const LimitationNotice: React.FC<LimitationNoticeProps> = ({ warnings = [], isMock = false }) => {
  return (
    <div className="limitation-notice-card glass-card">
      <div className="notice-header">
        <div className="notice-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h4 className="notice-title">Batasan Sistem & Catatan Integritas Ilmiah (PRD Bab 34)</h4>
        {isMock && (
          <span className="demo-tag">
            [DATA ILUSTRASI / MODE PENGUJIAN UI]
          </span>
        )}
      </div>

      <div className="notice-body">
        <ul className="notice-list">
          <li>
            <strong>Bukan Vonis Mutlak:</strong> NalarAman adalah alat bantu pendukung keputusan (<em>decision-support system</em>), bukan otoritas penegak hukum atau lembaga sertifikasi siber.
          </li>
          <li>
            <strong>Risiko Rendah ≠ Jaminan Aman:</strong> Pesan dengan risiko rendah tidak otomatis menjamin 100% aman dari modus penipuan varian baru yang belum dipelajari model.
          </li>
          <li>
            <strong>Verifikasi Saluran Resmi:</strong> Selalu konfirmasi informasi perbankan, instansi, atau hadiah ke nomor resmi terverifikasi (Call Center, situs resmi berakhiran .go.id / .co.id).
          </li>
          {warnings.map((warn, index) => (
            <li key={index} className="custom-warning-item">
              <em>{warn}</em>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .limitation-notice-card {
          background: #FFFBEB;
          border: 1.5px solid #FDE68A;
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-5);
          margin-bottom: var(--space-8);
        }

        .notice-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          flex-wrap: wrap;
        }

        .notice-icon {
          color: #D97706;
          display: flex;
          align-items: center;
        }

        .notice-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #92400E;
          margin: 0;
        }

        .demo-tag {
          font-size: 0.6875rem;
          font-weight: 800;
          background: #FEF3C7;
          border: 1px solid #F59E0B;
          color: #B45309;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .notice-body {
          font-size: 0.8125rem;
          color: #78350F;
          line-height: 1.6;
        }

        .notice-list {
          padding-left: 20px;
          margin: 0;
        }

        .notice-list li {
          margin-bottom: 6px;
        }

        .notice-list li:last-child {
          margin-bottom: 0;
        }

        .custom-warning-item {
          color: #B45309;
        }
      `}</style>
    </div>
  );
};
