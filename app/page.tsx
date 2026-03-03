'use client';

/**
 * Main Application Page
 * 
 * Entry point for the PackFolio dashboard.
 * Handles search functionality and displays results.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Input, Button, message, Segmented, Tooltip } from 'antd';
import { SearchOutlined, SunOutlined, MoonOutlined, InfoCircleOutlined, CloseOutlined, CloseCircleOutlined, HeartOutlined, FileTextOutlined } from '@ant-design/icons';
import Dashboard from '@/components/Dashboard';
import LoadingAnimation from '@/components/LoadingAnimation';
import ContributeModal from '@/components/ContributeModal';
import LegalModal from '@/components/LegalModal';
import { fetchUserPackages, fetchPackageStats, fetchGitHubStarsForPackage } from '@/lib/api';
import { useTheme } from '@/contexts/ThemeContext';
import { config } from '@/lib/config';
import type { PackageData } from '@/types';

type Registry = 'npm' | 'pip';

interface SearchSuggestion {
  name: string;
  description: string;
  type: 'package' | 'scope';
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]); // All package metadata
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
  const { theme, toggleTheme } = useTheme();
  
  // Refs to track mounted state and abort controllers
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const suggestionsAbortRef = useRef<AbortController | null>(null);
  const shouldAutoSearchRef = useRef(false);

  // Set mounted state and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
      suggestionsAbortRef.current?.abort();
    };
  }, []);

  // Debounced search for suggestions with rate limiting
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Don't fetch if loading or search already completed
      if (loading || (searched && packages.length > 0)) {
        return;
      }
      
      // Require at least 3 characters to reduce API calls
      if (!username.trim() || username.length < 3) {
        setSuggestions([]);
        setLoadingSuggestions(false);
        setShowSuggestions(false);
        setRateLimited(false);
        return;
      }

      // Cancel previous request
      suggestionsAbortRef.current?.abort();
      suggestionsAbortRef.current = new AbortController();

      setLoadingSuggestions(true);
      setRateLimited(false);
      
      try {
        const response = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(username)}&size=6`,
          { signal: suggestionsAbortRef.current.signal }
        );
        
        // Handle rate limiting
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
            type: obj.package.name.startsWith('@') ? 'scope' : 'package'
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

    // Increased debounce to 600ms to reduce API calls
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
    // Prevent multiple simultaneous searches
    if (loading) return;
    
    if (registry === 'pip') {
      message.info('PyPI support coming soon!');
      return;
    }

    if (!username.trim()) {
      message.warning('Please enter a username or package name');
      return;
    }

    setShowSuggestions(false);
    setLoading(true);
    setSearched(true);
    setRateLimited(false);
    
    // Create new abort controller for this search
    abortControllerRef.current = new AbortController();
    
    try {
      const userPackages = await fetchUserPackages(username);
      
      if (userPackages.length === 0) {
        message.info('No packages found');
        setPackages([]);
        setAllPackages([]);
        setLoading(false);
        return;
      }
      
      // Store all packages
      setAllPackages(userPackages);
      
      // Load first 1 package with stats to show results immediately
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
          // If rate limited, show message and add with zero stats
          if (error.message?.includes('429')) {
            message.warning('Rate limit reached. Please wait a moment.', 3);
            setRateLimited(true);
            packagesWithStats.push({ 
              ...pkg, 
              stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] }
            });
          } else {
            // For other errors, continue with zero stats
            packagesWithStats.push({ 
              ...pkg, 
              stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] }
            });
          }
        }
      }

      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        setPackages(packagesWithStats);
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        
        // Automatically load next 9 packages in the background
        if (userPackages.length > INITIAL_LOAD) {
          message.success(`Loaded ${packagesWithStats.length} package. Loading more...`, 2);
          
          // Load next 9 packages automatically
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
                    stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] }
                  });
                } else {
                  nextPackagesWithStats.push({ 
                    ...pkg, 
                    stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] }
                  });
                }
              }
            }
            
            if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
              setPackages(prev => [...prev, ...nextPackagesWithStats]);
              const remaining = userPackages.length - (INITIAL_LOAD + nextPackagesWithStats.length);
              if (remaining > 0) {
                message.success(`Loaded ${INITIAL_LOAD + nextPackagesWithStats.length} of ${userPackages.length} packages. Click "Load More" for more.`, 3);
              } else {
                message.success(`All ${INITIAL_LOAD + nextPackagesWithStats.length} packages loaded!`, 2);
              }
            }
          }, 100);
        } else {
          message.success(`Loaded ${packagesWithStats.length} package${packagesWithStats.length > 1 ? 's' : ''}`);
        }
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        if (error.message?.includes('429')) {
          message.error('Rate limit reached. Please wait 30 seconds and try again.', 6);
          setRateLimited(true);
        } else {
          message.error('Failed to fetch package data');
        }
        setPackages([]);
        setAllPackages([]);
        setLoading(false);
      }
    }
  }, [username, registry, loading]);

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
    message.info('Search cancelled');
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
            stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] }
          });
        } else {
          newPackagesWithStats.push({ 
            ...pkg, 
            stats: { daily: 0, weekly: 0, monthly: 0, allTime: 0, downloads: [] }
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
        message.success(`All ${packages.length + newPackagesWithStats.length} packages loaded!`, 2);
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
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PackFolio",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free npm package analytics dashboard. Track download statistics, trends, and compare packages. Search by username or package name to view daily, weekly, monthly, and all-time download metrics with interactive charts.",
            "url": "https://packfolio.vercel.app",
            "featureList": [
              "npm package search by username or package name",
              "Real-time download statistics (daily, weekly, monthly, all-time)",
              "Interactive trend charts with multiple time ranges",
              "Package comparison across multiple packages",
              "Download distribution visualization",
              "Light and dark theme support",
              "Mobile-responsive design",
              "Free to use with no registration required"
            ],
            "screenshot": "https://packfolio.vercel.app/screenshot.png",
            "softwareVersion": "1.0.0",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "ratingCount": "1"
            },
            "author": {
              "@type": "Organization",
              "name": "PackFolio"
            }
          })
        }}
      />
      
      {/* Header Bar */}
      <div className="border-b border-primary bg-elevated backdrop-blur-sm relative" style={{ zIndex: 100 }}>
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          {/* Top row - Logo and Theme Toggle (mobile only) */}
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight">
                <span className="text-accent-primary">$</span> {config.app.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
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
                title="Legal & API Info"
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
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Logo (desktop) */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <h1 className="text-2xl font-bold font-mono tracking-tight">
                <span className="text-accent-primary">$</span> {config.app.name}
              </h1>
              <div className="h-6 w-px bg-border-primary" />
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
                      <span className="hidden sm:inline">pip <InfoCircleOutlined className="text-xs ml-1" /></span>
                      <span className="sm:hidden">pip</span>
                    </Tooltip>
                  ), 
                  value: 'pip',
                  disabled: true
                },
              ]}
              className="registry-selector flex-shrink-0"
            />
            
            {/* Search Input with Autocomplete */}
            <div className="relative flex-1" style={{ zIndex: 1000 }}>
              <Input
                size="large"
                placeholder={config.search.placeholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onPressEnter={handleSearch}
                onFocus={() => {
                  if (suggestions.length > 0 && !loading && !rateLimited) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                prefix={<SearchOutlined className="text-secondary" />}
                suffix={
                  rateLimited ? (
                    <Tooltip title="Rate limited. Please wait.">
                      <InfoCircleOutlined className="text-yellow-500" />
                    </Tooltip>
                  ) : (
                    loadingSuggestions && !loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-border-primary border-t-accent-primary" />
                  )
                }
                className="font-mono search-input"
                disabled={loading}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && !loading && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-primary rounded-lg shadow-2xl max-h-80 overflow-y-auto"
                  style={{ zIndex: 99999 }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-card transition-colors border-b border-primary last:border-b-0 flex items-start gap-3 cursor-pointer"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {suggestion.type === 'scope' ? '📦' : '📄'}
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
            </div>
            
            {/* Search/Cancel Button */}
            {loading ? (
              <Button
                danger
                size="large"
                onClick={handleCancelSearch}
                className="font-mono px-4 sm:px-8 flex-shrink-0"
              >
                <span className="hidden sm:inline">CANCEL</span>
                <CloseOutlined className="sm:hidden" />
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                className="search-button font-mono px-4 sm:px-8 flex-shrink-0"
              >
                <span className="hidden sm:inline">SEARCH</span>
                <SearchOutlined className="sm:hidden" />
              </Button>
            )}
            
            {/* Desktop controls */}
            <div className="hidden sm:flex items-center gap-2">
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
                title="Legal & API Info"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!searched && !loading && (
          <div className="h-full flex items-center justify-center bg-primary relative overflow-hidden">
            {/* Minimal Gradient Grid Background */}
            <div className="absolute inset-0">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-60"></div>
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.15]" style={{
                backgroundImage: `
                  linear-gradient(var(--border-primary) 1px, transparent 1px),
                  linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }} />
              
              {/* Subtle gradient accent */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/5 via-transparent to-accent-cyan/5"></div>
            </div>
            
            <div className="w-full max-w-6xl px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Terminal and Title */}
                <div className="text-center lg:text-left space-y-6">
                  {/* Terminal Icon - Minimal animation */}
                  <div className="relative inline-flex items-center justify-center lg:justify-start mb-6">
                    <div className="relative bg-card border border-primary rounded-xl p-4 shadow-lg w-56">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500 opacity-70"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-70"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500 opacity-70"></div>
                        </div>
                        <span className="text-[9px] text-tertiary uppercase tracking-wider ml-1">terminal</span>
                      </div>
                      
                      <div className="space-y-2 text-left font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-accent-primary">$</span>
                          <span className="text-secondary">npm search</span>
                          <span className="animate-pulse text-accent-primary">▊</span>
                        </div>
                        <div className="h-10 border border-primary rounded bg-secondary/30 flex items-center justify-center">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-bold font-mono text-primary">
                      npm Package Analytics
                    </h2>
                    <p className="text-base sm:text-lg text-secondary font-mono leading-relaxed">
                      Track download stats, trends & GitHub stars
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-secondary font-mono mb-3">
                      Try these examples:
                    </p>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      <code className="px-3 py-1.5 bg-card border border-primary rounded-md text-accent-primary font-mono text-xs hover:border-accent-primary transition-colors cursor-default">
                        sindresorhus
                      </code>
                      <code className="px-3 py-1.5 bg-card border border-primary rounded-md text-accent-primary font-mono text-xs hover:border-accent-primary transition-colors cursor-default">
                        @babel/core
                      </code>
                      <code className="px-3 py-1.5 bg-card border border-primary rounded-md text-accent-primary font-mono text-xs hover:border-accent-primary transition-colors cursor-default">
                        react
                      </code>
                    </div>
                  </div>
                </div>

                {/* Right side - Features */}
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="space-y-5 text-center lg:text-left">
                    <div>
                      <p className="text-base text-primary font-mono">
                        Real-time download statistics
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-primary font-mono">
                        Interactive trend charts
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-primary font-mono">
                        GitHub stars integration
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-primary font-mono">
                        Search by username or package
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Maintainer Credit */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <a 
                href="https://chemmangathari.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-tertiary hover:text-secondary font-mono transition-colors flex items-center gap-2"
              >
                <span>Maintained by</span>
                <span className="text-accent-primary hover:underline">chemmangathari.in</span>
              </a>
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
          />
        )}

        {!loading && searched && packages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-secondary font-mono text-sm font-semibold">No packages found</p>
              <p className="text-tertiary font-mono text-xs mt-2">Try a different username or package name</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Contribute Modal */}
      <ContributeModal 
        open={showContributeModal} 
        onClose={() => setShowContributeModal(false)} 
      />
      
      {/* Legal Modal */}
      <LegalModal 
        open={showLegalModal} 
        onClose={() => setShowLegalModal(false)} 
      />
    </main>
  );
}
