const STORAGE_KEY = 'locintel_score_history';

export interface ScoreEntry {
  locationName: string;
  lat: number;
  lng: number;
  score: number;
  timestamp: string; // ISO string
  businessType?: string;
  topPlacesCount: number;
}

export function saveScoreEntry(entry: ScoreEntry): void {
  try {
    const existing = getScoreHistory();
    existing.push(entry);
    // Keep last 100 entries to avoid bloating localStorage
    const trimmed = existing.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function getScoreHistory(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScoreEntry[];
  } catch {
    return [];
  }
}

export function getHistoryForLocation(locationName: string): ScoreEntry[] {
  return getScoreHistory().filter(
    (e) => e.locationName.toLowerCase() === locationName.toLowerCase()
  );
}

export function getScoreTrend(entries: ScoreEntry[]): { change: number; direction: 'up' | 'down' | 'stable'; message: string } {
  if (entries.length < 2) return { change: 0, direction: 'stable', message: 'First analysis for this location' };

  const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  const change = newest.score - oldest.score;
  const daysDiff = Math.round((new Date(newest.timestamp).getTime() - new Date(oldest.timestamp).getTime()) / (1000 * 60 * 60 * 24));

  if (change > 0) {
    return { change, direction: 'up', message: `Score improved ${change} points in ${daysDiff} days` };
  } else if (change < 0) {
    return { change: Math.abs(change), direction: 'down', message: `Score dropped ${Math.abs(change)} points in ${daysDiff} days` };
  }
  return { change: 0, direction: 'stable', message: `Score unchanged over ${daysDiff} days` };
}
