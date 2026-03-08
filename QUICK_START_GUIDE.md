# 🚀 PackFolio Quick Start Guide

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

---

## 🎯 Using the New Features

### 1. Package Health Score ⭐

**How to Access:**
1. Search for a package or username
2. Navigate to the **Overview** tab (default view)
3. Health Score card appears in the top-left section

**What You'll See:**
- Circular gauge showing score (0-100)
- Color-coded rating (Red < 40, Yellow < 60, Blue < 80, Green ≥ 80)
- Trend badge (🔥 Growing, 📈 Rising, 💎 Stable, 📉 Declining, ⚠️ Stale)
- Four factor bars showing breakdown

**Interpreting the Score:**
- **80-100**: Excellent - Actively maintained, growing, popular
- **60-79**: Good - Stable package with decent adoption
- **40-59**: Fair - May have some concerns (stale, declining)
- **0-39**: Poor - Consider alternatives

---

### 2. Real-Time Trending Feed 📊

**How to Access:**
1. Search for a username with multiple packages
2. Navigate to the **Overview** tab
3. Trending Feed appears in the top-right section

**Categories:**
- **🔥 Hot**: High downloads (>100K/week) + growing (>20%)
- **📈 Rising**: Medium downloads (>10K/week) + high growth (>50%)
- **🌟 Dark Horse**: Low downloads (<10K/week) + explosive growth (>100%)

**Use Cases:**
- Discover which of your packages are gaining traction
- Identify emerging packages in your portfolio
- Track growth trends across your ecosystem

---

### 3. Package Timeline 📅

**How to Access:**
1. Search for a package
2. Navigate to the **Timeline** tab

**What You'll See:**
- **Releases**: Latest version with publish date
- **Download Milestones**: 1M, 5M, 10M, 50M, 100M+ achievements
- **Star Milestones**: 100, 1K, 5K, 10K, 50K+ GitHub stars

**Visual Elements:**
- Color-coded icons (🚀 Releases, 🏆 Downloads, ⭐ Stars)
- Relative time ("2 days ago", "3 months ago")
- Hover effects for interactivity

---

### 4. Developer Leaderboard 🏆

**How to Access:**
1. Search for a username (not a single package)
2. Navigate to the **Developer** tab

**Metrics Displayed:**
- **Impact Score**: Weighted formula (downloads × 0.7 + stars × 0.3)
- **Total Downloads**: Sum across all packages
- **Total Packages**: Package count
- **Total Stars**: Combined GitHub stars
- **Top Package**: Most downloaded package

**Ranking Tiers:**
- 👑 **Legend**: Impact Score > 10,000
- 🏆 **Elite**: Impact Score > 1,000
- ⭐ **Pro**: Impact Score > 100
- 🌟 **Rising**: Impact Score > 10
- 🚀 **Starter**: Impact Score ≤ 10

**Use Cases:**
- Showcase your developer achievements
- Compare your impact with others
- Track your growth over time
- Share your stats on social media

---

### 5. Package Dependency Graph 🕸️

**How to Access:**
1. Search for a package
2. Navigate to the **Dependencies** tab

**What You'll See:**
- Dependency count
- Dependent count (may show "N/A" due to rate limits)
- List of direct dependencies (top 10)
- Central node visualization

**Use Cases:**
- Understand package complexity
- Identify dependency bloat
- Check what packages depend on yours
- Audit dependency tree

**Note**: Full dependent data requires additional API calls and may be limited to respect npm API rate limits.

---

### 6. Download Heatmap Calendar 🗓️

**How to Access:**
1. Search for a package
2. Navigate to the **Overview** tab
3. Scroll down to see the heatmap (full-width section)

**What You'll See:**
- Last 365 days of download activity
- GitHub-style contribution calendar
- 5-level intensity scale (darker = more downloads)
- Hover tooltips with exact counts

**Interpreting the Heatmap:**
- **Dark cells**: High download days
- **Light cells**: Low download days
- **Empty cells**: No data available
- **Patterns**: Identify weekly/seasonal trends

**Use Cases:**
- Spot download patterns (weekday vs weekend)
- Identify seasonal trends
- Detect unusual spikes or drops
- Visualize long-term growth

---

## 🎨 Navigation Tips

### Tab Structure
```
┌─────────────────────────────────────┐
│  Package List (Sidebar)             │
├─────────────────────────────────────┤
│  Tabs:                              │
│  ├─ Overview (Health, Trending,     │
│  │            Heatmap)               │
│  ├─ Charts (Trend, Comparison,      │
│  │          Distribution)            │
│  ├─ Timeline (Milestones)           │
│  ├─ Dependencies (Graph)            │
│  └─ Developer (Leaderboard)         │
└─────────────────────────────────────┘
```

