import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

interface AnalyticsData {
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalExtractions: number;
  totalSwingSyncDownloads: number;
  totalTrackmanDownloads: number;
  totalRawDownloads: number;
  visitorHashes: Record<string, string>; // hash -> firstSeen
  events: Array<{
    type: 'pageview' | 'extract' | 'download_swingsync' | 'download_trackman' | 'download_raw' | 'download_json';
    timestamp: string;
    userAgent?: string;
    country?: string;
  }>;
}

const STATS_FILE = path.resolve(process.cwd(), 'data', 'stats.json');

function ensureDataDir(): void {
  const dir = path.dirname(STATS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadStats(): AnalyticsData {
  ensureDataDir();
  if (fs.existsSync(STATS_FILE)) {
    try {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      // Fallback to default if corrupt
    }
  }
  return {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    totalExtractions: 0,
    totalSwingSyncDownloads: 0,
    totalTrackmanDownloads: 0,
    totalRawDownloads: 0,
    visitorHashes: {},
    events: [],
  };
}

let stats: AnalyticsData = loadStats();

function saveStats(): void {
  try {
    ensureDataDir();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save stats to disk:', err);
  }
}

function hashIp(ip: string | undefined): string {
  const salt = 'fullswing_stats_salt_2026';
  return crypto.createHash('sha256').update((ip || 'unknown') + salt).digest('hex').substring(0, 16);
}

export function recordPageView(ip?: string, userAgent?: string, country?: string): void {
  stats.totalPageViews += 1;
  const visitorHash = hashIp(ip);
  if (!stats.visitorHashes[visitorHash]) {
    stats.visitorHashes[visitorHash] = new Date().toISOString();
    stats.totalUniqueVisitors = Object.keys(stats.visitorHashes).length;
  }

  // Keep last 200 events
  stats.events.unshift({
    type: 'pageview',
    timestamp: new Date().toISOString(),
    userAgent: userAgent ? userAgent.substring(0, 120) : undefined,
    country,
  });
  if (stats.events.length > 200) {
    stats.events = stats.events.slice(0, 200);
  }

  saveStats();
}

export function recordEvent(
  type: 'extract' | 'download_swingsync' | 'download_trackman' | 'download_raw' | 'download_json',
  userAgent?: string
): void {
  if (type === 'extract') stats.totalExtractions += 1;
  if (type === 'download_swingsync') stats.totalSwingSyncDownloads += 1;
  if (type === 'download_trackman') stats.totalTrackmanDownloads = (stats.totalTrackmanDownloads || 0) + 1;
  if (type === 'download_raw' || type === 'download_json') stats.totalRawDownloads += 1;

  stats.events.unshift({
    type,
    timestamp: new Date().toISOString(),
    userAgent: userAgent ? userAgent.substring(0, 120) : undefined,
  });
  if (stats.events.length > 200) {
    stats.events = stats.events.slice(0, 200);
  }

  saveStats();
}

export function getStatsSummary() {
  return {
    totalPageViews: stats.totalPageViews,
    totalUniqueVisitors: stats.totalUniqueVisitors,
    totalExtractions: stats.totalExtractions,
    totalSwingSyncDownloads: stats.totalSwingSyncDownloads,
    totalTrackmanDownloads: stats.totalTrackmanDownloads || 0,
    totalRawDownloads: stats.totalRawDownloads,
    recentEvents: stats.events.slice(0, 30),
  };
}
