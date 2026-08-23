import React from 'react';
import { ParsedSessionData, ClubSummary } from '../types.js';
import { Calendar, Clock, MapPin, Activity, Flame } from 'lucide-react';

interface SessionSummaryProps {
  data: ParsedSessionData;
  selectedClub: string | null;
  setSelectedClub: (club: string | null) => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  data,
  selectedClub,
  setSelectedClub,
}) => {
  const { session, clubSummaries } = data;

  const currentSummary: ClubSummary | undefined = selectedClub
    ? clubSummaries.find((c) => c.clubName === selectedClub)
    : undefined;

  return (
    <div className="dashboard-summary">
      {/* Session Metadata Grid */}
      <div className="overview-grid">
        <div className="stat-pill-card">
          <span className="stat-pill-label">
            <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Session Date
          </span>
          <span className="stat-pill-value" style={{ fontSize: '1rem' }}>
            {session.formattedDate}
          </span>
        </div>

        <div className="stat-pill-card">
          <span className="stat-pill-label">
            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Duration
          </span>
          <span className="stat-pill-value">{session.durationFormatted}</span>
          <span className="stat-pill-sub">{session.duration ? `${Math.round(session.duration / 60)} minutes` : ''}</span>
        </div>

        <div className="stat-pill-card">
          <span className="stat-pill-label">
            <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Environment
          </span>
          <span className="stat-pill-value" style={{ fontSize: '1.1rem' }}>
            {session.location || 'Simulator'}
          </span>
        </div>

        <div className="stat-pill-card">
          <span className="stat-pill-label">
            <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Total Shots
          </span>
          <span className="stat-pill-value" style={{ color: 'var(--emerald-primary)' }}>
            {session.totalShots}
          </span>
          <span className="stat-pill-sub">{clubSummaries.length} clubs used</span>
        </div>
      </div>

      {/* Club Selector Bar */}
      <div style={{ marginTop: '1.5rem' }}>
        <div className="section-heading">
          <h3>
            <Flame size={18} color="var(--amber-primary)" />
            Club Performance Averages
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tap a club to filter table & view metrics
          </span>
        </div>

        <div className="club-filter-bar">
          <button
            type="button"
            className={`club-pill ${selectedClub === null ? 'active' : ''}`}
            onClick={() => setSelectedClub(null)}
          >
            <span>All Clubs</span>
            <span className="pill-count">{session.totalShots}</span>
          </button>

          {clubSummaries.map((club) => (
            <button
              key={club.clubName}
              type="button"
              className={`club-pill ${selectedClub === club.clubName ? 'active' : ''}`}
              onClick={() => setSelectedClub(club.clubName)}
            >
              <span>{club.clubName}</span>
              <span className="pill-count">{club.shotCount}</span>
            </button>
          ))}
        </div>

        {/* Selected Club Metrics Grid */}
        {currentSummary ? (
          <div className="club-metrics-grid" style={{ marginTop: '0.75rem' }}>
            <div className="metric-card">
              <span className="metric-card-label">Avg Carry</span>
              <span className="metric-card-val">{currentSummary.avgCarryDistance ?? '--'}</span>
              <span className="metric-card-unit">yards</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Avg Total</span>
              <span className="metric-card-val">{currentSummary.avgTotalDistance ?? '--'}</span>
              <span className="metric-card-unit">yards</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Avg Ball Speed</span>
              <span className="metric-card-val">{currentSummary.avgBallSpeed ?? '--'}</span>
              <span className="metric-card-unit">mph</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Avg Club Speed</span>
              <span className="metric-card-val">{currentSummary.avgClubSpeed ?? '--'}</span>
              <span className="metric-card-unit">mph</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Smash Factor</span>
              <span className="metric-card-val">{currentSummary.avgSmashFactor ?? '--'}</span>
              <span className="metric-card-unit">ratio</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Avg Spin</span>
              <span className="metric-card-val">{currentSummary.avgSpinRate ? `${currentSummary.avgSpinRate}` : '--'}</span>
              <span className="metric-card-unit">rpm</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Launch Angle</span>
              <span className="metric-card-val">{currentSummary.avgLaunchAngle ?? '--'}°</span>
              <span className="metric-card-unit">degrees</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Avg Apex</span>
              <span className="metric-card-val">{currentSummary.avgApex ?? '--'}</span>
              <span className="metric-card-unit">yards</span>
            </div>
          </div>
        ) : (
          <div className="club-metrics-grid" style={{ marginTop: '0.75rem' }}>
            <div className="metric-card">
              <span className="metric-card-label">Clubs Tracked</span>
              <span className="metric-card-val">{clubSummaries.length}</span>
              <span className="metric-card-unit">different clubs</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Most Used Club</span>
              <span className="metric-card-val" style={{ fontSize: '1rem' }}>
                {clubSummaries[0]?.clubName || '--'}
              </span>
              <span className="metric-card-unit">{clubSummaries[0]?.shotCount || 0} shots</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Longest Carry (Avg)</span>
              <span className="metric-card-val">
                {Math.max(...clubSummaries.map((c) => c.avgCarryDistance || 0)).toFixed(1)}
              </span>
              <span className="metric-card-unit">yards</span>
            </div>

            <div className="metric-card">
              <span className="metric-card-label">Top Ball Speed</span>
              <span className="metric-card-val">
                {Math.max(...clubSummaries.map((c) => c.avgBallSpeed || 0)).toFixed(1)}
              </span>
              <span className="metric-card-unit">mph</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