### Mobile Navigation
- Tabs collapse to icons on mobile
- Swipe to navigate between tabs
- Sidebar becomes collapsible
- Heatmap scrolls horizontally

---

## 💡 Pro Tips

### Getting the Most Out of PackFolio

1. **Search by Username**: Get full developer stats and trending feed
2. **Compare Packages**: Use Charts tab to compare multiple packages
3. **Check Health First**: Always review health score before adopting a package
4. **Monitor Trends**: Use trending feed to spot growth opportunities
5. **Review Timeline**: Check milestones to gauge package maturity
6. **Analyze Patterns**: Use heatmap to understand download behavior

### Keyboard Shortcuts
- `Tab`: Navigate between elements
- `Enter`: Search or select
- `Esc`: Close modals
- Arrow keys: Navigate lists

### Performance Tips
- Search results load incrementally (1 package, then 9 more, then load more)
- Click "Load More" to fetch additional packages
- Use "Clear Search" (X button) to reset and start fresh

---

## 🎯 Example Workflows

### Workflow 1: Evaluating a Package
1. Search for package name (e.g., "react")
2. Check **Health Score** in Overview tab
3. Review **Timeline** for maturity
4. Check **Dependencies** for complexity
5. Compare with alternatives in **Charts** tab

### Workflow 2: Tracking Your Portfolio
1. Search for your username
2. View **Developer** stats for overall impact
3. Check **Trending** feed for growing packages
4. Review individual package health scores
5. Monitor download patterns in heatmaps

### Workflow 3: Discovering Trends
1. Search for a popular username (e.g., "sindresorhus")
2. Check **Trending** feed for hot packages
3. Compare packages in **Charts** tab
4. Review health scores to find quality packages
5. Check timelines for recent activity

---

## 🔧 Troubleshooting

### Common Issues

**"No packages found"**
- Check spelling of username/package
- Try searching by package name instead of username
- Some packages may not be indexed yet

**"Rate limit reached"**
- Wait 30-60 seconds before searching again
- npm API has rate limits to prevent abuse
- Try searching for fewer packages

**"Dependency data not loaded"**
- This feature requires additional API calls
- May be disabled to respect rate limits
- Try again later or search for a different package

**Slow loading**
- Large package lists load incrementally
- Click "Load More" to fetch additional packages
- First package loads immediately, rest load in background

---

## 🎨 Customization

### Theme Toggle
- Click sun/moon icon in header
- Preference saved to local storage
- Supports light and dark themes

### Time Ranges (Charts)
- 7D, 30D, 90D, 1Y options
- Click to change time range
- Applies to all chart types

---

## 📊 Understanding the Data

### Data Sources
- **npm Registry**: Package metadata, versions, descriptions
- **npm Downloads API**: Download statistics (daily, weekly, monthly)
- **GitHub**: Star counts via public API

### Update Frequency
- **Downloads**: Updated daily by npm
- **Stars**: Fetched in real-time
- **Package info**: Updated on each search

### Calculations
- **Health Score**: Client-side calculation based on 4 factors
- **Trending**: Growth rate comparison (last 7 days vs previous 7)
- **Impact Score**: Weighted formula (downloads × 0.7 + stars × 0.3)

---

## 🚀 Advanced Features

### Load More Functionality
- Initial load: 1 package (instant)
- Auto-load: Next 9 packages (background)
- Manual load: 10 packages per click
- Shows remaining count

### Responsive Design
- Mobile: Stacked layout, collapsible sections
- Tablet: Hybrid layout, optimized spacing
- Desktop: Full sidebar + tabbed content

### Performance
- Memoized components (no unnecessary re-renders)
- Lazy calculations (computed on demand)
- Efficient scrolling (custom scrollbars)
- GPU-accelerated animations

---

## 📚 Additional Resources

- **FEATURES.md**: Detailed feature documentation
- **IMPLEMENTATION_SUMMARY.md**: Technical implementation details
- **README.md**: Project overview and setup
- **CUSTOMIZATION.md**: Theming and configuration guide

---

## 🤝 Support

### Getting Help
- Check documentation files
- Review example workflows
- Try different search queries
- Clear cache and refresh

### Reporting Issues
- Describe the problem clearly
- Include search query used
- Mention browser and OS
- Provide screenshots if possible

---

**Happy Analyzing! 📊**

Built with ❤️ for the npm community
