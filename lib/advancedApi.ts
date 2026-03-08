/**
 * Advanced API Functions
 * 
 * Functions for health scores, trending packages, dependencies, and timelines.
 * All functions respect npm API rate limits and are legally compliant.
 */

import type { HealthScore, DependencyInfo, TrendingPackage, PackageTimeline, TimelineEvent, DeveloperStats, PackageData } from '@/types';
import { getDaysSince, calculateGrowthRate, sum } from './utils';

/**
 * Calculate package health score based on multiple factors
 * @param pkg - Package data with stats
 * @returns Health score object
 */
export function calculateHealthScore(pkg: PackageData): HealthScore {
  const { stats, lastPublish, githubStars } = pkg;
  
  // Factor 1: Download Velocity (0-25 points)
  // Compare last 7 days vs previous 7 days
  const last7 = stats.downloads.slice(-7);
  const prev7 = stats.downloads.slice(-14, -7);
  const last7Sum = sum(last7.map(d => d.downloads));
  const prev7Sum = sum(prev7.map(d => d.downloads));
  const growthRate = prev7Sum > 0 ? ((last7Sum - prev7Sum) / prev7Sum) * 100 : 0;
  
  let downloadVelocity = 12.5; // neutral
  if (growthRate > 20) downloadVelocity = 25;
  else if (growthRate > 10) downloadVelocity = 20;
  else if (growthRate > 0) downloadVelocity = 15;
  else if (growthRate > -10) downloadVelocity = 10;
  else downloadVelocity = 5;
  
  // Factor 2: Freshness (0-25 points)
  // Based on last publish date
  let freshness = 12.5;
  if (lastPublish) {
    const daysSince = getDaysSince(lastPublish);
    if (daysSince < 30) freshness = 25;
    else if (daysSince < 90) freshness = 20;
    else if (daysSince < 180) freshness = 15;
    else if (daysSince < 365) freshness = 10;
    else freshness = 5;
  }
  
  // Factor 3: Popularity (0-25 points)
  // Based on total downloads
  let popularity = 5;
  if (stats.allTime > 10000000) popularity = 25;
  else if (stats.allTime > 1000000) popularity = 20;
  else if (stats.allTime > 100000) popularity = 15;
  else if (stats.allTime > 10000) popularity = 10;
  
  // Factor 4: Maintenance (0-25 points)
  // Based on GitHub stars and activity
  let maintenance = 12.5;
  if (githubStars) {
    if (githubStars > 10000) maintenance = 25;
    else if (githubStars > 1000) maintenance = 20;
    else if (githubStars > 100) maintenance = 15;
    else if (githubStars > 10) maintenance = 10;
    else maintenance = 5;
  }
  
  const score = Math.round(downloadVelocity + freshness + popularity + maintenance);
  
  // Determine trend
  let trend: HealthScore['trend'] = 'stable';
  let badge = '💎';
  
  if (growthRate > 20) {
    trend = 'growing';
    badge = '🔥';
  } else if (growthRate > 5) {
    trend = 'growing';
    badge = '📈';
  } else if (growthRate < -20) {
    trend = 'declining';
    badge = '📉';
  } else if (lastPublish && getDaysSince(lastPublish) > 365) {
    trend = 'stale';
    badge = '⚠️';
  } else {
    trend = 'stable';
    badge = '💎';
  }
  
  return {
    score,
    trend,
    badge,
    factors: {
      downloadVelocity: Math.round(downloadVelocity),
      freshness: Math.round(freshness),
      popularity: Math.round(popularity),
      maintenance: Math.round(maintenance),
    },
  };
}

/**
 * Fetch package dependencies from npm registry
 * @param packageName - Package name
 * @returns Dependency information
 */
