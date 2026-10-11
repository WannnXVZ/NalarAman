import React, { useState } from 'react';
import type { UIState } from '../types/analysis';

export type DemoScenario = 'scam' | 'promo' | 'normal' | 'lime_fail' | null;

interface StateDemoToolbarProps {
  currentState: UIState;
  activeScenario?: DemoScenario;
  onSelectState: (state: UIState, scenario?: 'scam' | 'promo' | 'normal' | 'lime_fail') => void;
  isBackendConnected: boolean | null;
}

export const StateDemoToolbar: React.FC<StateDemoToolbarProps> = ({
  currentState,
  activeScenario = null,
  onSelectState,
  isBackendConnected,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="demo-toolbar-container glass-card">
      <div className="toolbar-header">
        <div className="toolbar-title-wrap">
          <span className="toolbar-tag">PRD Bab 12.3 & Bab 30</span>
          <h4 className="toolbar-title">Uji Simulasi State Antarmuka (UI Interactive Evaluator)</h4>
        </div>
        <div className="toolbar-header-right">
          <div className="mode-indicator">
            {isBackendConnected ? (
              <span className="live-mode-badge">Mode Real API Siap</span>
            ) : (
              <span className="mock-mode-badge">Mode Standalone Frontend</span>
            )}
          </div>
          <button
            type="button"
            className="toggle-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Buka panel pengujian state' : 'Sembunyikan panel pengujian'}
          >
            {isCollapsed ? 'Tampilkan Uji State ▼' : 'Sembunyikan ▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <p className="toolbar-desc">
            Uji seluruh respons visual komponen sesuai siklus state PRD NalarAman:
          </p>

          <div className="state-buttons-row">
            <button
              type="button"
              className={`state-btn ${currentState === 'initial' ? 'active' : ''}`}
              onClick={() => onSelectState('initial')}
            >
              1. Initial (Bersih)
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'invalid' ? 'active' : ''}`}
              onClick={() => onSelectState('invalid')}
            >
              2. Input Tidak Valid
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'loading' ? 'active' : ''}`}
              onClick={() => onSelectState('loading')}
            >
              3. Loading Analisis
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'success' && activeScenario === 'scam' ? 'active' : ''}`}
              onClick={() => onSelectState('success', 'scam')}
            >
              4. Sukses: Scam Tinggi
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'success' && activeScenario === 'promo' ? 'active' : ''}`}
              onClick={() => onSelectState('success', 'promo')}
            >
              5. Sukses: Promosi
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'success' && activeScenario === 'normal' ? 'active' : ''}`}
              onClick={() => onSelectState('success', 'normal')}
            >
              6. Sukses: Normal
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'lime_unavailable' ? 'active' : ''}`}
              onClick={() => onSelectState('lime_unavailable', 'lime_fail')}
            >
              7. LIME Unavailable
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'model_unavailable' ? 'active' : ''}`}
              onClick={() => onSelectState('model_unavailable')}
            >
              8. Model 503 Gagal
            </button>

            <button
              type="button"
              className={`state-btn ${currentState === 'error' ? 'active' : ''}`}
              onClick={() => onSelectState('error')}
            >
              9. Network Error
            </button>
          </div>
        </>
      )}

      <style>{`
        .demo-toolbar-container {
          background: #FFFFFF;
          border: 1.5px dashed var(--accent-purple);
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-5);
          margin-bottom: var(--space-6);
          transition: all var(--transition-normal);
        }

        .toolbar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .toolbar-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .toolbar-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          background: var(--lavender-surface);
          color: var(--primary-purple);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .toolbar-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--dark-purple);
        }

        .toolbar-header-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .toggle-collapse-btn {
          background: transparent;
          color: var(--primary-purple);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-lavender);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .toggle-collapse-btn:hover {
          background: var(--lavender-surface);
        }

        .live-mode-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #15803D;
          background: #DCFCE7;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .mock-mode-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #6D28D9;
          background: #EDE9FE;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .toolbar-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: var(--space-2) 0 var(--space-3);
        }

        .state-buttons-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .state-btn {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          background: var(--lavender-bg);
          color: var(--dark-purple);
          border: 1px solid var(--border-lavender);
          transition: all var(--transition-fast);
        }

        .state-btn:hover {
          background: var(--lavender-surface);
          border-color: var(--accent-purple);
        }

        .state-btn.active {
          background: var(--primary-purple);
          color: var(--white);
          border-color: var(--primary-purple);
          box-shadow: 0 2px 6px rgba(109, 40, 217, 0.25);
        }
      `}</style>
    </div>
  );
};
