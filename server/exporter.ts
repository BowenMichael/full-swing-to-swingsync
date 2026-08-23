import { FullSwingShareData, FullSwingShot, ParsedSessionResponse, ClubSummary } from './types.js';

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) return 'Unknown Date';
  // Full Swing timestamps are in seconds
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function round(val: number | null | undefined, decimals = 1): number | null {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Number(val.toFixed(decimals));
}

function computeAverage(numbers: (number | null | undefined)[]): number | null {
  const valid = numbers.filter((n): n is number => n !== null && n !== undefined && !isNaN(n));
  if (valid.length === 0) return null;
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return round(sum / valid.length, 1);
}

export function parseSessionData(raw: FullSwingShareData): ParsedSessionResponse {
  const rawSession = raw.session;
  const rawShots = rawSession.shots || [];

  // Sort shots chronologically
  const sortedShots = [...rawShots].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  const enrichedShots = sortedShots.map((shot, index) => {
    const faceAngle = shot.faceAngle;
    const clubPath = shot.clubPath;
    let faceToPath: number | null = null;
    if (faceAngle !== null && faceAngle !== undefined && clubPath !== null && clubPath !== undefined) {
      faceToPath = round(faceAngle - clubPath, 1);
    }

    return {
      ...shot,
      shotNumber: index + 1,
      faceToPath,
    };
  });

  // Calculate Club Summaries
  const clubGroups = new Map<string, typeof enrichedShots>();
  for (const shot of enrichedShots) {
    const club = shot.clubName || shot.clubType || 'Unknown Club';
    if (!clubGroups.has(club)) {
      clubGroups.set(club, []);
    }
    clubGroups.get(club)!.push(shot);
  }

  const clubSummaries: ClubSummary[] = [];
  for (const [clubName, shots] of clubGroups.entries()) {
    const first = shots[0];
    clubSummaries.push({
      clubName,
      clubType: first.clubType || clubName,
      clubColor: first.clubColor || '10b981',
      shotCount: shots.length,
      avgClubSpeed: computeAverage(shots.map((s) => s.clubSpeed)),
      avgBallSpeed: computeAverage(shots.map((s) => s.ballSpeed)),
      avgSmashFactor: computeAverage(shots.map((s) => s.smashFactor)),
      avgCarryDistance: computeAverage(shots.map((s) => s.carryDistance)),
      avgTotalDistance: computeAverage(shots.map((s) => s.totalDistance)),
      avgSpinRate: round(computeAverage(shots.map((s) => s.spinRate)), 0),
      avgLaunchAngle: computeAverage(shots.map((s) => s.launchAngle)),
      avgClubPath: computeAverage(shots.map((s) => s.clubPath)),
      avgFaceAngle: computeAverage(shots.map((s) => s.faceAngle)),
      avgApex: computeAverage(shots.map((s) => s.apex)),
    });
  }

  // Sort clubs with highest shot count first or by standard order
  clubSummaries.sort((a, b) => b.shotCount - a.shotCount);

  return {
    shareUrl: raw.shareUrl,
    lmSessionId: raw.lmSessionId || null,
    session: {
      startTimestamp: rawSession.startTimestamp || null,
      endTimestamp: rawSession.endTimestamp || null,
      duration: rawSession.duration || null,
      durationFormatted: formatDuration(rawSession.duration),
      formattedDate: formatDate(rawSession.startTimestamp),
      location: rawSession.location || 'Simulator',
      totalShots: enrichedShots.length,
    },
    clubSummaries,
    shots: enrichedShots,
  };
}

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateSwingSyncCsv(parsed: ParsedSessionResponse): string {
  const headers = [
    'Shot Number',
    'Date Time',
    'Club',
    'Club Type',
    'Club Speed (mph)',
    'Ball Speed (mph)',
    'Smash Factor',
    'Carry Distance (yds)',
    'Total Distance (yds)',
    'Launch Angle (deg)',
    'Launch Direction (deg)',
    'Spin Rate (rpm)',
    'Spin Axis (deg)',
    'Club Path (deg)',
    'Face Angle (deg)',
    'Face to Path (deg)',
    'Attack Angle (deg)',
    'Apex Height (yds)',
    'Descent Angle (deg)',
    'Side Distance (yds)',
    'Side Total (yds)',
  ];

  const rows: string[][] = [headers];

  for (const shot of parsed.shots) {
    const dateTimeStr = shot.timestamp ? new Date(shot.timestamp * 1000).toISOString() : '';
    rows.push([
      String(shot.shotNumber),
      dateTimeStr,
      escapeCsvField(shot.clubName || 'Unknown'),
      escapeCsvField(shot.clubType || ''),
      shot.clubSpeed != null ? shot.clubSpeed.toFixed(1) : '',
      shot.ballSpeed != null ? shot.ballSpeed.toFixed(1) : '',
      shot.smashFactor != null ? shot.smashFactor.toFixed(2) : '',
      shot.carryDistance != null ? shot.carryDistance.toFixed(1) : '',
      shot.totalDistance != null ? shot.totalDistance.toFixed(1) : '',
      shot.launchAngle != null ? shot.launchAngle.toFixed(1) : '',
      shot.horizontalLaunchAngle != null ? shot.horizontalLaunchAngle.toFixed(1) : '',
      shot.spinRate != null ? Math.round(shot.spinRate).toString() : '',
      shot.spinAxis != null ? shot.spinAxis.toFixed(1) : '',
      shot.clubPath != null ? shot.clubPath.toFixed(1) : '',
      shot.faceAngle != null ? shot.faceAngle.toFixed(1) : '',
      shot.faceToPath != null ? shot.faceToPath.toFixed(1) : '',
      shot.attackAngle != null ? shot.attackAngle.toFixed(1) : '',
      shot.apex != null ? shot.apex.toFixed(1) : '',
      shot.descentAngle != null ? shot.descentAngle.toFixed(1) : '',
      shot.side != null ? shot.side.toFixed(1) : '',
      shot.sideTotal != null ? shot.sideTotal.toFixed(1) : '',
    ]);
  }

  return rows.map((r) => r.join(',')).join('\r\n');
}

