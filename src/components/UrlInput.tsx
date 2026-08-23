import React, { useState } from 'react';
import { Link2, Clipboard, ArrowRight, Loader2, X, Sparkles } from 'lucide-react';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onExtract: () => void;
  isLoading: boolean;
  onLoadDemo: () => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  url,
  setUrl,
  onExtract,
  isLoading,
  onLoadDemo,
}) => {
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 1500);
        }
      }
    } catch {
      // Fallback if clipboard permission is denied
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onExtract();
    }
  };

  return (
    <div className="hero-card">
      <h2 className="hero-title">Extract Full Swing Session Data</h2>
      <p className="hero-subtitle">
        Paste your Full Swing share link or Session UUID below to extract shot telemetry and download an import-ready SwingSync CSV.
      </p>

      <form className="url-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <Link2 size={18} className="input-icon" />
          <input
            type="text"
            className="url-input"
            placeholder="https://myfullswinggolf.com/lm/share/5c6af3dc-..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <div className="input-actions">
            {url && (
              <button
                type="button"
                className="action-btn-sm"
                onClick={() => setUrl('')}
                title="Clear input"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              className="action-btn-sm"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <Clipboard size={14} />
              <span>{pasteSuccess ? 'Pasted!' : 'Paste'}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!url.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>Extracting Session Data...</span>
            </>
          ) : (
            <>
              <span>Extract & Process Session</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="form-footer">
          <span>Supports all standard Full Swing Golf shared session URLs</span>
          <button
            type="button"
            className="demo-trigger"
            onClick={onLoadDemo}
            disabled={isLoading}
          >
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Load sample session (108 shots)
          </button>
        </div>
      </form>
    </div>
  );
};
