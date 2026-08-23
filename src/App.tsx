import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { UrlInput } from './components/UrlInput.js';
import { SessionSummary } from './components/SessionSummary.js';
import { ExportBar } from './components/ExportBar.js';
import { ImportInstructions } from './components/ImportInstructions.js';
import { ShotTable } from './components/ShotTable.js';
import { ParsedSessionData } from './types.js';
import { initGoogleAnalytics, trackEvent } from './utils/analytics.js';
import { AlertCircle } from 'lucide-react';

const DEMO_URL = 'https://myfullswinggolf.com/lm/share/5c6af3dc-9e48-412b-a041-a41726b25956';

export const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<ParsedSessionData | null>(null);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  // Initialize Google Analytics 4
  useEffect(() => {
    initGoogleAnalytics();
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

      // Track successful extraction in GA4
      trackEvent('extract_session', {
        total_shots: resJson.data.session.totalShots,
        location: resJson.data.session.location,
        duration: resJson.data.session.duration,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
      setSessionData(null);
      trackEvent('extraction_error', { error_message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setUrl(DEMO_URL);
    trackEvent('load_demo_session');
    handleExtract(DEMO_URL);
  };

  return (
    <div className="app-container">
      <Header />

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
          {/* Main Action: Export directly below URL input */}
          <ExportBar data={sessionData} url={url} />

          {/* Platform Import Instructions */}
          <ImportInstructions />

          <SessionSummary
            data={sessionData}
            selectedClub={selectedClub}
            setSelectedClub={(club) => {
              setSelectedClub(club);
              if (club) trackEvent('filter_club', { club });
            }}
          />

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
      </footer>
    </div>
  );
};
