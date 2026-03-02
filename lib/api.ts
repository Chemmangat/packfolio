/**
 * npm API Integration
 * 
 * Functions to fetch package data from npm registry and downloads API.
 * All functions are documented and handle errors gracefully.
 * Implements rate limiting to respect npm API limits.
 */

import type { PackageStats, DailyDownload } from '@/types';
import { config } from './config';
import { getDateDaysAgo, getToday, isPackageName, cleanUsername, sum, average } from './utils';
import { createNpmDownloadsRateLimiter, createNpmSearchRateLimiter } from './rateLimiter';

// Create rate limiters (singleton instances)
const downloadsRateLimiter = createNpmDownloadsRateLimiter();
const searchRateLimiter = createNpmSearchRateLimiter();

/**
 * Fetch all packages for a given username or a specific package
 * 
 * Supports multiple search strategies:
 * 1. Direct package lookup (if input contains /)
 * 2. Maintainer search
 * 3. Author search
 * 4. General search
 * 
 * @param username - npm username or package name
 * @returns Array of package objects with name, version, and description
 */
export async function fetchUserPackages(username: string) {
  const cleanName = cleanUsername(username);
  
  // Strategy 1: Direct package lookup
  if (isPackageName(cleanName)) {
    const directPackage = await fetchDirectPackage(cleanName);
    if (directPackage) return [directPackage];
  }
  
  // Strategy 2-4: Search by maintainer, author, or general
  const searchQueries = [
    `maintainer:${cleanName}`,
    `author:${cleanName}`,
    cleanName
  ];
  
  for (const query of searchQueries) {
    try {
      const packages = await searchPackages(query, cleanName);
      if (packages.length > 0) {
        return packages;
      }
    } catch (error) {
      continue;
    }
  }
  
  return [];
}

/**
 * Fetch a specific package directly by name
 * @param packageName - Full package name (e.g., @scope/package)
 * @returns Package object or null if not found
 */
async function fetchDirectPackage(packageName: string) {
  try {
    const pkgName = packageName.startsWith('@') ? packageName : `@${packageName}`;
    const url = `${config.api.registryPackage}/${encodeURIComponent(pkgName)}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      name: data.name,
      version: data['dist-tags']?.latest || Object.keys(data.versions || {}).pop() || '0.0.0',
      description: data.description || 'No description available',
    };
  } catch (error) {
    console.error('Direct package lookup failed:', error);
    return null;
  }
}

/**
 * Search for packages using npm registry search API
 * @param query - Search query
 * @param username - Original username for filtering
 * @returns Array of package objects
 */
async function searchPackages(query: string, username: string) {
  // Wait for rate limiter slot
  await searchRateLimiter.waitForSlot();
  
  const url = `${config.api.registrySearch}?text=${encodeURIComponent(query)}&size=${config.api.maxPackages}`;
  const response = await fetch(url);
  
  if (!response.ok) return [];
  
  const data = await response.json();
  
  if (!data.objects || data.objects.length === 0) return [];
  
  // Filter packages based on query type
  const packages = data.objects
    .filter((obj: any) => {
      if (query.includes('maintainer:') || query.includes('author:')) {
        // Strict filtering for maintainer/author queries
        const maintainers = obj.package.maintainers || [];
        return maintainers.some((m: any) => 
          m.username?.toLowerCase() === username.toLowerCase()
        );
      }
      // Lenient filtering for general search
      const maintainers = obj.package.maintainers || [];
      const hasMaintainer = maintainers.some((m: any) => 
        m.username?.toLowerCase().includes(username.toLowerCase())
      );
      const inPackageName = obj.package.name?.toLowerCase().includes(username.toLowerCase());
      return hasMaintainer || inPackageName;
    })
    .map((obj: any) => ({
      name: obj.package.name,
      version: obj.package.version,
      description: obj.package.description || 'No description available',
    }));
  
  return packages;
}

/**
 * Fetch download statistics for a package
 * 
 * Optimized to use only ONE API call per package.
 * Fetches 365 days of data and calculates all stats from that.
 * 
 * @param packageName - Full package name
 * @returns Package statistics object
 * @throws Error if rate limited (429)
 */
export async function fetchPackageStats(packageName: string): Promise<PackageStats> {
  try {
    // Fetch 365 days of download history (ONE API CALL)
    const downloads = await fetchDownloadRange(packageName, 365);
    
    if (downloads.length === 0) {
      return { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] };
    }
    
    // Calculate all stats from the downloaded data
    const downloadCounts = downloads.map(d => d.downloads);
    
    // Daily average (last 7 days)
    const last7Downloads = downloads.slice(-7);
    const daily = average(last7Downloads.map(d => d.downloads));

    // Weekly downloads (last 7 days)
    const weekly = sum(last7Downloads.map(d => d.downloads));

    // Monthly downloads (last 30 days)
    const last30Downloads = downloads.slice(-30);
    const monthly = sum(last30Downloads.map(d => d.downloads));

    // All-time downloads (sum of all available data)
    const allTime = sum(downloadCounts);

    return { daily, weekly, monthly, allTime, downloads };
  } catch (error: any) {
    // Re-throw rate limit errors
    if (error.message?.includes('429')) {
      throw error;
    }
    return { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] };
  }
}

/**
 * Fetch download data for a date range
 * @param packageName - Package name
 * @param days - Number of days to fetch
 * @returns Array of daily download objects
 * @throws Error if rate limited (429)
 */
async function fetchDownloadRange(packageName: string, days: number): Promise<DailyDownload[]> {
  // Wait for rate limiter slot
  await downloadsRateLimiter.waitForSlot();
  
  const startDate = getDateDaysAgo(days);
  const endDate = getToday();
  const url = `${config.api.downloadsApi}/range/${startDate}:${endDate}/${packageName}`;
  
  try {
    const response = await fetch(url);
    
    // Handle rate limiting
    if (response.status === 429) {
      // Reset rate limiter on 429
      downloadsRateLimiter.reset();
      throw new Error('Rate limit exceeded (429)');
    }
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.downloads || [];
  } catch (error: any) {
    // Re-throw rate limit errors
    if (error.message?.includes('429')) {
      throw error;
    }
    return [];
  }
}
