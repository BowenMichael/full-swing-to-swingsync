import React, { useState, useMemo } from 'react';
import { FullSwingShot } from '../types.js';
import { ArrowUpDown, Search, ListFilter } from 'lucide-react';

interface ShotTableProps {
  shots: FullSwingShot[];
  selectedClub: string | null;
}

type SortField =
  | 'shotNumber'
  | 'clubName'
  | 'carryDistance'
  | 'totalDistance'
  | 'ballSpeed'
  | 'clubSpeed'
  | 'smashFactor'
  | 'launchAngle'
  | 'spinRate'
  | 'clubPath'
  | 'faceToPath'
  | 'apex';

export const ShotTable: React.FC<ShotTableProps> = ({ shots, selectedClub }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('shotNumber');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredShots = useMemo(() => {
    return shots.filter((shot) => {
      // Filter by selected club pill
      if (selectedClub && shot.clubName !== selectedClub) {
        return false;
      }
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const club = (shot.clubName || '').toLowerCase();
        const shotNum = String(shot.shotNumber);
        return club.includes(term) || shotNum.includes(term);
      }
      return true;
    });
  }, [shots, selectedClub, searchTerm]);

  const sortedShots = useMemo(() => {
    return [...filteredShots].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === null || valA === undefined) return sortAsc ? 1 : -1;
      if (valB === null || valB === undefined) return sortAsc ? -1 : 1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [filteredShots, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for metrics (highest first)
    }
  };

  const getClubBadgeClass = (category?: string | null, clubName?: string | null) => {
    const name = (clubName || '').toLowerCase();
    const cat = (category || '').toLowerCase();
    if (name.includes('driver') || cat.includes('wood')) return 'badge-driver';
    if (name.includes('wedge') || cat.includes('wedge')) return 'badge-wedge';
    return 'badge-iron';
  };

  return (
    <div className="table-card">
      <div className="table-header-controls">
        <div className="table-title-area">
          <ListFilter size={18} color="var(--emerald-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
            Shot Telemetry Table
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({sortedShots.length} {sortedShots.length === 1 ? 'shot' : 'shots'} shown)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="input-group" style={{ padding: '0.2rem 0.5rem' }}>
            <Search size={14} className="input-icon" />
            <input
              type="text"
              className="url-input"
              style={{ fontSize: '0.8rem', padding: '0.3rem' }}
              placeholder="Search club or #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="shots-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('shotNumber')}>
                Shot # <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('clubName')}>
                Club <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('carryDistance')}>
                Carry (yds) <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('totalDistance')}>
                Total (yds) <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('ballSpeed')}>
                Ball Spd <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('clubSpeed')}>
                Club Spd <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('smashFactor')}>
                Smash <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('launchAngle')}>
                Launch Ang <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('spinRate')}>
                Spin (rpm) <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('clubPath')}>
                Path <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('faceToPath')}>
                Face-to-Path <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('apex')}>
                Apex (yds) <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedShots.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No shots match the selected filter.
                </td>
              </tr>
            ) : (
              sortedShots.map((shot) => (
                <tr key={shot.shotNumber}>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    #{shot.shotNumber}
                  </td>
                  <td>
                    <span className={`club-badge ${getClubBadgeClass(shot.clubCategory, shot.clubName)}`}>
                      {shot.clubName || 'Unknown'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {shot.carryDistance != null ? shot.carryDistance.toFixed(1) : '--'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {shot.totalDistance != null ? shot.totalDistance.toFixed(1) : '--'}
                  </td>
                  <td style={{ color: '#93c5fd' }}>
                    {shot.ballSpeed != null ? shot.ballSpeed.toFixed(1) : '--'}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {shot.clubSpeed != null ? shot.clubSpeed.toFixed(1) : '--'}
                  </td>
                  <td>
                    {shot.smashFactor != null ? (
                      <span
                        style={{
                          color:
                            shot.smashFactor >= 1.45
                              ? '#34d399'
                              : shot.smashFactor >= 1.3
                              ? '#fcd34d'
                              : 'var(--text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {shot.smashFactor.toFixed(2)}
                      </span>
                    ) : (
                      '--'
                    )}
                  </td>
                  <td>{shot.launchAngle != null ? `${shot.launchAngle.toFixed(1)}°` : '--'}</td>
                  <td>{shot.spinRate != null ? Math.round(shot.spinRate).toLocaleString() : '--'}</td>
                  <td
                    style={{
                      color:
                        shot.clubPath != null
                          ? shot.clubPath > 0
                            ? '#60a5fa' // in-to-out
                            : shot.clubPath < 0
                            ? '#f87171' // out-to-in
                            : 'var(--text-primary)'
                          : 'var(--text-muted)',
                    }}
                  >
                    {shot.clubPath != null
                      ? `${shot.clubPath > 0 ? '+' : ''}${shot.clubPath.toFixed(1)}°`
                      : '--'}
                  </td>
                  <td
                    style={{
                      fontWeight: 600,
                      color:
                        shot.faceToPath != null
                          ? shot.faceToPath > 0
                            ? '#60a5fa'
                            : shot.faceToPath < 0
                            ? '#f87171'
                            : 'var(--text-primary)'
                          : 'var(--text-muted)',
                    }}
                  >
                    {shot.faceToPath != null
                      ? `${shot.faceToPath > 0 ? '+' : ''}${shot.faceToPath.toFixed(1)}°`
                      : '--'}
                  </td>
                  <td>{shot.apex != null ? shot.apex.toFixed(1) : '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
