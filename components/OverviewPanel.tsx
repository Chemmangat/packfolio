/**
 * Overview Panel Component
 * 
 * Displays summary statistics for selected package and all packages combined.
 */

import type { PackageData } from '@/types';
import { formatNumber } from '@/lib/utils';
import { config } from '@/lib/config';
import { LinkOutlined } from '@ant-design/icons';

interface OverviewPanelProps {
  packages: PackageData[];
  selectedPackage: PackageData;
}

export default function OverviewPanel({ packages, selectedPackage }: OverviewPanelProps) {
  const totals = packages.reduce(
    (acc, pkg) => ({
      daily: acc.daily + pkg.stats.daily,
      weekly: acc.weekly + pkg.stats.weekly,
      monthly: acc.monthly + pkg.stats.monthly,
      allTime: acc.allTime + pkg.stats.allTime,
    }),
    { daily: 0, weekly: 0, monthly: 0, allTime: 0 }
  );

  const hasMultiplePackages = packages.length > 1;

  const StatBox = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border-r border-primary last:border-r-0 flex flex-col justify-center min-w-0">
      <div className="text-[9px] sm:text-[10px] font-mono text-tertiary uppercase tracking-wider mb-2 sm:mb-2.5 whitespace-nowrap truncate">
        {label}
      </div>
      <div className={`text-lg sm:text-2xl font-bold font-mono leading-none ${color} truncate`}>
        {formatNumber(value)}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Selected Package Info */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold font-mono text-primary truncate">
                {selectedPackage.name}
              </h2>
              <a
                href={`https://www.npmjs.com/package/${selectedPackage.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1.5 bg-accent-primary hover:bg-accent-secondary text-white rounded font-mono text-xs transition-colors flex items-center gap-2"
                title="View on npm"
              >
                <LinkOutlined />
                <span className="hidden sm:inline">npm</span>
              </a>
            </div>
            {config.features.showDescriptions && (
              <p className="text-sm text-secondary leading-relaxed">
                {selectedPackage.description}
              </p>
            )}
          </div>
          {config.features.showVersions && (
            <div className="flex-shrink-0 px-4 py-2 bg-card border border-primary rounded font-mono text-sm text-secondary">
              v{selectedPackage.version}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 ${hasMultiplePackages ? 'lg:grid-cols-2' : ''} gap-4 sm:gap-6`}>
        {/* Current Package Stats */}
        <div className="bg-card border border-primary rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-elevated border-b border-primary">
            <div className="text-xs font-mono text-tertiary uppercase tracking-wider font-semibold">
              {hasMultiplePackages ? 'Current Package' : 'Download Statistics'}
            </div>
          </div>
          <div className="flex h-24">
            <StatBox label="Daily Avg" value={selectedPackage.stats.daily} color="text-accent-blue" />
            <StatBox label="Weekly" value={selectedPackage.stats.weekly} color="text-accent-cyan" />
            <StatBox label="Monthly" value={selectedPackage.stats.monthly} color="text-accent-purple" />
            <StatBox label="All Time" value={selectedPackage.stats.allTime} color="text-accent-primary" />
          </div>
        </div>

        {/* Total Stats - Only show if multiple packages */}
        {hasMultiplePackages && (
          <div className="bg-card border border-primary rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-elevated border-b border-primary">
              <div className="text-xs font-mono text-tertiary uppercase tracking-wider font-semibold">
                All Packages Combined
              </div>
            </div>
            <div className="flex h-24">
              <StatBox label="Daily Avg" value={totals.daily} color="text-accent-blue" />
              <StatBox label="Weekly" value={totals.weekly} color="text-accent-cyan" />
              <StatBox label="Monthly" value={totals.monthly} color="text-accent-purple" />
              <StatBox label="All Time" value={totals.allTime} color="text-accent-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
