/**
 * Trending Feed Component
 * 
 * Shows trending packages with real-time updates
 */

import { memo } from 'react';
import { RiseOutlined, FireOutlined, LineChartOutlined, ThunderboltOutlined, BarChartOutlined } from '@ant-design/icons';
import type { TrendingPackage } from '@/types';
import { formatCompactNumber } from '@/lib/utils';

interface TrendingFeedProps {
  trending: TrendingPackage[];
}

function TrendingFeed({ trending }: TrendingFeedProps) {
  if (trending.length === 0) {
    return (
      <div className="bg-card border border-primary rounded-lg p-6">
        <h3 className="card-header mb-4">
          Trending Now
        </h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary border border-primary flex items-center justify-center">
            <BarChartOutlined className="text-tertiary text-xl" />
          </div>
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
      case 'hot': return <FireOutlined className="text-red-400" />;
      case 'rising': return <LineChartOutlined className="text-blue-400" />;
      case 'dark-horse': return <ThunderboltOutlined className="text-purple-400" />;
    }
  };
  
  const getCategoryLabel = () => {
    switch (pkg.category) {
      case 'hot': return 'Hot';
      case 'rising': return 'Rising';
      case 'dark-horse': return 'Dark Horse';
    }
  };
  
  const getCategoryStyle = (): React.CSSProperties => {
    switch (pkg.category) {
      case 'hot':        return { background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)' };
      case 'rising':     return { background: 'rgba(96,165,250,0.12)',  border: '1px solid rgba(96,165,250,0.30)' };
      case 'dark-horse': return { background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.30)' };
    }
  };

  const getCategoryTextColor = () => {
    switch (pkg.category) {
      case 'hot':        return 'text-red-400';
      case 'rising':     return 'text-blue-400';
      case 'dark-horse': return 'text-purple-400';
    }
  };
  
  return (
    <div className="group feed-item p-3 transition-all cursor-default">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 text-center">
          <span className="text-xs font-mono font-bold text-tertiary">#{rank}</span>
        </div>
        
        <div className="flex-shrink-0 flex items-center justify-center w-5">
          {getCategoryIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-xs font-mono font-semibold text-primary truncate">
              {pkg.name}
            </h4>
            <div
              className={`flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-mono font-semibold ${getCategoryTextColor()}`}
              style={getCategoryStyle()}
            >
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