export async function fetchDependencies(packageName: string): Promise<DependencyInfo | undefined> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`);
    if (!response.ok) return undefined;
    
    const data = await response.json();
    const latestVersion = data['dist-tags']?.latest;
    
    if (!latestVersion || !data.versions?.[latestVersion]) {
      return undefined;
    }
    
    const versionData = data.versions[latestVersion];
    const dependencies = Object.keys(versionData.dependencies || {});
    
    // Note: Getting accurate dependent count requires additional API calls
    // For now, we'll use a placeholder or skip this feature to respect rate limits
    
    return {
      dependencies,
      dependents: 0, // Would require additional API calls
      dependentsRecent: [],
    };
  } catch (error) {
    console.error('Failed to fetch dependencies:', error);
    return undefined;
  }
}

/**
 * Generate package timeline from available data
 * @param pkg - Package data
 * @returns Package timeline
 */
export function generateTimeline(pkg: PackageData): PackageTimeline {
  const events: TimelineEvent[] = [];
  
  // Add download milestones
  const milestones = [1000000, 5000000, 10000000, 50000000, 100000000];
  milestones.forEach(milestone => {
    if (pkg.stats.allTime >= milestone) {
      events.push({
        date: '', // We don't have exact dates for milestones
        type: 'milestone',
        title: `${(milestone / 1000000).toFixed(0)}M Downloads`,
        description: `Reached ${(milestone / 1000000).toFixed(0)} million total downloads`,
        downloads: milestone,
      });
    }
  });
  
  // Add GitHub star milestones
  if (pkg.githubStars) {
    const starMilestones = [100, 1000, 5000, 10000, 50000];
    starMilestones.forEach(milestone => {
      if (pkg.githubStars! >= milestone) {
        events.push({
          date: '',
          type: 'star-milestone',
          title: `${milestone >= 1000 ? (milestone / 1000).toFixed(0) + 'K' : milestone} Stars`,
          description: `Reached ${milestone.toLocaleString()} GitHub stars`,
          stars: milestone,
        });
      }
    });
  }
  
  // Add current version as latest release
  if (pkg.version) {
    events.push({
      date: pkg.lastPublish || '',
      type: 'release',
      title: `v${pkg.version}`,
      description: `Latest version released`,
      version: pkg.version,
    });
  }
  
  return { events };
}

/**
 * Calculate developer statistics from packages
 * @param packages - Array of package data
 * @param username - Developer username
 * @returns Developer statistics
 */
export function calculateDeveloperStats(packages: PackageData[], username: string): DeveloperStats {
  const totalDownloads = sum(packages.map(p => p.stats.allTime));
  const totalPackages = packages.length;
  const totalStars = sum(packages.map(p => p.githubStars || 0));
  
  // Impact score: weighted combination of downloads and stars
  const impactScore = Math.round(
    (totalDownloads / 1000000) * 0.7 + // Downloads in millions (70% weight)
    (totalStars / 100) * 0.3 // Stars in hundreds (30% weight)
  );
  
  // Find top package by downloads
  const topPackage = packages.reduce((top, pkg) => 
    pkg.stats.allTime > top.stats.allTime ? pkg : top
  , packages[0]);
  
  return {
    username,
    totalDownloads,
    totalPackages,
    totalStars,
    impactScore,
    topPackage: topPackage.name,
  };
}

/**
 * Identify trending packages from a list
 * @param packages - Array of package data
 * @returns Array of trending packages
 */
export function identifyTrendingPackages(packages: PackageData[]): TrendingPackage[] {
  const trending: TrendingPackage[] = [];
  
  packages.forEach(pkg => {
    const last7 = pkg.stats.downloads.slice(-7);
    const prev7 = pkg.stats.downloads.slice(-14, -7);
    
    if (last7.length < 7 || prev7.length < 7) return;
    
    const last7Sum = sum(last7.map(d => d.downloads));
    const prev7Sum = sum(prev7.map(d => d.downloads));
    const growthRate = prev7Sum > 0 ? ((last7Sum - prev7Sum) / prev7Sum) * 100 : 0;
    
    let category: TrendingPackage['category'] | null = null;
    
    // Hot: High downloads + growing
    if (pkg.stats.weekly > 100000 && growthRate > 20) {
      category = 'hot';
    }
    // Rising: Medium downloads + high growth
    else if (pkg.stats.weekly > 10000 && growthRate > 50) {
      category = 'rising';
    }
    // Dark horse: Low downloads + very high growth
    else if (pkg.stats.weekly < 10000 && growthRate > 100) {
      category = 'dark-horse';
    }
    
    if (category) {
      trending.push({
        name: pkg.name,
        description: pkg.description,
        dailyGrowth: Math.round(growthRate),
        weeklyDownloads: pkg.stats.weekly,
        category,
      });
    }
  });
  
  return trending;
}