export function generateTrackmanCsv(parsed: ParsedSessionResponse): string {
  const headers = [
    'Shot Number',
    'Date Time',
    'Club',
    'Club Speed',
    'Ball Speed',
    'Smash Factor',
    'Attack Angle',
    'Club Path',
    'Face Angle',
    'Face To Path',
    'Swing Direction',
    'Dynamic Loft',
    'Launch Angle',
    'Launch Direction',
    'Spin Rate',
    'Spin Axis',
    'Spin Loft',
    'Carry',
    'Total',
    'Side',
    'Side Total',
    'Carry Side',
    'Total Side',
    'Curve',
    'Height',
    'Max Height',
    'Landing Angle',
    'Hang Time',
    'Low Point Distance',
    'Impact Height',
    'Impact Offset',
    'Tempo',
  ];

  const rows: string[][] = [headers];

  for (const shot of parsed.shots) {
    const dateTimeStr = shot.timestamp ? new Date(shot.timestamp * 1000).toISOString() : '';
    const curveVal =
      shot.sideTotal != null && shot.side != null ? (shot.sideTotal - shot.side).toFixed(1) : '';

    rows.push([
      String(shot.shotNumber),
      dateTimeStr,
      escapeCsvField(shot.clubName || 'Unknown'),
      shot.clubSpeed != null ? shot.clubSpeed.toFixed(1) : '',
      shot.ballSpeed != null ? shot.ballSpeed.toFixed(1) : '',
      shot.smashFactor != null ? shot.smashFactor.toFixed(2) : '',
      shot.attackAngle != null ? shot.attackAngle.toFixed(1) : '',
      shot.clubPath != null ? shot.clubPath.toFixed(1) : '',
      shot.faceAngle != null ? shot.faceAngle.toFixed(1) : '',
      shot.faceToPath != null ? shot.faceToPath.toFixed(1) : '',
      shot.clubPath != null ? shot.clubPath.toFixed(1) : '', // Swing Direction
      shot.dynamicLoft != null ? shot.dynamicLoft.toFixed(1) : '',
      shot.launchAngle != null ? shot.launchAngle.toFixed(1) : '',
      shot.horizontalLaunchAngle != null ? shot.horizontalLaunchAngle.toFixed(1) : '',
      shot.spinRate != null ? Math.round(shot.spinRate).toString() : '',
      shot.spinAxis != null ? shot.spinAxis.toFixed(1) : '',
      shot.dynamicLoft != null && shot.attackAngle != null
        ? (shot.dynamicLoft - shot.attackAngle).toFixed(1)
        : '',
      shot.carryDistance != null ? shot.carryDistance.toFixed(1) : '',
      shot.totalDistance != null ? shot.totalDistance.toFixed(1) : '',
      shot.side != null ? shot.side.toFixed(1) : '',
      shot.sideTotal != null ? shot.sideTotal.toFixed(1) : '',
      shot.side != null ? shot.side.toFixed(1) : '', // Carry Side
      shot.sideTotal != null ? shot.sideTotal.toFixed(1) : '', // Total Side
      curveVal,
      shot.apex != null ? shot.apex.toFixed(1) : '', // Height
      shot.apex != null ? shot.apex.toFixed(1) : '', // Max Height
      shot.descentAngle != null ? shot.descentAngle.toFixed(1) : '',
      '', // Hang Time
      '', // Low Point Distance
      '', // Impact Height
      '', // Impact Offset
      '', // Tempo
    ]);
  }

  return rows.map((r) => r.join(',')).join('\r\n');
}

