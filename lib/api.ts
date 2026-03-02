/**
 * npm API Integration
 * 
 * Functions to fetch package data from npm registry and downloads API.
 * All functions are documented and handle errors gracefully.
 */

import type { PackageStats, DailyDownload } from '@/types';
import { config } from './config';
import { getDateDaysAgo, getToday, isPackageName, cleanUsername, sum, average } from './utils';

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
 * Fetches:
 * - Daily average (last 7 days)
 * - Weekly downloads
 * - Monthly downloads
 * - All-time downloads
 * - Daily download history (last 365 days for charts)
 * 
 * @param packageName - Full package name
 * @returns Package statistics object
 */
export async function fetchPackageStats(packageName: string): Promise<PackageStats> {
  const today = getToday();
  
  try {
    // Fetch download history for charts (last 365 days to support all time ranges)
    const downloads = await fetchDownloadRange(packageName, 365);
    
    // Calculate daily average from last 7 days
    const last7Downloads = downloads.slice(-7);
    const daily = average(last7Downloads.map(d => d.downloads));

    // Fetch weekly downloads
    const weekly = await fetchDownloadPoint(packageName, 'last-week');

    // Fetch monthly downloads
    const monthly = await fetchDownloadPoint(packageName, 'last-month');

    // Fetch all-time downloads
    const allTime = await fetchAllTimeDownloads(packageName);

    return { daily, weekly, monthly, allTime, downloads };
  } catch (error) {
    return { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] };
  }
}

/**
 * Fetch download data for a date range
 * @param packageName - Package name
 * @param days - Number of days to fetch
 * @returns Array of daily download objects
 */
async function fetchDownloadRange(packageName: string, days: number): Promise<DailyDownload[]> {
  const startDate = getDateDaysAgo(days);
  const endDate = getToday();
  const url = `${config.api.downloadsApi}/range/${startDate}:${endDate}/${packageName}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.downloads || [];
  } catch (error) {
    return [];
  }
}

/**
 * Fetch download count for a specific time point
 * @param packageName - Package name
 * @param point - Time point (e.g., 'last-week', 'last-month')
 * @returns Download count
 */
async function fetchDownloadPoint(packageName: string, point: string): Promise<number> {
  const url = `${config.api.downloadsApi}/point/${point}/${packageName}`;
  
  try {
    const response = await fetch(url);
    
    // Handle rate limiting
    if (response.status === 429) {
      return 0;
    }
    
    if (!response.ok) {
      return 0;
    }
    
    const data = await response.json();
    return data.downloads || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Fetch all-time download count
 * @param packageName - Package name
 * @returns Total download count since 2010
 */
async function fetchAllTimeDownloads(packageName: string): Promise<number> {
  const url = `${config.api.downloadsApi}/range/${config.api.allTimeStartDate}:${getToday()}/${packageName}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return 0;
    
    const data = await response.json();
    const downloads = data.downloads || [];
    return sum(downloads.map((d: DailyDownload) => d.downloads));
  } catch (error) {
    return 0;
  }
}
