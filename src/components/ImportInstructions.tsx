import React, { useState } from 'react';
import { Smartphone, Monitor, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

type Platform = 'ios' | 'android' | 'desktop';

export const ImportInstructions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Platform>('ios');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="instructions-card">
      <div
        className="instructions-toggle-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={18} color="var(--emerald-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            How to Import this CSV into SwingSync
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.8rem' }}>{isOpen ? 'Hide Guide' : 'View Instructions'}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="instructions-body">
          {/* Platform Tab Buttons */}
          <div className="platform-tab-bar">
            <button
              type="button"
              className={`platform-tab ${activeTab === 'ios' ? 'active' : ''}`}
              onClick={() => setActiveTab('ios')}
            >
              <Smartphone size={15} />
              <span>iOS (iPhone / iPad)</span>
            </button>

            <button
              type="button"
              className={`platform-tab ${activeTab === 'android' ? 'active' : ''}`}
              onClick={() => setActiveTab('android')}
            >
              <Smartphone size={15} />
              <span>Android</span>
            </button>

            <button
              type="button"
              className={`platform-tab ${activeTab === 'desktop' ? 'active' : ''}`}
              onClick={() => setActiveTab('desktop')}
            >
              <Monitor size={15} />
              <span>Desktop (Mac / PC)</span>
            </button>
          </div>

          {/* Platform Specific Content */}
          <div className="platform-content">
            {activeTab === 'ios' && (
              <ol className="instruction-steps">
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>1. Download CSV:</strong> Tap the green <strong>"SwingSync CSV"</strong> button above. When Safari asks, tap <em>Download</em> (the file saves to your iOS <strong>Files</strong> app in the <code>Downloads</code> folder).
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>2. Open SwingSync:</strong> Open the SwingSync mobile app or navigate to your account at <a href="https://swingsync.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-primary)' }}>swingsync.com</a> in Safari.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>3. Upload Session:</strong> Go to <strong>Sessions</strong> ➔ Tap <strong>Import / Upload CSV</strong> ➔ Tap <em>Choose File</em> and select your newly downloaded <code>swingsync_*.csv</code> from the <strong>Downloads</strong> folder in Files.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>4. Done!</strong> Your Full Swing shots, club classifications, speeds, and carry distances will immediately populate your SwingSync analytics dashboard.
                  </div>
                </li>
              </ol>
            )}

            {activeTab === 'android' && (
              <ol className="instruction-steps">
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>1. Download CSV:</strong> Tap the green <strong>"SwingSync CSV"</strong> button above. Chrome will download the <code>.csv</code> file directly into your device's <strong>Downloads</strong> folder.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>2. Open SwingSync:</strong> Launch your SwingSync app or visit <a href="https://swingsync.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-primary)' }}>swingsync.com</a> on your Android browser.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>3. Select File:</strong> Navigate to <strong>Sessions</strong> ➔ Tap <strong>Import Session</strong> ➔ Select the downloaded CSV from your device files.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>4. Sync & Analyze:</strong> Your Full Swing shot data will automatically parse and display shot shapes, club averages, and dispersion analysis.
                  </div>
                </li>
              </ol>
            )}

            {activeTab === 'desktop' && (
              <ol className="instruction-steps">
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>1. Save CSV:</strong> Click <strong>"SwingSync CSV"</strong> to save the file to your computer's <code>Downloads</code> folder.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>2. Go to SwingSync:</strong> Log into <a href="https://swingsync.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-primary)' }}>swingsync.com</a> in your web browser.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>3. Import File:</strong> Head to the <strong>Sessions / Shot Table</strong> section ➔ Click <strong>Import CSV</strong> ➔ Drag and drop the downloaded <code>swingsync_*.csv</code> file.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="step-check" />
                  <div>
                    <strong>4. Instant Analytics:</strong> Review your club metrics, launch angles, spin rates, and smash factors.
                  </div>
                </li>
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
