import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-logo">
              <span className="footer-brand-name">NalarAman</span>
              <span className="footer-ver">v0.1.0-alpha</span>
            </div>
            <p className="footer-tagline">&ldquo;Kenali Risikonya, Pahami Alasannya.&rdquo;</p>
            <p className="footer-desc">
              Prototipe Penelitian Platform Deteksi Penipuan Digital Berbasis Explainable Artificial Intelligence (XAI) untuk Pesan Berbahasa Indonesia.
            </p>
          </div>

          <div className="footer-col-nav">
            <h5 className="footer-heading">Dokumentasi Proyek</h5>
            <ul className="footer-links">
              <li>
                <a href="#prd" onClick={(e) => { e.preventDefault(); alert('PRD lengkap tersimpan di folder docs/PRD_NalarAman.html'); }}>
                  Product Requirements Document (PRD)
                </a>
              </li>
              <li>
                <a href="#contract" onClick={(e) => { e.preventDefault(); alert('Kontrak API tersimpan di docs/api-contract.md'); }}>
                  Spesifikasi Kontrak API (v1)
                </a>
              </li>
              <li>
                <a href="#design" onClick={(e) => { e.preventDefault(); alert('Design System tersimpan di docs/design-system.md'); }}>
                  Design System & Tokens
                </a>
              </li>
              <li>
                <a href="#progress" onClick={(e) => { e.preventDefault(); alert('Progress Tracker tersimpan di docs/progress-tracker.md'); }}>
                  Progress & Implementation Tracker
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col-compliance">
            <h5 className="footer-heading">Integritas & Etika Riset</h5>
            <p className="footer-compliance-text">
              Seluruh pemrosesan teks dilakukan tanpa penyimpanan pesan permanen tanpa persetujuan pengguna (PRD Bab 26). Sistem membedakan secara tegas antara estimasi statistik dan bukti nyata.
            </p>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p>© 2026 NalarAman Research Project — Dikembangkan untuk Lomba Karya Tulis Ilmiah (LKTI).</p>
          <p className="footer-build-meta">FastAPI + React 19 + TypeScript + XAI (LIME)</p>
        </div>
      </div>

      <style>{`
        .main-footer {
          background: #FFFFFF;
          border-top: 1px solid var(--border-neutral);
          padding: var(--space-8) 0 var(--space-6);
          margin-top: var(--space-12);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--border-neutral);
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1.2fr 1.5fr;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-1);
        }

        .footer-brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--dark-purple);
        }

        .footer-ver {
          font-size: 0.6875rem;
          background: var(--lavender-surface);
          color: var(--primary-purple);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .footer-tagline {
          font-size: 0.875rem;
          font-style: italic;
          color: var(--primary-purple);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .footer-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .footer-heading {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--dark-purple);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: var(--space-3);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .footer-links a {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }

        .footer-links a:hover {
          color: var(--primary-purple);
        }

        .footer-compliance-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .footer-bottom-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
          padding-top: var(--space-5);
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }

        @media (min-width: 640px) {
          .footer-bottom-row {
            flex-direction: row;
            text-align: left;
          }
        }

        .footer-build-meta {
          font-family: var(--font-mono);
        }
      `}</style>
    </footer>
  );
};
