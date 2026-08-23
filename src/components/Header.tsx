import React from 'react';
import { Target, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo-badge">
          <Target size={24} />
        </div>
        <div className="brand-info">
          <h1>
            Full Swing <span style={{ color: 'var(--text-muted)' }}>➔</span> SwingSync
            <span className="tag-badge">CSV Exporter</span>
          </h1>
          <p>Extract launch monitor telemetry and format for SwingSync</p>
        </div>
      </div>

      <div className="header-links">
        <a
          href="https://swingsync.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link-btn"
          title="Visit SwingSync"
        >
          <span>SwingSync</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
};
