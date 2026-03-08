/**
 * Trending Feed Component
 * 
 * Shows trending packages with real-time updates
 */

import { memo } from 'react';
import { RiseOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons';
import type { TrendingPackage } from '@/types';
import { formatCompactNumber } from '@/lib/utils';

interface TrendingFeedProps {
  trending: TrendingPackage[];
}

function TrendingFeed({ trending }: TrendingFeedProps) {
  if (trending.length === 0) {
    return (
      <div className="bg-card border border-primary rounded-lg p-6">
        <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
          Trending Now
        </h3>
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-xs font-mono text-tertiary">
            No trending packages detected
          </p>
          <p className="text-[10px] font-mono text-tertiary mt-1">
            Requires packages with significant growth
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider">
          Trending Now
        </h3>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-mono text-tertiary">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {trending.map((pkg, idx) => (
          <TrendingItem key={pkg.name} package={pkg} rank={idx + 1} />
        ))}
      </div>
    </div>
  );
}

interface TrendingItemProps {
  package: TrendingPackage;
  rank: number;
}

function TrendingItem({ package: pkg, rank }: TrendingItemProps) {
  const getCategoryIcon = () => {
    switch (pkg.category) {
      case 'hot': return <span className="text-base">🔥</span>;
      case 'rising': return <span className="text-base">📈</span>;
      case 'dark-horse': return <span className="text-base">🌟</span>;
    }
  };
  
  const getCategoryLabel = () => {
    switch (pkg.category) {
      case 'hot': return 'Hot';
      case 'rising': return 'Rising';
      case 'dark-horse': return 'Dark Horse';
    }
  };
  
  const getCategoryColor = () => {
    switch (pkg.category) {
      case 'hot': return 'text-red-400 bg-red-500/15 border border-red-500/30';
      case 'rising': return 'text-blue-400 bg-blue-500/15 border border-blue-500/30';
      case 'dark-horse': return 'text-purple-400 bg-purple-500/15 border border-purple-500/30';
    }
  };
  
  return (
    <div className="group bg-elevated hover:bg-secondary border border-primary rounded-lg p-3 transition-all cursor-default">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 text-center">
          <span className="text-xs font-mono font-bold text-tertiary">#{rank}</span>
        </div>
        
        <div className="flex-shrink-0 text-center">
          {getCategoryIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-xs font-mono font-semibold text-primary truncate">
              {pkg.name}
            </h4>
            <div className={`flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-mono font-semibold ${getCategoryColor()}`}>
              {getCategoryLabel()}
            </div>
          </div>
          
          <p className="text-[10px] font-mono text-tertiary line-clamp-2 mb-2">
            {pkg.description}
          </p>
          
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <div className="flex items-center gap-1 text-green-400">
              <RiseOutlined />
              <span>+{pkg.dailyGrowth}%</span>
            </div>
            <div className="flex items-center gap-1 text-secondary">
              <span>{formatCompactNumber(pkg.weeklyDownloads)}</span>
              <span className="text-tertiary">/ week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TrendingFeed);
