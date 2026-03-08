/**
 * Utility Functions
 * 
 * Reusable helper functions for data formatting and manipulation.
 */

import { config } from './config';

/**
 * Format large numbers with K/M suffixes
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.5M", "23.4K")
 */
export function formatCompactNumber(num: number): string {
  if (num >= config.ui.numberFormat.million) {
    return `${(num / config.ui.numberFormat.million).toFixed(1)}M`;
  }
  if (num >= config.ui.numberFormat.thousand) {
    return `${(num / config.ui.numberFormat.thousand).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format number with locale-specific thousands separators
 * @param num - Number to format
 * @returns Formatted string (e.g., "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "3/15")
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * Format date for tooltip
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "3/15/2024")
 */
export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Get date N days ago in ISO format
 * @param days - Number of days ago
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in ISO format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Extract package name from full package identifier
 * Handles both scoped (@scope/package) and unscoped (package) names
 * @param fullName - Full package name
 * @returns Short package name
 */
export function getShortPackageName(fullName: string): string {
  return fullName.split('/').pop() || fullName;
}

/**
 * Check if a string looks like a package name (contains /)
 * @param input - Input string
 * @returns True if it looks like a package name
 */
export function isPackageName(input: string): boolean {
  return input.includes('/');
}

/**
 * Clean username by removing @ prefix
 * @param username - Username with or without @
 * @returns Clean username
 */
export function cleanUsername(username: string): string {
  return username.replace('@', '').trim();
}

/**
 * Calculate percentage of total
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Sum array of numbers
 * @param numbers - Array of numbers
 * @returns Sum
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

/**
 * Calculate average of array of numbers
 * @param numbers - Array of numbers
 * @returns Average
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.round(sum(numbers) / numbers.length);
}

/**
 * Calculate growth rate between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Growth rate as percentage
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Get days since date
 * @param dateString - ISO date string
 * @returns Number of days since date
 */
export function getDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format relative time (e.g., "2 days ago", "3 months ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const days = getDaysSince(dateString);
  
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
