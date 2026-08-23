import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { UrlInput } from './components/UrlInput.js';
import { SessionSummary } from './components/SessionSummary.js';
import { ExportBar } from './components/ExportBar.js';
import { ShotTable } from './components/ShotTable.js';
import { StatsModal } from './components/StatsModal.js';
import { ParsedSessionData } from './types.js';
import { AlertCircle, BarChart2 } from 'lucide-react';

const DEMO_URL = 'https://myfullswinggolf.com/lm/share/5c6af3dc-9e48-412b-a041-a41726b25956';

export const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<ParsedSessionData | null>(null);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Send visitor beacon on page load
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      // Ignore background tracking errors
    });
  }, []);

  const handleExtract = async (targetUrl = url) => {
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to extract session data from Full Swing.');
      }

      setSessionData(resJson.data);
      setSelectedClub(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
      setSessionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setUrl(DEMO_URL);
    handleExtract(DEMO_URL);
  };

  return (
    <div className="app-container">
      <Header onOpenStats={() => setIsStatsOpen(true)} />

      <UrlInput
        url={url}
        setUrl={setUrl}
        onExtract={() => handleExtract()}
        isLoading={isLoading}
        onLoadDemo={handleLoadDemo}
      />

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Extraction Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {sessionData && (
        <main className="dashboard">
          <SessionSummary
            data={sessionData}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
          />

          <ExportBar data={sessionData} url={url} />

          <ShotTable
            shots={sessionData.shots}
            selectedClub={selectedClub}
          />
        </main>
      )}

      <footer className="app-footer">
        <p>
          Full Swing to SwingSync CSV Extractor &bull; Built with React, TypeScript & Node.js
        </p>
        <button
          type="button"
          onClick={() => setIsStatsOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <BarChart2 size={13} color="var(--emerald-primary)" />
          <span>View Site Traffic & Usage Stats</span>
        </button>
      </footer>

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
    </div>
  );
};
