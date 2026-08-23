import React, { useState } from 'react';
import { Download, FileSpreadsheet, Code, Check } from 'lucide-react';
import { ParsedSessionData } from '../types.js';

interface ExportBarProps {
  data: ParsedSessionData;
  url: string;
}

export const ExportBar: React.FC<ExportBarProps> = ({ data, url }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleDownload = (format: 'swingsync' | 'raw' | 'json') => {
    setDownloadingFormat(format);
    const endpoint = `/api/export/${format}?url=${encodeURIComponent(url || data.shareUrl)}`;
    
    // Create hidden anchor to trigger standard browser file download
    const a = document.createElement('a');
    a.href = endpoint;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadingFormat(null);
    }, 2000);
  };

  return (
    <div className="export-card">
      <div className="export-info">
        <h3>
          <FileSpreadsheet size={20} color="var(--emerald-primary)" />
          SwingSync Ready Export
        </h3>
        <p>
          Formatted with {data.session.totalShots} shots ready for direct import into SwingSync analytics.
        </p>
      </div>

      <div className="export-buttons">
        <button
          type="button"
          className="btn-primary-export"
          onClick={() => handleDownload('swingsync')}
        >
          {downloadingFormat === 'swingsync' ? (
            <>
              <Check size={18} />
              <span>Downloaded CSV!</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Download SwingSync CSV</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-secondary-export"
          onClick={() => handleDownload('raw')}
          title="Download Full Swing raw metric CSV"
        >
          <FileSpreadsheet size={16} />
          <span>Raw CSV</span>
        </button>

        <button
          type="button"
          className="btn-secondary-export"
          onClick={() => handleDownload('json')}
          title="Download Full Swing raw JSON data"
        >
          <Code size={16} />
          <span>JSON</span>
        </button>
      </div>
    </div>
  );
};
