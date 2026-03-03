import { useEffect, useRef, useState } from 'react';
import type { PackageData } from '@/types';
import { formatCompactNumber } from '@/lib/utils';
import { config } from '@/lib/config';
import { LinkOutlined, DownOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface PackageListProps {
  packages: PackageData[];
  selectedPackage: PackageData;
  onSelect: (pkg: PackageData) => void;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  remainingCount?: number;
}

/**
 * Package List Component
 * 
 * Displays a list of packages in the sidebar.
 * Allows selection of a package to view details.
 */
export default function PackageList({ 
  packages, 
  selectedPackage, 
  onSelect,
  onLoadMore,
  loadingMore,
  remainingCount 
}: PackageListProps) {
  const [animatedPackages, setAnimatedPackages] = useState<Set<string>>(new Set());
  const prevPackagesRef = useRef<string[]>([]);

  useEffect(() => {
    const prevNames = prevPackagesRef.current;
    const currentNames = packages.map(pkg => pkg.name);
    
    // Find newly added packages
    const newPackages = currentNames.filter(name => !prevNames.includes(name));
    
    if (newPackages.length > 0) {
      // Add new packages to animated set
      setAnimatedPackages(new Set(newPackages));
      
      // Remove animation after it completes
      const timer = setTimeout(() => {
        setAnimatedPackages(new Set());
      }, 800);
      
      return () => clearTimeout(timer);
    }
    
    prevPackagesRef.current = currentNames;
  }, [packages]);

  const getAnimationDelay = (pkgName: string): string => {
    if (!animatedPackages.has(pkgName)) return '0ms';
    
    // Find the index of this package in the current list
    const currentIndex = packages.findIndex(pkg => pkg.name === pkgName);
    const prevLength = prevPackagesRef.current.length;
    
    // Calculate delay based on position relative to previous length
    if (currentIndex >= prevLength) {
      const relativeIndex = currentIndex - prevLength;
      return `${relativeIndex * 80}ms`;
    }
    
    return '0ms';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <div className="text-xs font-mono text-secondary uppercase tracking-wider mb-2">
            Packages ({packages.length}{remainingCount ? ` of ${packages.length + remainingCount}` : ''})
          </div>
        </div>
        
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div 
              key={pkg.name} 
              className={`relative group ${animatedPackages.has(pkg.name) ? 'animate-slide-in' : ''}`}
              style={{
                animationDelay: getAnimationDelay(pkg.name)
              }}
            >
              <button
                onClick={() => onSelect(pkg)}
                className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                  selectedPackage.name === pkg.name
                    ? 'bg-accent-primary/20 border-accent-primary shadow-lg'
                    : 'bg-secondary border-primary hover:border-secondary hover:bg-tertiary'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-semibold text-primary mb-1 truncate">
                      {pkg.name}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      {config.features.showVersions && (
                        <span className="text-secondary font-mono">v{pkg.version}</span>
                      )}
                      <span className="text-accent-primary font-mono font-bold">
                        {formatCompactNumber(pkg.stats.allTime)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.npmjs.com/package/${pkg.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 p-1.5 rounded hover:bg-accent-primary/10 transition-colors text-secondary hover:text-accent-primary cursor-pointer"
                    title="View on npm"
                  >
                    <LinkOutlined className="text-sm" />
                  </a>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Load More Button */}
      {onLoadMore && remainingCount && remainingCount > 0 && (
        <div className="p-4 border-t border-primary bg-elevated">
          <Button
            type="primary"
            size="large"
            block
            onClick={onLoadMore}
            loading={loadingMore}
            icon={!loadingMore && <DownOutlined />}
            className="font-mono cursor-pointer"
          >
            {loadingMore ? 'Loading...' : `Load More (${remainingCount})`}
          </Button>
        </div>
      )}
    </div>
  );
}
