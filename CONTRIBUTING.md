# Contributing to PackFolio

Thank you for your interest in contributing to PackFolio! This guide will help you get started.

## 🎯 Development Philosophy

PackFolio is built with these principles:

1. **Developer-First** - Code should be easy to understand and modify
2. **Configuration Over Code** - Use config files instead of hardcoding
3. **Type Safety** - Leverage TypeScript for better DX
4. **Documentation** - Every function should have clear JSDoc comments
5. **Modularity** - Components should be self-contained and reusable

## 🏗️ Architecture Overview

### Directory Structure

```
packfolio/
├── app/              # Next.js App Router pages
├── components/       # React components
├── contexts/         # React contexts (state management)
├── lib/             # Business logic and utilities
│   ├── api.ts       # API integration
│   ├── config.ts    # Configuration
│   ├── theme.ts     # Theme definitions
│   └── utils.ts     # Helper functions
└── types/           # TypeScript types
```

### Key Concepts

#### 1. Configuration-Driven

All customizable values live in `lib/config.ts`:

```typescript
export const config = {
  app: { name: 'PackFolio', ... },
  api: { registrySearch: '...', ... },
  ui: { defaultTimeRange: '30', ... },
  features: { enableComparison: true, ... },
}
```

**Why?** Developers can customize the app without touching component code.

#### 2. Theme System

Themes are defined in `lib/theme.ts` and applied via CSS variables:

```typescript
// lib/theme.ts
export const themes = {
  light: { bg: { primary: '#fff' }, ... },
  dark: { bg: { primary: '#0a0a0a' }, ... },
}
```

```css
/* app/globals.css */
:root {
  --bg-primary: #0a0a0a;
}
```

**Why?** Easy to add new themes without modifying components.

#### 3. Utility Functions

Common operations are abstracted into `lib/utils.ts`:

```typescript
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  // ...
}
```

**Why?** Reusable, testable, and consistent across the app.

#### 4. Type Safety

All data structures are typed in `types/index.ts`:

```typescript
export interface PackageData {
  name: string;
  version: string;
  description: string;
  stats: PackageStats;
}
```

**Why?** Catch errors at compile time, better IDE support.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Basic knowledge of React, Next.js, and TypeScript

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd packfolio

# Install dependencies
npm install

# Run dev server
npm run dev
```

### Development Workflow

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly (light/dark theme, responsive design)
4. Commit with clear messages
5. Push and create a pull request

## 📝 Code Style

### TypeScript

- Use explicit types for function parameters and returns
- Avoid `any` - use proper types or `unknown`
- Use interfaces for object shapes
- Use type aliases for unions/intersections

```typescript
// ✅ Good
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// ❌ Bad
function formatNumber(num: any) {
  return num.toLocaleString();
}
```

### React Components

- Use functional components with hooks
- Add JSDoc comments explaining the component
- Props should be typed with interfaces
- Use descriptive prop names

```typescript
/**
 * Package List Component
 * 
 * Displays a list of packages in the sidebar.
 * Allows selection of a package to view details.
 */
interface PackageListProps {
  packages: PackageData[];
  selectedPackage: PackageData;
  onSelect: (pkg: PackageData) => void;
}

export default function PackageList({ 
  packages, 
  selectedPackage, 
  onSelect 
}: PackageListProps) {
  // Component logic
}
```

### CSS

- Use Tailwind utility classes when possible
- Use CSS variables for theme-aware colors
- Avoid hardcoded colors - use theme variables

```tsx
// ✅ Good - uses theme variables
<div className="bg-primary text-primary border-primary">

