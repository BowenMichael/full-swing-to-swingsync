import React, { useEffect, useState } from 'react';
import { Users, Eye, FileDown, Activity, X, RefreshCw } from 'lucide-react';

interface StatsData {
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalExtractions: number;
  totalSwingSyncDownloads: number;
  totalRawDownloads: number;
  recentEvents: Array<{
    type: string;
    timestamp: string;
    userAgent?: string;
    country?: string;
  }>;
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--emerald-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Website Traffic & Usage Analytics</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="action-btn-sm"
              onClick={fetchStats}
              disabled={loading}
              title="Refresh stats"
            >
              <RefreshCw size={14} className={loading ? 'spinner' : ''} />
            </button>
            <button
              type="button"
              className="action-btn-sm"
              onClick={onClose}
              title="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {stats ? (
          <div className="modal-body">
            <div className="overview-grid">
              <div className="stat-pill-card">
                <span className="stat-pill-label">
                  <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Total Views
                </span>
                <span className="stat-pill-value">{stats.totalPageViews}</span>
                <span className="stat-pill-sub">Page impressions</span>
              </div>

              <div className="stat-pill-card">
                <span className="stat-pill-label">
                  <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Unique Visitors
                </span>
                <span className="stat-pill-value" style={{ color: 'var(--emerald-primary)' }}>
                  {stats.totalUniqueVisitors}
                </span>
                <span className="stat-pill-sub">Distinct devices</span>
              </div>

              <div className="stat-pill-card">
                <span className="stat-pill-label">
                  <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Extractions
                </span>
                <span className="stat-pill-value">{stats.totalExtractions}</span>
                <span className="stat-pill-sub">Sessions parsed</span>
              </div>

              <div className="stat-pill-card">
                <span className="stat-pill-label">
                  <FileDown size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Downloads
                </span>
                <span className="stat-pill-value" style={{ color: '#93c5fd' }}>
                  {stats.totalSwingSyncDownloads + stats.totalRawDownloads}
                </span>
                <span className="stat-pill-sub">{stats.totalSwingSyncDownloads} SwingSync CSVs</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Recent Activity Stream
              </h4>
              <div className="event-log-list">
                {stats.recentEvents.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No events recorded yet.</p>
                ) : (
                  stats.recentEvents.map((evt, idx) => (
                    <div key={idx} className="event-log-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={`event-badge badge-${evt.type}`}>
                          {evt.type.replace('_', ' ')}
                        </span>
                        {evt.country && <span className="event-country">{evt.country}</span>}
                      </div>
                      <span className="event-time">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading analytics...
          </div>
        )}
      </div>
    </div>
  );
};
