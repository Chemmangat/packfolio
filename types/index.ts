export interface PackageData {
  name: string;
  version: string;
  description: string;
  stats: PackageStats;
  githubStars?: number;
  repositoryUrl?: string;
  healthScore?: HealthScore;
  dependencies?: DependencyInfo;
  lastPublish?: string;
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

export interface HealthScore {
  score: number; // 0-100
  trend: 'growing' | 'stable' | 'declining' | 'stale';
  badge: string; // emoji badge
  factors: {
    downloadVelocity: number; // 0-25
    freshness: number; // 0-25
    popularity: number; // 0-25
    maintenance: number; // 0-25
  };
}

export interface DependencyInfo {
  dependencies: string[];
  dependents: number;
  dependentsRecent?: string[]; // Sample of recent dependents
}

export interface TrendingPackage {
  name: string;
  description: string;
  dailyGrowth: number;
  weeklyDownloads: number;
  category: 'hot' | 'rising' | 'dark-horse';
}

export interface DeveloperStats {
  username: string;
  totalDownloads: number;
  totalPackages: number;
  totalStars: number;
  impactScore: number;
  topPackage: string;
  rank?: number;
}

export interface PackageTimeline {
  events: TimelineEvent[];
}

export interface TimelineEvent {
  date: string;
  type: 'release' | 'milestone' | 'star-milestone';
  title: string;
  description: string;
  version?: string;
  downloads?: number;
  stars?: number;
}

export type TimeRange = '7' | '30' | '90' | '365';