export function generateRawCsv(parsed: ParsedSessionResponse): string {
  const headers = [
    'Shot Number',
    'Timestamp',
    'Club ID',
    'Club Name',
    'Club Type',
    'Club Category',
    'Club Speed',
    'Ball Speed',
    'Smash Factor',
    'Attack Angle',
    'Club Path',
    'Launch Angle',
    'Horizontal Launch Angle',
    'Face Angle',
    'Spin Rate',
    'Spin Axis',
    'Carry Distance',
    'Total Distance',
    'Side',
    'Side Total',
    'Apex',
    'Descent Angle',
    'Dynamic Loft',
    'Target Distance',
    'Distance To Pin',
    'Club Speed Valid',
    'Ball Speed Valid',
    'Smash Factor Valid',
    'Spin Rate Valid',
  ];

  const rows: string[][] = [headers];

  for (const shot of parsed.shots) {
    rows.push([
      String(shot.shotNumber),
      String(shot.timestamp || ''),
      escapeCsvField(shot.clubId || ''),
      escapeCsvField(shot.clubName || ''),
      escapeCsvField(shot.clubType || ''),
      escapeCsvField(shot.clubCategory || ''),
      shot.clubSpeed?.toString() || '',
      shot.ballSpeed?.toString() || '',
      shot.smashFactor?.toString() || '',
      shot.attackAngle?.toString() || '',
      shot.clubPath?.toString() || '',
      shot.launchAngle?.toString() || '',
      shot.horizontalLaunchAngle?.toString() || '',
      shot.faceAngle?.toString() || '',
      shot.spinRate?.toString() || '',
      shot.spinAxis?.toString() || '',
      shot.carryDistance?.toString() || '',
      shot.totalDistance?.toString() || '',
      shot.side?.toString() || '',
      shot.sideTotal?.toString() || '',
      shot.apex?.toString() || '',
      shot.descentAngle?.toString() || '',
      shot.dynamicLoft?.toString() || '',
      shot.targetDistance?.toString() || '',
      shot.distanceToPin?.toString() || '',
      String(shot.clubSpeedValid ?? ''),
      String(shot.ballSpeedValid ?? ''),
      String(shot.smashFactorValid ?? ''),
      String(shot.spinRateValid ?? ''),
    ]);
  }

  return rows.map((r) => r.join(',')).join('\r\n');
}