// ❌ Bad - hardcoded colors
<div className="bg-gray-900 text-white border-gray-800">
```

### File Organization

- One component per file
- Co-locate related components
- Keep files under 300 lines
- Extract complex logic into utilities

## 🎨 Adding Features

### Adding a New Chart

1. Open `components/ChartsPanel.tsx`
2. Create your chart component
3. Add it to the `tabItems` array

```typescript
const tabItems = [
  // ... existing tabs
  {
    key: 'my-chart',
    label: <span className="font-mono text-xs">MY CHART</span>,
    children: (
      <div className="h-full p-6">
        <ResponsiveContainer width="100%" height="100%">
          {/* Your chart */}
        </ResponsiveContainer>
      </div>
    ),
  },
];
```

### Adding a New Statistic

1. Update API function in `lib/api.ts`:

```typescript
export async function fetchPackageStats(packageName: string): Promise<PackageStats> {
  // ... existing code
  const myNewStat = await fetchMyNewStat(packageName);
  return { daily, weekly, monthly, allTime, myNewStat, downloads };
}
```

2. Update type in `types/index.ts`:

```typescript
export interface PackageStats {
  daily: number;
  weekly: number;
  monthly: number;
  allTime: number;
  myNewStat: number;  // Add this
  downloads: DailyDownload[];
}
```

3. Display in `OverviewPanel.tsx`:

```typescript
<StatBox label="My Stat" value={selectedPackage.stats.myNewStat} color="text-blue-400" />
```

### Adding a New Theme

1. Define theme in `lib/theme.ts`:

```typescript
export const themes = {
  light: { ... },
  dark: { ... },
  ocean: {
    bg: { primary: '#0c1821', ... },
    text: { primary: '#e0f7fa', ... },
    // ... define all colors
  }
}
```

2. Update CSS variables in `app/globals.css`:

```css
[data-theme="ocean"] {
  --bg-primary: #0c1821;
  --text-primary: #e0f7fa;
  /* ... */
}
```

3. Update theme toggle in `ThemeContext.tsx` if needed

### Adding Configuration Options

1. Add to `lib/config.ts`:

```typescript
export const config = {
  // ... existing config
  myFeature: {
    enabled: true,
    option1: 'value',
    option2: 42,
  },
}
```

2. Use in components:

```typescript
import { config } from '@/lib/config';

if (config.myFeature.enabled) {
  // Feature logic
}
```

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Light theme works correctly
- [ ] Dark theme works correctly
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Search functionality
- [ ] All charts render correctly
- [ ] Theme toggle persists on reload
- [ ] No console errors
- [ ] TypeScript compiles without errors

### Testing Commands

```bash
# Type check
npm run build

# Lint
npm run lint
```

## 📚 Documentation

### JSDoc Comments

All functions should have JSDoc comments:

```typescript
/**
 * Format large numbers with K/M suffixes
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.5M", "23.4K")
 * @example
 * formatCompactNumber(1500000) // "1.5M"
 */
export function formatCompactNumber(num: number): string {
  // Implementation
}
```

### Component Documentation

Components should have a description:

```typescript
/**
 * Dashboard Component
 * 
 * Main dashboard layout with package list, overview, and charts.
 * Manages selected package state and coordinates child components.
 */
export default function Dashboard({ packages }: DashboardProps) {
  // Component logic
}
```

### README Updates

If you add a feature, update the README:

- Add to features list
- Document configuration options
- Add usage examples
- Update customization section

## 🐛 Bug Reports

When reporting bugs, include:

1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Browser/OS information

## 💡 Feature Requests

When requesting features:

1. Describe the feature
2. Explain the use case
3. Provide examples or mockups
4. Consider implementation complexity

## 🔍 Code Review

PRs will be reviewed for:

- Code quality and style
- Type safety
- Documentation
- Performance
- Accessibility
- Theme compatibility
- Responsive design

## 📞 Getting Help

- Open an issue for bugs or questions
- Check existing issues before creating new ones
- Be respectful and constructive

## 🎉 Recognition

Contributors will be:

- Listed in the README
- Credited in release notes
- Appreciated by the community!

---

Thank you for contributing to PackFolio! 🚀
