/**
 * Application Configuration
 * 
 * Centralized configuration for the PackFolio dashboard.
 * Modify these values to customize behavior and appearance.
 */

export const config = {
  /**
   * Application metadata
   */
  app: {
    name: 'PackFolio',
    description: 'package analytics dashboard',
    version: '1.0.0',
  },

  /**
   * API Configuration
   */
  api: {
    // npm registry search endpoint
    registrySearch: 'https://registry.npmjs.org/-/v1/search',
    // npm registry package info endpoint
    registryPackage: 'https://registry.npmjs.org',
    // npm downloads API endpoint
    downloadsApi: 'https://api.npmjs.org/downloads',
    // Maximum number of packages to fetch
    maxPackages: 250,
    // Start date for all-time downloads (npm was created in 2010)
    allTimeStartDate: '2010-01-01',
  },

  /**
   * UI Configuration
   */
  ui: {
    // Default time range for charts (in days)
    defaultTimeRange: '30' as const,
    // Available time ranges
    timeRanges: [
      { label: '7D', value: '7', days: 7 },
      { label: '30D', value: '30', days: 30 },
      { label: '90D', value: '90', days: 90 },
      { label: '1Y', value: '365', days: 365 },
    ],
    // Maximum number of packages to show in comparison chart
    maxComparisonPackages: 8,
    // Number formatting thresholds
    numberFormat: {
      million: 1000000,
      thousand: 1000,
    },
  },

  /**
   * Search Configuration
   */
  search: {
    // Search strategies to try (in order)
    strategies: ['maintainer', 'author', 'general'] as const,
    // Placeholder text for search input
    placeholder: 'username | @scope/package',
  },

  /**
   * Feature Flags
   * Enable/disable features easily
   */
  features: {
    // Show comparison chart
    enableComparison: true,
    // Show distribution chart
    enableDistribution: true,
    // Show trend chart
    enableTrend: true,
    // Enable theme toggle
    enableThemeToggle: true,
    // Show package descriptions
    showDescriptions: true,
    // Show version numbers
    showVersions: true,
  },
} as const;

export type Config = typeof config;
