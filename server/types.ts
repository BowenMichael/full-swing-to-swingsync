export interface ShotNormalizedValues {
  carryDistance?: number | null;
  totalDistance?: number | null;
  side?: number | null;
  sideTotal?: number | null;
  apex?: number | null;
  distanceToPin?: number | null;
}

export interface FullSwingShot {
  pointId?: string | null;
  lmDrillTargetId?: string | null;
  clubId?: string | null;
  clubColor?: string | null;
  clubCategory?: string | null;
  clubName?: string | null;
  clubType?: string | null;
  timestamp?: number | null;
  isFavorite?: boolean | null;
  impactUrl?: string | null;
  videoUrl?: string | null;
  clubSpeed?: number | null;
  ballSpeed?: number | null;
  smashFactor?: number | null;
  attackAngle?: number | null;
  clubPath?: number | null;
  launchAngle?: number | null;
  horizontalLaunchAngle?: number | null;
  faceAngle?: number | null;
  spinRate?: number | null;
  spinAxis?: number | null;
  carryDistance?: number | null;
  totalDistance?: number | null;
  side?: number | null;
  sideTotal?: number | null;
  apex?: number | null;
  descentAngle?: number | null;
  dynamicLoft?: number | null;
  clubSpeedValid?: boolean | null;
  ballSpeedValid?: boolean | null;
  smashFactorValid?: boolean | null;
  attackAngleValid?: boolean | null;
  clubPathValid?: boolean | null;
  launchAngleValid?: boolean | null;
  horizontalLaunchAngleValid?: boolean | null;
  faceAngleValid?: boolean | null;
  spinRateValid?: boolean | null;
  spinAxisValid?: boolean | null;
  carryDistanceValid?: boolean | null;
  totalDistanceValid?: boolean | null;
  sideValid?: boolean | null;
  sideTotalValid?: boolean | null;
  apexValid?: boolean | null;
  descentAngleValid?: boolean | null;
  dynamicLoftValid?: boolean | null;
  xFit?: number[] | null;
  yFit?: number[] | null;
  zFit?: number[] | null;
  normalizedValues?: ShotNormalizedValues | null;
  shotQuality?: number | null;
  targetDistance?: number | null;
  distanceToPin?: number | null;
}

export interface FullSwingSession {
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  duration?: number | null;
  name?: string | null;
  address?: string | null;
  elevation?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  location?: string | null;
  normalizedElevation?: number | null;
  normalizedTemperature?: number | null;
  normalizedBallType?: string | null;
  shots: FullSwingShot[];
}

export interface FullSwingShareData {
  shareUrl: string;
  lmSessionId?: string | null;
  shareVideo?: string | null;
  expiresAt?: string | null;
  session: FullSwingSession;
}

export interface ClubSummary {
  clubName: string;
  clubType: string;
  clubColor: string;
  shotCount: number;
  avgClubSpeed: number | null;
  avgBallSpeed: number | null;
  avgSmashFactor: number | null;
  avgCarryDistance: number | null;
  avgTotalDistance: number | null;
  avgSpinRate: number | null;
  avgLaunchAngle: number | null;
  avgClubPath: number | null;
  avgFaceAngle: number | null;
  avgApex: number | null;
}

export interface ParsedSessionResponse {
  shareUrl: string;
  lmSessionId: string | null;
  session: {
    startTimestamp: number | null;
    endTimestamp: number | null;
    duration: number | null;
    durationFormatted: string;
    formattedDate: string;
    location: string | null;
    totalShots: number;
  };
  clubSummaries: ClubSummary[];
  shots: (FullSwingShot & { shotNumber: number; faceToPath: number | null })[];
}
