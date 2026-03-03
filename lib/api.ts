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
 * Extract GitHub repository URL from npm repository field
 * @param repository - Repository field from npm package data
 * @returns GitHub repository URL or undefined
 */
function extractRepositoryUrl(repository: any): string | undefined {
  if (!repository) return undefined;
  
  let url = typeof repository === 'string' ? repository : repository.url;
  if (!url) return undefined;
  
  // Clean up git+https:// and .git suffix
  url = url.replace(/^git\+/, '').replace(/\.git$/, '');
  
  // Only return if it's a GitHub URL
  if (url.includes('github.com')) {
    return url;
  }
  
  return undefined;
}

/**
 * Fetch GitHub stars for a repository using GitHub's public badge API
 * This doesn't require authentication and has higher rate limits
 * @param repositoryUrl - GitHub repository URL
 * @returns Number of stars or undefined
 */
async function fetchGitHubStars(repositoryUrl: string): Promise<number | undefined> {
  try {
    // Extract owner and repo from URL
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
    if (!match) {
      console.log(`[GitHub Stars] Could not parse GitHub URL: ${repositoryUrl}`);
      return undefined;
    }
    
    const [, owner, repo] = match;
    // Clean repo name - remove any trailing .git or other extensions
    const cleanRepo = repo.replace(/\.git$/, '');
    
    // Try using shields.io API which aggregates GitHub data without auth
    const shieldsUrl = `https://img.shields.io/github/stars/${owner}/${cleanRepo}?style=social`;
    
    console.log(`[GitHub Stars] Fetching from shields.io for: ${owner}/${cleanRepo}`);
    
    try {
      // Fetch the SVG badge
      const response = await fetch(shieldsUrl);
      if (response.ok) {
        const svgText = await response.text();
        // Extract star count from SVG text
        // The SVG contains text like ">1.2k<" or ">123<"
        const match = svgText.match(/>([0-9.]+[kKmM]?)</);
        if (match) {
          let stars = match[1];
          // Convert k/m notation to numbers
          if (stars.toLowerCase().includes('k')) {
            stars = String(parseFloat(stars) * 1000);
          } else if (stars.toLowerCase().includes('m')) {
            stars = String(parseFloat(stars) * 1000000);
          }
          const starCount = Math.round(parseFloat(stars));
          console.log(`[GitHub Stars] ${owner}/${cleanRepo} has ${starCount} stars (from shields.io)`);
          return starCount;
        }
      }
    } catch (shieldsError) {
      console.log(`[GitHub Stars] Shields.io failed, trying alternative method`);
    }
    
    // Fallback: Try using api.github.com without auth (will hit rate limit but worth trying)
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}`;
    console.log(`[GitHub Stars] Trying GitHub API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'packfolio-app',
      },
    });
    
    if (!response.ok) {
      console.log(`[GitHub Stars] GitHub API returned status ${response.status} (likely rate limited)`);
      return undefined;
    }
    
    const data = await response.json();
    console.log(`[GitHub Stars] ${owner}/${cleanRepo} has ${data.stargazers_count} stars (from GitHub API)`);
    return data.stargazers_count;
  } catch (error) {
    console.error('[GitHub Stars] Failed to fetch GitHub stars:', error);
    return undefined;
  }
}

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
    const repositoryUrl = extractRepositoryUrl(data.repository);
    
    return {
      name: data.name,
      version: data['dist-tags']?.latest || Object.keys(data.versions || {}).pop() || '0.0.0',
      description: data.description || 'No description available',
      repositoryUrl,
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
    .map((obj: any) => {
      const repositoryUrl = extractRepositoryUrl(obj.package.links?.repository);
      return {
        name: obj.package.name,
        version: obj.package.version,
        description: obj.package.description || 'No description available',
        repositoryUrl,
      };
    });
  
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

/**
 * Fetch GitHub stars for a package
 * @param packageName - Package name
 * @param repositoryUrl - Optional repository URL (if already known)
 * @returns Number of GitHub stars or undefined
 */
export async function fetchGitHubStarsForPackage(packageName: string, repositoryUrl?: string): Promise<number | undefined> {
  try {
    let repoUrl = repositoryUrl;
    
    // If no repository URL provided, fetch it from npm registry
    if (!repoUrl) {
      const url = `${config.api.registryPackage}/${encodeURIComponent(packageName)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`[GitHub Stars] Failed to fetch package info for ${packageName}`);
        return undefined;
      }
      
      const data = await response.json();
      repoUrl = extractRepositoryUrl(data.repository);
      console.log(`[GitHub Stars] Extracted repo URL for ${packageName}:`, repoUrl);
    }
    
    if (!repoUrl) {
      console.log(`[GitHub Stars] No repository URL found for ${packageName}`);
      return undefined;
    }
    
    const stars = await fetchGitHubStars(repoUrl);
    console.log(`[GitHub Stars] ${packageName} has ${stars} stars`);
    return stars;
  } catch (error) {
    console.error('Failed to fetch GitHub stars for package:', error);
    return undefined;
  }
}
