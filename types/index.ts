export interface PackageData {
  name: string;
  version: string;
  description: string;
  stats: PackageStats;
  githubStars?: number;
  repositoryUrl?: string;
}

export interface PackageStats {
  daily: number;
  weekly: number;
  monthly: number;
  allTime: number;
  downloads: DailyDownload[];
}

export interface DailyDownload {
  day: string;
  downloads: number;
}

export type TimeRange = '7' | '30' | '90' | '365';
