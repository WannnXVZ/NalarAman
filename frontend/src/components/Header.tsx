import React from 'react';

interface HeaderProps {
  backendOnline: boolean | null;
  onRefreshHealth: () => void;
  isCheckingHealth: boolean;
}

export const Header: React.FC<HeaderProps> = ({ backendOnline, onRefreshHealth, isCheckingHealth }) => {
  return (
    <header className="hero-header">
      <div className="container">
        <div className="header-nav">
          <div className="brand-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">NalarAman</span>
              <span className="brand-badge">XAI Research MVP</span>
            </div>
          </div>

          <div className="header-status">
            <button
              onClick={onRefreshHealth}
              disabled={isCheckingHealth}
              className={`status-pill ${backendOnline === true ? 'online' : backendOnline === false ? 'offline' : 'checking'}`}
              title="Klik untuk memeriksa ulang status koneksi backend FastAPI"
            >
              <span className="status-dot"></span>
              <span className="status-label">
                {isCheckingHealth
                  ? 'Memeriksa...'
                  : backendOnline === true
                  ? 'Backend API Aktif'
                  : backendOnline === false
                  ? 'Backend Terputus (Mode Demo)'
                  : 'Memeriksa Backend'}
              </span>
            </button>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Kenali Risikonya, <span className="highlight-text">Pahami Alasannya.</span>
          </h1>
          <p className="hero-description">
            Platform deteksi penipuan digital berbahasa Indonesia berbasis <strong>Explainable AI (LIME)</strong>.
            Bukan sekadar label aman atau bahaya, kami membuka transparansi faktor pemicu di balik setiap keputusan.
          </p>
        </div>
      </div>

      <style>{`
        .hero-header {
          background: linear-gradient(145deg, var(--dark-purple) 0%, #3B0764 50%, var(--primary-purple) 100%);
          color: var(--white);
          padding: var(--space-6) 0 var(--space-10);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: var(--space-6);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .brand-text {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.45rem;
          letter-spacing: -0.02em;
          color: var(--white);
        }

        .brand-badge {
          background: rgba(221, 214, 254, 0.2);
          border: 1px solid rgba(221, 214, 254, 0.35);
          color: #DDD6FE;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(8px);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all var(--transition-fast);
        }

        .status-pill:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.4);
          transform: translateY(-1px);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-pill.online .status-dot {
          background: #4ADE80;
          box-shadow: 0 0 8px #4ADE80;
        }

        .status-pill.offline .status-dot {
          background: #F87171;
          box-shadow: 0 0 8px #F87171;
        }

        .status-pill.checking .status-dot {
          background: #FBBF24;
          animation: spin 1s linear infinite;
        }

        .hero-content {
          max-width: 780px;
          margin-top: var(--space-4);
        }

        .hero-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          color: var(--white);
          line-height: 1.2;
          margin-bottom: var(--space-3);
        }

        .highlight-text {
          background: linear-gradient(90deg, #DDD6FE 0%, #C4B5FD 50%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.6;
          margin-bottom: 0;
        }
      `}</style>
    </header>
  );
};
