import React, { useState } from 'react';
import { Download, FileSpreadsheet, Code, Check, Target } from 'lucide-react';
import { ParsedSessionData } from '../types.js';
import { trackEvent } from '../utils/analytics.js';

interface ExportBarProps {
  data: ParsedSessionData;
  url: string;
}

export const ExportBar: React.FC<ExportBarProps> = ({ data, url }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleDownload = (format: 'swingsync' | 'trackman' | 'raw' | 'json') => {
    setDownloadingFormat(format);
    const endpoint = `/api/export/${format}?url=${encodeURIComponent(url || data.shareUrl)}`;
    
    // Track GA4 event
    trackEvent('download_session_data', {
      format,
      total_shots: data.session.totalShots,
      session_date: data.session.formattedDate,
    });

    const dateStr = data.session.startTimestamp
      ? new Date(data.session.startTimestamp * 1000).toISOString().split('T')[0]
      : 'session';
    const idPrefix = (data.shareUrl || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) || 'export';

    let filename = `export_${dateStr}.csv`;
    if (format === 'swingsync') {
      filename = `swingsync_${dateStr}_${idPrefix}.csv`;
    } else if (format === 'trackman') {
      filename = `trackman_${dateStr}_${idPrefix}.csv`;
    } else if (format === 'raw') {
      filename = `fullswing_raw_${dateStr}_${idPrefix}.csv`;
    } else if (format === 'json') {
      filename = `fullswing_${dateStr}_${idPrefix}.json`;
    }

    // Create hidden anchor to trigger browser download with explicit filename & extension
    const a = document.createElement('a');
    a.href = endpoint;
    a.download = filename;
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
          Export Session Data
        </h3>
        <p>
          {data.session.totalShots} shots ready for direct import into SwingSync, Trackman, or spreadsheet analysis.
        </p>
      </div>

      <div className="export-buttons">
        <button
          type="button"
          className="btn-primary-export"
          onClick={() => handleDownload('swingsync')}
          title="Download CSV formatted for SwingSync (.csv)"
        >
          {downloadingFormat === 'swingsync' ? (
            <>
              <Check size={18} />
              <span>Downloaded .CSV!</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>SwingSync CSV</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-trackman-export"
          onClick={() => handleDownload('trackman')}
          title="Download CSV formatted with Trackman column schema (.csv)"
        >
          {downloadingFormat === 'trackman' ? (
            <>
              <Check size={18} />
              <span>Downloaded .CSV!</span>
            </>
          ) : (
            <>
              <Target size={18} />
              <span>Trackman CSV</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-secondary-export"
          onClick={() => handleDownload('raw')}
          title="Download Full Swing raw metric CSV (.csv)"
        >
          <FileSpreadsheet size={16} />
          <span>Raw CSV</span>
        </button>

        <button
          type="button"
          className="btn-secondary-export"
          onClick={() => handleDownload('json')}
          title="Download Full Swing raw JSON data (.json)"
        >
          <Code size={16} />
          <span>JSON</span>
        </button>
      </div>
    </div>
  );
};
