import React, { useState } from 'react';
import { Smartphone, Monitor, CheckCircle2, HelpCircle } from 'lucide-react';

type Platform = 'ios' | 'android' | 'desktop';

export const ImportInstructions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Platform>('ios');

  return (
    <div className="instructions-section">
      <div className="instructions-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <HelpCircle size={16} color="var(--emerald-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            How to Import into SwingSync:
          </span>
        </div>

        {/* Platform Tab Buttons */}
        <div className="platform-tab-bar">
          <button
            type="button"
            className={`platform-tab ${activeTab === 'ios' ? 'active' : ''}`}
            onClick={() => setActiveTab('ios')}
          >
            <Smartphone size={13} />
            <span>iOS (iPhone / iPad)</span>
          </button>

          <button
            type="button"
            className={`platform-tab ${activeTab === 'android' ? 'active' : ''}`}
            onClick={() => setActiveTab('android')}
          >
            <Smartphone size={13} />
            <span>Android</span>
          </button>

          <button
            type="button"
            className={`platform-tab ${activeTab === 'desktop' ? 'active' : ''}`}
            onClick={() => setActiveTab('desktop')}
          >
            <Monitor size={13} />
            <span>Desktop (Mac / PC)</span>
          </button>
        </div>
      </div>

      {/* Platform Specific Steps */}
      <div className="platform-content">
        {activeTab === 'ios' && (
          <ol className="instruction-steps">
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>1. Download:</strong> Tap the green <strong>"SwingSync CSV"</strong> button above (Safari will prompt and save the file to your iOS <strong>Files</strong> app in <code>Downloads</code>).
              </div>
            </li>
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>2. Open SwingSync:</strong> Launch the SwingSync app or go to <a href="https://swingsync.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-primary)' }}>swingsync.com</a> in Safari.
              </div>
            </li>
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>3. Import Session:</strong> Navigate to <strong>Sessions</strong> ➔ <strong>Import CSV</strong> ➔ Select your <code>swingsync_*.csv</code> from the <strong>Files</strong> app.
              </div>
            </li>
          </ol>
        )}

        {activeTab === 'android' && (
          <ol className="instruction-steps">
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>1. Download:</strong> Tap the green <strong>"SwingSync CSV"</strong> button above (saves to your Android <code>Downloads</code> directory).
              </div>
            </li>
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>2. Open SwingSync:</strong> Open the SwingSync app or mobile browser at <a href="https://swingsync.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-primary)' }}>swingsync.com</a>.
              </div>
            </li>
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>3. Import Session:</strong> Go to <strong>Sessions</strong> ➔ <strong>Import Session</strong> ➔ Select the downloaded CSV from your files.
              </div>
            </li>
          </ol>
        )}

        {activeTab === 'desktop' && (
          <ol className="instruction-steps">
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>1. Download:</strong> Click <strong>"SwingSync CSV"</strong> above to save the file to your computer.
              </div>
            </li>
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>2. Open SwingSync:</strong> Go to <a href="https://swingsync.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-primary)' }}>swingsync.com</a> and log in.
              </div>
            </li>
            <li>
              <CheckCircle2 size={15} className="step-check" />
              <div>
                <strong>3. Import:</strong> In <strong>Sessions / Shot Table</strong>, click <strong>Import CSV</strong> and upload your <code>swingsync_*.csv</code> file.
              </div>
            </li>
          </ol>
        )}
      </div>
    </div>
  );
};
