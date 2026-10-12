import React from 'react';
import type { LimeExplanation } from '../types/analysis';

interface LimeExplanationPanelProps {
  explanation: LimeExplanation;
}

export const LimeExplanationPanel: React.FC<LimeExplanationPanelProps> = ({ explanation }) => {
  const { available, contributions = [], reason, computation_time_ms } = explanation;

  return (
    <div className="lime-panel-card glass-card">
      <div className="lime-panel-header">
        <div className="lime-header-title-wrap">
          <div className="badge-xai-tech">
            <span className="dot-pulse"></span>
            <span>Explainable AI Engine (LIME)</span>
          </div>
          <h3 className="lime-title">Transparansi Faktor Prediksi (XAI)</h3>
        </div>

        {available && computation_time_ms && (
          <span className="computation-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Inference: {computation_time_ms} ms
          </span>
        )}
      </div>

      <p className="lime-subtitle">
        Metode <strong>Local Interpretable Model-agnostic Explanations (LIME)</strong> mengukur kata atau frasa spesifik yang paling berpengaruh menaikkan atau menurunkan skor penipuan pada pesan ini.
      </p>

      {available ? (
        <div className="lime-contributions-container">
          <div className="lime-legend-bar">
            <div className="legend-item supporting">
              <span className="legend-box supporting"></span>
              <span>Kata pemicu indikasi Scam (Bobot Positif)</span>
            </div>
            <div className="legend-item mitigating">
              <span className="legend-box mitigating"></span>
              <span>Kata yang menurunkan risiko / Normal (Bobot Negatif)</span>
            </div>
          </div>

          <div className="contributions-list">
            {(() => {
              const maxAbsWeight = Math.max(...contributions.map(c => Math.abs(c.weight)), 0.01);

              return contributions.map((item, idx) => {
                const isSupportingScam = item.direction === 'mendukung_scam';
                const absWeight = Math.abs(item.weight);
                // Skala relatif proporsional terhadap kata berbobot tertinggi (maksimal 88% lebar, minimal 18% agar tag terbaca)
                const relativeRatio = absWeight / maxAbsWeight;
                const percentageWidth = Math.max(Math.round(relativeRatio * 88), 18);

                return (
                  <div key={idx} className="contribution-row">
                    <div className="token-label-col">
                      <code className="token-code">{item.token}</code>
                      <span className="token-score">
                        {item.weight > 0 ? `+${item.weight.toFixed(2)}` : item.weight.toFixed(2)}
                      </span>
                    </div>

                    <div className="bar-track-col">
                      <div
                        className={`bar-fill ${isSupportingScam ? 'bar-scam' : 'bar-normal'}`}
                        style={{ width: `${percentageWidth}%` }}
                      >
                        <span className="bar-tag">
                          {isSupportingScam ? 'Pemicu Risiko' : 'Mereduksi Risiko'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="lime-educational-callout">
            <div className="callout-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <p className="callout-text">
              <strong>Mengapa visualisasi ini penting?</strong> Sistem XAI tidak bekerja seperti kotak hitam (black-box). Anda dapat melihat langsung alasan model menaruh perhatian pada frasa tersebut, sehingga membantu Anda memahami teknik manipulasi pelaku penipuan.
            </p>
          </div>
        </div>
      ) : (
        <div className="lime-unavailable-box">
          <div className="unavailable-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <div className="unavailable-content">
            <h4 className="unavailable-title">Penjelasan XAI (LIME) Sementara Tidak Tersedia</h4>
            <p className="unavailable-desc">
              {reason || 'Komponen visualisasi bobot kata LIME sedang tidak aktif atau membutuhkan prosesor/waktu komputasi lebih lanjut. Hasil klasifikasi dan pola social engineering di atas tetap valid.'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .lime-panel-card {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }

        .lime-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .lime-header-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .badge-xai-tech {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-purple);
          background: #EDE9FE;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          width: fit-content;
        }

        .dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary-purple);
          box-shadow: 0 0 6px var(--primary-purple);
        }

        .lime-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--dark-purple);
        }

        .computation-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: #F1F5F9;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .lime-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: var(--space-4);
        }

        .lime-legend-bar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          background: #F8FAFC;
          border: 1px solid var(--border-neutral);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-4);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .legend-box {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-box.supporting {
          background: #EF4444;
        }

        .legend-box.mitigating {
          background: #10B981;
        }

        .contributions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .contribution-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .token-label-col {
          width: 180px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .token-code {
          font-family: var(--font-mono);
          background: #F1F5F9;
          color: var(--dark-purple);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .token-score {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .bar-track-col {
          flex: 1;
          height: 24px;
          background: #F1F5F9;
          border-radius: var(--radius-sm);
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 8px;
          border-radius: var(--radius-sm);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bar-fill.bar-scam {
          background: linear-gradient(90deg, #F87171 0%, #EF4444 100%);
          color: var(--white);
        }

        .bar-fill.bar-normal {
          background: linear-gradient(90deg, #34D399 0%, #10B981 100%);
          color: var(--white);
        }

        .bar-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .lime-educational-callout {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          background: var(--lavender-bg);
          border: 1px solid var(--border-lavender);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
        }

        .callout-icon {
          color: var(--primary-purple);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .callout-text {
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0;
        }

        .lime-unavailable-box {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }

        .unavailable-icon {
          color: #D97706;
          flex-shrink: 0;
        }

        .unavailable-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #92400E;
          margin-bottom: 2px;
        }

        .unavailable-desc {
          font-size: 0.8125rem;
          color: #B45309;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
