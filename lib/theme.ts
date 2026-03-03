/**
 * Theme Configuration
 * 
 * This file contains all theme-related constants and utilities.
 * Modify these values to customize the appearance of your dashboard.
 */

export const themes = {
  light: {
    // Background colors
    bg: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f5f5f5',
      elevated: '#ffffff',
      card: '#fafafa',
    },
    // Text colors
    text: {
      primary: '#0a0a0a',
      secondary: '#525252',
      tertiary: '#737373',
      inverse: '#ffffff',
    },
    // Border colors
    border: {
      primary: '#e5e5e5',
      secondary: '#d4d4d4',
      focus: '#ef4444',
    },
    // Accent colors
    accent: {
      primary: '#ef4444',
      secondary: '#dc2626',
      blue: '#3b82f6',
      cyan: '#06b6d4',
      purple: '#8b5cf6',
      green: '#10b981',
    },
    // Chart colors
    chart: {
      grid: '#e5e5e5',
      axis: '#737373',
      tooltip: {
        bg: '#ffffff',
        border: '#e5e5e5',
      },
    },
  },
  dark: {
    // Background colors
    bg: {
      primary: '#0a0a0a',
      secondary: '#141414',
      tertiary: '#1a1a1a',
      elevated: '#1f1f1f',
      card: '#161616',
    },
    // Text colors
    text: {
      primary: '#f5f5f5',
      secondary: '#a3a3a3',
      tertiary: '#737373',
      inverse: '#0a0a0a',
    },
    // Border colors
    border: {
      primary: '#2a2a2a',
      secondary: '#1f1f1f',
      focus: '#ef4444',
    },
    // Accent colors
    accent: {
      primary: '#ef4444',
      secondary: '#dc2626',
      blue: '#60a5fa',
      cyan: '#22d3ee',
      purple: '#a78bfa',
      green: '#34d399',
    },
    // Chart colors
    chart: {
      grid: '#2a2a2a',
      axis: '#737373',
      tooltip: {
        bg: '#1f1f1f',
        border: '#2a2a2a',
      },
    },
  },
} as const;

export type Theme = keyof typeof themes;
export type ThemeColors = typeof themes[Theme];

/**
 * Chart color palette for multi-line charts
 * Add or modify colors to customize chart appearance
 */
export const chartColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

/**
 * Get theme colors based on current theme
 */
export const getThemeColors = (theme: Theme) => themes[theme];
