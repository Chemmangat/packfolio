'use client';

/**
 * Main Application Page
 * 
 * Entry point for the PackFolio dashboard.
 * Handles search functionality and displays results.
 */

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, message, Segmented, Tooltip } from 'antd';
import {
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  HeartOutlined,
  FileTextOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined,
  HistoryOutlined,
  LineChartOutlined,
  CalendarOutlined,
  GlobalOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import Dashboard from '@/components/EnhancedDashboard';
import LoadingAnimation from '@/components/LoadingAnimation';
import ContributeModal from '@/components/ContributeModal';
import LegalModal from '@/components/LegalModal';
import TestimonialSlider from '@/components/TestimonialSlider';
import { fetchUserPackages, fetchPackageStats, fetchGitHubStarsForPackage } from '@/lib/api';
import { useTheme } from '@/contexts/ThemeContext';
import { config } from '@/lib/config';
import type { PackageData } from '@/types';

const HISTORY_KEY = 'packfolio_search_history';
const MAX_HISTORY = 8;

function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function addToHistory(query: string) {
  if (!query.trim()) return;
  const prev = getSearchHistory().filter((h) => h !== query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([query, ...prev].slice(0, MAX_HISTORY)));
}

type Registry = 'npm' | 'pip';

interface SearchSuggestion {
  name: string;
  description: string;
  type: 'package' | 'scope';
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [registry, setRegistry] = useState<Registry>('npm');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const suggestionsAbortRef = useRef<AbortController | null>(null);
  const shouldAutoSearchRef = useRef(false);
  const initialLoadDoneRef = useRef(false);

  // Load history and auto-search from URL on mount
  useEffect(() => {
    isMountedRef.current = true;
    setSearchHistory(getSearchHistory());

    if (!initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true;
      const q = searchParams.get('q');
      if (q && q.trim()) {
        setUsername(q.trim());
        shouldAutoSearchRef.current = true;
      }
    }

    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
      suggestionsAbortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search for suggestions with rate limiting
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (loading || (searched && packages.length > 0)) {
        return;
      }

      if (!username.trim() || username.length < 3) {
        setSuggestions([]);
        setLoadingSuggestions(false);
        setShowSuggestions(false);
        setRateLimited(false);
        return;
      }

      suggestionsAbortRef.current?.abort();
      suggestionsAbortRef.current = new AbortController();

      setLoadingSuggestions(true);
      setRateLimited(false);

      try {
        const response = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(username)}&size=6`,
          { signal: suggestionsAbortRef.current.signal }
        );

        if (response.status === 429) {
          if (isMountedRef.current) {
            setRateLimited(true);
            setLoadingSuggestions(false);
            setSuggestions([]);
            setShowSuggestions(false);
            message.warning('Too many requests. Please wait a moment before searching again.', 3);
          }
          return;
        }

        if (response.ok && isMountedRef.current) {
          const data = await response.json();
          const items: SearchSuggestion[] = data.objects.map((obj: any) => ({
            name: obj.package.name,
            description: obj.package.description || 'No description',
            type: obj.package.name.startsWith('@') ? 'scope' : 'package',
          }));

          if (isMountedRef.current) {
            setSuggestions(items);
            setLoadingSuggestions(false);
            setRateLimited(false);
            if (items.length > 0) {
              setShowSuggestions(true);
            }
          }
        } else {
          if (isMountedRef.current) {
            setLoadingSuggestions(false);
            setSuggestions([]);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMountedRef.current) {
          setLoadingSuggestions(false);
          setSuggestions([]);
        }
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 600);
    return () => {
      clearTimeout(debounceTimer);
      suggestionsAbortRef.current?.abort();
    };
  }, [username, loading, searched, packages.length]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setUsername(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    shouldAutoSearchRef.current = true;
  }, []);

  const handleSearch = useCallback(async () => {
    if (loading) return;

    if (registry === 'pip') {
      message.info('PyPI support is coming soon.');
      return;
    }

    if (!username.trim()) {
      message.warning('Enter a username or package name to continue.');
      return;
    }

    setShowSuggestions(false);
    setLoading(true);
    setSearched(true);
    setRateLimited(false);

    router.replace(`?q=${encodeURIComponent(username.trim())}`, { scroll: false });
    addToHistory(username.trim());
    setSearchHistory(getSearchHistory());

    abortControllerRef.current = new AbortController();

    try {
      const userPackages = await fetchUserPackages(username);

      if (userPackages.length === 0) {
        message.info('No packages found for that search.');
        setPackages([]);
        setAllPackages([]);
        setLoading(false);
        return;
      }

      setAllPackages(userPackages);

      const INITIAL_LOAD = 1;
      const initialPackages = userPackages.slice(0, INITIAL_LOAD);
      const packagesWithStats: PackageData[] = [];

      for (let i = 0; i < initialPackages.length; i++) {
        if (abortControllerRef.current?.signal.aborted) return;

        const pkg = initialPackages[i];

        try {
          const stats = await fetchPackageStats(pkg.name);
          const githubStars = await fetchGitHubStarsForPackage(pkg.name, pkg.repositoryUrl);
          packagesWithStats.push({ ...pkg, stats, githubStars });
        } catch (error: any) {
          if (error.message?.includes('429')) {
            message.warning('Rate limit reached. Please wait a moment.', 3);
            setRateLimited(true);
            packagesWithStats.push({
              ...pkg,
              stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] },
            });
          } else {
            packagesWithStats.push({
              ...pkg,
              stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] },
            });
          }
        }
      }

      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        setPackages(packagesWithStats);
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);

        if (userPackages.length > INITIAL_LOAD) {
          message.success(`Loaded ${packagesWithStats.length} package. Loading more...`, 2);

          setTimeout(async () => {
            const SECOND_BATCH = 9;
            const nextBatch = userPackages.slice(INITIAL_LOAD, INITIAL_LOAD + SECOND_BATCH);
            const nextPackagesWithStats: PackageData[] = [];

            for (let i = 0; i < nextBatch.length; i++) {
              if (abortControllerRef.current?.signal.aborted) return;

              const pkg = nextBatch[i];

              try {
                const stats = await fetchPackageStats(pkg.name);
                const githubStars = await fetchGitHubStarsForPackage(pkg.name, pkg.repositoryUrl);
                nextPackagesWithStats.push({ ...pkg, stats, githubStars });
              } catch (error: any) {
                if (error.message?.includes('429')) {
                  setRateLimited(true);
                  nextPackagesWithStats.push({
                    ...pkg,
                    stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] },
                  });
                } else {
                  nextPackagesWithStats.push({
                    ...pkg,
                    stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] },
                  });
                }
              }
            }

            if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
              setPackages((prev) => [...prev, ...nextPackagesWithStats]);
              const remaining = userPackages.length - (INITIAL_LOAD + nextPackagesWithStats.length);
              if (remaining > 0) {
                message.success(
                  `Loaded ${INITIAL_LOAD + nextPackagesWithStats.length} of ${userPackages.length} packages. Click "Load more" for the rest.`,
                  3
                );
              } else {
                message.success(`All ${INITIAL_LOAD + nextPackagesWithStats.length} packages loaded.`, 2);
              }
            }
          }, 100);
        } else {
          message.success(`Loaded ${packagesWithStats.length} package${packagesWithStats.length > 1 ? 's' : ''}.`);
        }
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        if (error.message?.includes('429')) {
          message.error('Rate limit reached. Please wait 30 seconds and try again.', 6);
          setRateLimited(true);
        } else {
          message.error('Failed to fetch package data.');
        }
        setPackages([]);
        setAllPackages([]);
        setLoading(false);
      }
    }
  }, [username, registry, loading, router]);

  // Auto-search when username is set from suggestion
  useEffect(() => {
    if (shouldAutoSearchRef.current && username) {
      shouldAutoSearchRef.current = false;
      const timer = setTimeout(() => handleSearch(), 100);
      return () => clearTimeout(timer);
    }
  }, [username, handleSearch]);

  const handleCancelSearch = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
    setLoadingMore(false);
    message.info('Search cancelled.');
  };

  const handleReset = () => {
    setUsername('');
    setPackages([]);
    setAllPackages([]);
    setSearched(false);
    setLoading(false);
    setLoadingMore(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setRateLimited(false);
    router.replace('/', { scroll: false });
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || packages.length >= allPackages.length) return;

    setLoadingMore(true);
    setRateLimited(false);

    const BATCH_SIZE = 10;
    const currentCount = packages.length;
    const nextBatch = allPackages.slice(currentCount, currentCount + BATCH_SIZE);
    const newPackagesWithStats: PackageData[] = [];

    for (let i = 0; i < nextBatch.length; i++) {
      const pkg = nextBatch[i];

      try {
        const stats = await fetchPackageStats(pkg.name);
        const githubStars = await fetchGitHubStarsForPackage(pkg.name, pkg.repositoryUrl);
        newPackagesWithStats.push({ ...pkg, stats, githubStars });
      } catch (error: any) {
        if (error.message?.includes('429')) {
          message.warning('Rate limit reached. Please wait a moment before loading more.', 3);
          setRateLimited(true);
          newPackagesWithStats.push({
            ...pkg,
            stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] },
          });
        } else {
          newPackagesWithStats.push({
            ...pkg,
            stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] },
          });
        }
      }
    }

    if (isMountedRef.current) {
      setPackages([...packages, ...newPackagesWithStats]);
      setLoadingMore(false);

      const remaining = allPackages.length - (currentCount + newPackagesWithStats.length);
      if (remaining > 0) {
        message.success(`Loaded ${newPackagesWithStats.length} more packages. ${remaining} remaining.`, 2);
      } else {
        message.success(`All ${packages.length + newPackagesWithStats.length} packages loaded.`, 2);
      }
    }
  }, [loadingMore, packages, allPackages]);

  return (
    <main className="h-screen bg-primary text-primary overflow-hidden flex flex-col">
      {/* Structured Data for AI/SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'PackFolio',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Free npm package analytics dashboard. Track download statistics, trends, and compare packages. Search by username or package name to view daily, weekly, monthly, and all-time download metrics with interactive charts.',
            url: 'https://packfolio.vercel.app',
            featureList: [
              'npm package search by username or package name',
              'Real-time download statistics (daily, weekly, monthly, all-time)',
              'Interactive trend charts with multiple time ranges',
              'Package comparison across multiple packages',
              'Download distribution visualization',
              'Light and dark theme support',
              'Mobile-responsive design',
              'Free to use with no registration required',
            ],
            screenshot: 'https://packfolio.vercel.app/screenshot.png',
            softwareVersion: '1.0.0',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              ratingCount: '1',
            },
            author: {
              '@type': 'Organization',
              name: 'PackFolio',
            },
          }),
        }}
      />

      {/* Header Bar — glass effect */}
      <div
        className="packfolio-header relative"
        style={{
          zIndex: 100,
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-elevated)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.04)',
        }}
      >
        <div className="px-4 sm:px-6 py-3 sm:py-3.5">
          {/* Top row - Logo and Theme Toggle (mobile only) */}
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 2,
                  background: 'var(--accent-primary)',
                  flexShrink: 0,
                }}
              />
              <h1 className="text-lg font-semibold font-mono tracking-tight text-primary">
                {config.app.name}
              </h1>
            </div>

            <div className="flex items-center gap-1.5">
              {(searched || packages.length > 0) && !loading && (
                <Button
                  size="large"
                  onClick={handleReset}
                  icon={<CloseCircleOutlined />}
                  className="theme-toggle"
                  title="Clear search"
                />
              )}

              <Button
                size="large"
                onClick={() => window.open('/about', '_blank')}
                icon={<InfoCircleOutlined />}
                className="theme-toggle"
                title="About PackFolio"
              />

              <Button
                size="large"
                onClick={() => setShowLegalModal(true)}
                icon={<FileTextOutlined />}
                className="theme-toggle"
                title="Terms &amp; Conditions"
              />

              <Button
                size="large"
                onClick={() => setShowContributeModal(true)}
                icon={<HeartOutlined />}
                className="theme-toggle"
                title="Support PackFolio"
              />

              {config.features.enableThemeToggle && (
                <Button
                  size="large"
                  onClick={toggleTheme}
                  icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                  className="theme-toggle"
                />
              )}
            </div>
          </div>

          {/* Search controls row */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Logo (desktop) */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}
                />
                <h1 className="text-xl font-semibold font-mono tracking-tight text-primary">
                  {config.app.name}
                </h1>
              </div>
              <div className="h-6 w-px" style={{ backgroundColor: 'var(--border-primary)' }} />
              <p className="text-sm text-secondary font-mono hidden lg:block">{config.app.description}</p>
            </div>

            {/* Registry Selector */}
            <Segmented
              value={registry}
              onChange={(value) => setRegistry(value as Registry)}
              options={[
                { label: 'npm', value: 'npm' },
                {
                  label: (
                    <Tooltip title="Coming soon">
                      <span className="hidden sm:inline">
                        pip <InfoCircleOutlined className="text-xs ml-1" />
                      </span>
                      <span className="sm:hidden">pip</span>
                    </Tooltip>
                  ),
                  value: 'pip',
                  disabled: true,
                },
              ]}
              className="registry-selector flex-shrink-0"
            />

            {/* Search Field — unified background */}
            <div className="relative flex-1" style={{ zIndex: 1000 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 40,
                  padding: '0 12px',
                  borderRadius: 10,
                  background: 'var(--bg-card)',
                  border: `1px solid ${
                    isSearchFocused ? 'var(--accent-primary)' : 'var(--border-primary)'
                  }`,
                  boxShadow: isSearchFocused
                    ? '0 0 0 4px rgba(239,68,68,0.08)'
                    : '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                <SearchOutlined
                  className="text-tertiary"
                  style={{ fontSize: 14, flexShrink: 0 }}
                />
                <Input
                  variant="borderless"
                  placeholder={config.search.placeholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onPressEnter={handleSearch}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (suggestions.length > 0 && !loading && !rateLimited) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setIsSearchFocused(false);
                    setTimeout(() => setShowSuggestions(false), 300);
                  }}
                  className="font-mono"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 22,
                    lineHeight: '22px',
                    padding: 0,
                    margin: 0,
                    fontSize: 13,
                    background: 'transparent !important',
                    boxShadow: 'none !important',
                  }}
                  disabled={loading}
                />
                {rateLimited ? (
                  <Tooltip title="Rate limited. Please wait.">
                    <InfoCircleOutlined style={{ color: '#eab308', flexShrink: 0 }} />
                  </Tooltip>
                ) : (
                  loadingSuggestions &&
                  !loading && (
                    <div
                      className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent flex-shrink-0"
                      style={{
                        borderColor: 'var(--border-primary)',
                        borderTopColor: 'var(--accent-primary)',
                      }}
                    />
                  )
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && !loading && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-primary rounded-xl shadow-2xl max-h-80 overflow-y-auto"
                  style={{ zIndex: 99999 }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-card transition-colors border-b border-primary last:border-b-0 flex items-start gap-3 cursor-pointer"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-primary)',
                          }}
                        >
                          {suggestion.type === 'scope' ? (
                            <span className="text-accent-primary text-[10px] font-mono font-bold">
                              @
                            </span>
                          ) : (
                            <span className="text-accent-primary text-[10px] font-mono font-bold">
                              #
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-primary font-semibold truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-tertiary mt-1 line-clamp-2">
                          {suggestion.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Search History Dropdown */}
              {!showSuggestions && !loading && searchHistory.length > 0 && username.length === 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-primary rounded-xl shadow-2xl overflow-hidden"
                  style={{ zIndex: 99999 }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="px-4 py-2 border-b border-primary flex items-center justify-between">
                    <span className="text-[10px] font-mono text-tertiary uppercase tracking-wider">
                      Recent searches
                    </span>
                    <button
                      onClick={() => {
                        localStorage.removeItem(HISTORY_KEY);
                        setSearchHistory([]);
                      }}
                      className="text-[10px] font-mono text-tertiary hover:text-primary transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((h, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUsername(h);
                        shouldAutoSearchRef.current = true;
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-card transition-colors border-b border-primary last:border-b-0 flex items-center gap-3 cursor-pointer"
                    >
                      <HistoryOutlined className="text-tertiary text-xs flex-shrink-0" />
                      <span className="font-mono text-sm text-primary truncate">{h}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search/Cancel Button */}
            {loading ? (
              <Button
                danger
                size="large"
                onClick={handleCancelSearch}
                className="font-mono px-4 sm:px-8 flex-shrink-0"
              >
                <span className="hidden sm:inline">Cancel</span>
                <CloseOutlined className="sm:hidden" />
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                className="search-button font-mono px-4 sm:px-8 flex-shrink-0"
                style={{
                  borderRadius: 10,
                  boxShadow: '0 2px 8px rgba(239,68,68,0.25)',
                }}
              >
                <span className="hidden sm:inline">Search</span>
                <SearchOutlined className="sm:hidden" />
              </Button>
            )}

            {/* Desktop controls */}
            <div className="hidden sm:flex items-center gap-1.5">
              {(searched || packages.length > 0) && !loading && (
                <>
                  <Button
                    size="large"
                    onClick={handleReset}
                    icon={<CloseCircleOutlined />}
                    className="theme-toggle"
                    title="Clear search"
                  />
                  <div className="h-5 w-px mx-1" style={{ backgroundColor: 'var(--border-primary)' }} />
                </>
              )}

              <Button
                size="large"
                onClick={() => window.open('/about', '_blank')}
                icon={<InfoCircleOutlined />}
                className="theme-toggle"
                title="About PackFolio"
              />

              <Button
                size="large"
                onClick={() => setShowLegalModal(true)}
                icon={<FileTextOutlined />}
                className="theme-toggle"
                title="Terms &amp; Conditions"
              />

              <Button
                size="large"
                onClick={() => setShowContributeModal(true)}
                icon={<HeartOutlined />}
                className="theme-toggle"
                title="Support PackFolio"
              />

              {config.features.enableThemeToggle && (
                <>
                  <div className="h-5 w-px mx-1" style={{ backgroundColor: 'var(--border-primary)' }} />
                  <Button
                    size="large"
                    onClick={toggleTheme}
                    icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                    className="theme-toggle"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!searched && !loading && (
          <div className="h-full overflow-y-auto custom-scrollbar" style={{ background: 'var(--bg-primary)' }}>
            {/* ── HERO ── */}
            <section
              className="relative overflow-hidden"
              style={{
                minHeight: '100svh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* Animated gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(239,68,68,0.06) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 80%, rgba(239,68,68,0.03) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }}
              />

              <div
                className="relative z-10 w-full"
                style={{
                  maxWidth: '72rem',
                  margin: '0 auto',
                  padding: 'clamp(5rem, 10vw, 7rem) clamp(1.25rem, 5vw, 4rem)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                    gap: 'clamp(3rem, 6vw, 5rem)',
                    alignItems: 'center',
                  }}
                >
                  {/* LEFT: Main content */}
                  <div>
                    <div style={{ marginBottom: '1.75rem' }}>
                      <span
                        className="font-mono"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 16px',
                          borderRadius: '100px',
                          fontSize: '11px',
                          letterSpacing: '0.04em',
                          color: 'var(--text-secondary)',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-primary)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: 'var(--accent-primary)',
                            flexShrink: 0,
                          }}
                        />
                        Free · No account · Live npm data
                      </span>
                    </div>

                    <h1
                      className="font-mono font-bold text-primary"
                      style={{
                        fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.12,
                        marginBottom: '1.25rem',
                      }}
                    >
                      Understand any
                      <br />
                      npm package
                      <br />
                      <span style={{ color: 'var(--accent-primary)' }}>at a glance.</span>
                    </h1>

                    <p
                      className="font-mono text-secondary"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.4vw, 1.02rem)',
                        lineHeight: 1.8,
                        maxWidth: '34rem',
                        marginBottom: '2.25rem',
                      }}
                    >
                      Search by npm username or package name to get download statistics, health
                      scores, and trend charts drawn directly from the public npm registry.
                    </p>

                    <div>
                      <p
                        className="font-mono text-tertiary"
                        style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '0.75rem',
                        }}
                      >
                        Try an example
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(['sindresorhus', 'react', '@babel/core', 'expressjs'] as string[]).map(
                          (q) => (
                            <button
                              key={q}
                              onClick={() => {
                                setUsername(q);
                                shouldAutoSearchRef.current = true;
                              }}
                              className="font-mono cursor-pointer"
                              style={{
                                padding: '6px 18px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-primary)',
                                color: 'var(--text-secondary)',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                el.style.borderColor = 'var(--accent-primary)';
                                el.style.color = 'var(--accent-primary)';
                                el.style.transform = 'translateY(-1px)';
                                el.style.boxShadow = '0 4px 12px rgba(239,68,68,0.12)';
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget;
                                el.style.borderColor = 'var(--border-primary)';
                                el.style.color = 'var(--text-secondary)';
                                el.style.transform = 'translateY(0)';
                                el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                              }}
                            >
                              {q}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Testimonials */}
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p
                        className="font-mono text-tertiary"
                        style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      >
                        What developers say
                      </p>
                    </div>
                    <TestimonialSlider />
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-8 left-1/2"
                style={{
                  transform: 'translateX(-50%)',
                  opacity: 0.25,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span
                  className="font-mono text-tertiary"
                  style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  Scroll
                </span>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
                  <path
                    d="M1 1l4.5 4.5L10 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-tertiary"
                  />
                </svg>
              </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section
              style={{
                borderTop: '1px solid var(--border-primary)',
                borderBottom: '1px solid var(--border-primary)',
                background: 'var(--bg-elevated)',
              }}
            >
              <div
                style={{
                  maxWidth: '72rem',
                  margin: '0 auto',
                  padding: '2.5rem clamp(1.25rem, 5vw, 4rem)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '2rem',
                  }}
                >
                  {[
                    { v: '365', s: 'd', d: 'of download history' },
                    { v: 'Live', s: '', d: 'data from the npm API' },
                    { v: '0', s: '', d: 'account required' },
                    { v: 'Free', s: '', d: 'forever, MIT licensed' },
                  ].map(({ v, s, d }) => (
                    <div key={d} style={{ textAlign: 'center' }}>
                      <div
                        className="font-mono font-bold text-primary"
                        style={{
                          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {v}
                        <span style={{ color: 'var(--accent-primary)' }}>{s}</span>
                      </div>
                      <div className="font-mono text-tertiary" style={{ fontSize: '11px', marginTop: '3px' }}>
                        {d}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── FEATURES ── */}
            <section
              style={{
                maxWidth: '72rem',
                margin: '0 auto',
                padding: 'clamp(4rem, 7vw, 6rem) clamp(1.25rem, 5vw, 4rem)',
              }}
            >
              <div style={{ marginBottom: '3rem' }}>
                <p
                  className="font-mono text-tertiary"
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.6rem',
                  }}
                >
                  What you get
                </p>
                <h2
                  className="font-mono font-bold text-primary"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Everything to understand any npm package
                </h2>
                <p
                  className="font-mono text-secondary"
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    maxWidth: '40rem',
                    marginTop: '0.75rem',
                  }}
                >
                  Six integrated views, all powered by npm&apos;s official public API — no scraping, no
                  third-party data.
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                  gap: '14px',
                }}
              >
                {(
                  [
                    {
                      icon: <StarOutlined />,
                      t: 'Health score',
                      d: 'A 0–100 composite score combining download velocity, publish freshness, total popularity, and GitHub star count.',
                    },
                    {
                      icon: <LineChartOutlined />,
                      t: 'Download trends',
                      d: 'Area and multi-line charts across 7-day, 30-day, 90-day, and 1-year windows, with side-by-side package comparison.',
                    },
                    {
                      icon: <FireOutlined />,
                      t: 'Trending detection',
                      d: 'Surfaces rising and notable packages using week-over-week growth analysis across everything you’ve loaded.',
                    },
                    {
                      icon: <TrophyOutlined />,
                      t: 'Developer leaderboard',
                      d: 'Total downloads, GitHub stars, impact score, and tier rank for any npm author profile.',
                    },
                    {
                      icon: <CalendarOutlined />,
                      t: 'Download heatmap',
                      d: 'A 365-day contribution calendar for spotting seasonality, consistency, and anomalies at a glance.',
                    },
                    {
                      icon: <GlobalOutlined />,
                      t: 'Global distribution',
                      d: 'An interactive globe showing estimated regional download distribution based on global developer demographics.',
                    },
                  ] as { icon: React.ReactNode; t: string; d: string }[]
                ).map((f) => (
                  <div
                    key={f.t}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                      transition: 'all 0.2s ease',
                      cursor: 'default',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--accent-primary)';
                      el.style.boxShadow = '0 8px 30px rgba(239,68,68,0.06)';
                      el.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--border-primary)';
                      el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                      el.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-primary)',
                        color: 'var(--accent-primary)',
                        fontSize: '16px',
                      }}
                    >
                      {f.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3
                        className="font-mono font-semibold text-primary"
                        style={{ fontSize: '14px', marginBottom: '4px' }}
                      >
                        {f.t}
                      </h3>
                      <p className="font-mono text-secondary" style={{ fontSize: '12px', lineHeight: 1.65 }}>
                        {f.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section
              style={{
                borderTop: '1px solid var(--border-primary)',
                background: 'var(--bg-elevated)',
              }}
            >
              <div
                style={{
                  maxWidth: '72rem',
                  margin: '0 auto',
                  padding: 'clamp(4rem, 7vw, 6rem) clamp(1.25rem, 5vw, 4rem)',
                }}
              >
                <div style={{ marginBottom: '3rem' }}>
                  <p
                    className="font-mono text-tertiary"
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.6rem',
                    }}
                  >
                    How it works
                  </p>
                  <h2
                    className="font-mono font-bold text-primary"
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Three steps, no setup
                  </h2>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                    gap: '2.5rem 3rem',
                  }}
                >
                  {[
                    {
                      n: '01',
                      t: 'Search',
                      d: 'Enter an npm username (e.g. sindresorhus) or package name (e.g. react, @babel/core). Autocomplete and search history help you get there fast.',
                    },
                    {
                      n: '02',
                      t: 'Fetch',
                      d: 'PackFolio queries the npm registry and downloads API in real time, directly from your browser — no server cache, always current.',
                    },
                    {
                      n: '03',
                      t: 'Analyze',
                      d: 'Explore five dashboard views: Overview, Charts, Globe, Timeline, and Developer Stats. Load additional packages as you need them.',
                    },
                  ].map((s) => (
                    <div key={s.n}>
                      <div
                        className="font-mono font-semibold"
                        style={{
                          fontSize: '1.75rem',
                          color: 'var(--border-primary)',
                          letterSpacing: '-0.03em',
                          lineHeight: 1,
                          marginBottom: '1rem',
                        }}
                      >
                        {s.n}
                      </div>
                      <h3
                        className="font-mono font-semibold text-primary"
                        style={{ fontSize: '15px', marginBottom: '0.6rem' }}
                      >
                        {s.t}
                      </h3>
                      <p className="font-mono text-secondary" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                        {s.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── DISCLAIMER ── */}
            <section style={{ borderTop: '1px solid var(--border-primary)' }}>
              <div
                style={{
                  maxWidth: '72rem',
                  margin: '0 auto',
                  padding: '2.5rem clamp(1.25rem, 5vw, 4rem)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <WarningOutlined
                    style={{ color: 'var(--text-tertiary)', fontSize: '15px', marginTop: '1px', flexShrink: 0 }}
                  />
                  <div>
                    <p
                      className="font-mono font-semibold text-primary"
                      style={{ fontSize: '12px', marginBottom: '5px' }}
                    >
                      About download counts
                    </p>
                    <p className="font-mono text-secondary" style={{ fontSize: '12px', lineHeight: 1.7 }}>
                      npm download counts represent <strong>installation events</strong>, not unique
                      users or active projects. They include CI/CD pipelines, mirror server pulls,
                      automated managers like Renovate and Dependabot, and bot activity. Treat trends
                      and week-over-week growth as the meaningful signal — not raw totals.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── FOOTER ── */}
            <footer
              style={{
                borderTop: '1px solid var(--border-primary)',
                background: 'var(--bg-elevated)',
              }}
            >
              <div
                style={{
                  maxWidth: '72rem',
                  margin: '0 auto',
                  padding: '1.75rem clamp(1.25rem, 5vw, 4rem)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <span className="font-mono text-tertiary" style={{ fontSize: '12px' }}>
                  PackFolio — free and open source · MIT License
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { label: 'About', href: '/about', ext: false },
                    { label: 'Terms', href: '/terms', ext: false },
                    { label: 'chemmangathari.in', href: 'https://chemmangathari.in', ext: true },
                  ].map(({ label, href, ext }) => (
                    <a
                      key={label}
                      href={href}
                      target={ext ? '_blank' : undefined}
                      rel={ext ? 'noopener noreferrer' : undefined}
                      className="font-mono text-tertiary"
                      style={{ fontSize: '12px', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </footer>

            <div className="sr-only">
              <h2>
                npm package analytics npm download statistics package health score npm trending
                packages developer leaderboard npm charts package comparison
              </h2>
            </div>
          </div>
        )}

        {loading && <LoadingAnimation />}

        {!loading && searched && packages.length > 0 && (
          <Dashboard
            packages={packages}
            onLoadMore={packages.length < allPackages.length ? handleLoadMore : undefined}
            loadingMore={loadingMore}
            remainingCount={allPackages.length - packages.length}
            username={username}
          />
        )}

        {!loading && searched && packages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary border border-primary flex items-center justify-center"
                style={{ background: 'var(--bg-card)' }}
              >
                <SearchOutlined className="text-tertiary text-2xl" />
              </div>
              <p className="text-secondary font-mono text-sm font-semibold">No packages found</p>
              <p className="text-tertiary font-mono text-xs mt-2">Try a different username or package name</p>
            </div>
          </div>
        )}
      </div>

      {/* Contribute Modal */}
      <ContributeModal open={showContributeModal} onClose={() => setShowContributeModal(false)} />

      {/* Legal Modal */}
      <LegalModal open={showLegalModal} onClose={() => setShowLegalModal(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}