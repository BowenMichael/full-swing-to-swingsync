export interface FullSwingShot {
  shotNumber: number;
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
  faceToPath?: number | null;
  spinRate?: number | null;
  spinAxis?: number | null;
  carryDistance?: number | null;
  totalDistance?: number | null;
  side?: number | null;
  sideTotal?: number | null;
  apex?: number | null;
  descentAngle?: number | null;
  dynamicLoft?: number | null;
  shotQuality?: number | null;
  targetDistance?: number | null;
  distanceToPin?: number | null;
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

export interface ParsedSessionData {
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
  shots: FullSwingShot[];
}
