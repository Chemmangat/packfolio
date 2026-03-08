/**
 * Developer Leaderboard Component
 * 
 * Shows developer statistics and rankings
 */

import { memo } from 'react';
import { TrophyOutlined, RocketOutlined, StarOutlined, DownloadOutlined } from '@ant-design/icons';
import type { DeveloperStats } from '@/types';
import { formatCompactNumber } from '@/lib/utils';

interface DeveloperLeaderboardProps {
  stats: DeveloperStats;
}

function DeveloperLeaderboard({ stats }: DeveloperLeaderboardProps) {
  const getRankBadge = () => {
    const { impactScore } = stats;
    if (impactScore > 10000) return { emoji: '👑', label: 'Legend', color: 'text-yellow-400 bg-yellow-500/15 border border-yellow-500/30' };
    if (impactScore > 1000) return { emoji: '🏆', label: 'Elite', color: 'text-purple-400 bg-purple-500/15 border border-purple-500/30' };
    if (impactScore > 100) return { emoji: '⭐', label: 'Pro', color: 'text-blue-400 bg-blue-500/15 border border-blue-500/30' };
    if (impactScore > 10) return { emoji: '🌟', label: 'Rising', color: 'text-green-400 bg-green-500/15 border border-green-500/30' };
    return { emoji: '🚀', label: 'Starter', color: 'text-gray-400 bg-gray-500/15 border border-gray-500/30' };
  };
  
  const badge = getRankBadge();
  
  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
        Developer Stats
      </h3>
      
      {/* Developer Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-primary">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-2xl font-bold text-white">
          {stats.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-mono font-bold text-primary mb-1">
            {stats.username}
          </h4>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.color}`}>
            <span className="text-base">{badge.emoji}</span>
            <span className="text-xs font-mono font-semibold">
              {badge.label}
            </span>
          </div>
        </div>
      </div>
      
      {/* Impact Score */}
      <div className="bg-gradient-to-br from-accent-primary/15 to-accent-secondary/15 border border-accent-primary/40 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-secondary">Impact Score</span>
          <TrophyOutlined className="text-accent-primary text-lg" />
        </div>
        <div className="text-3xl font-bold font-mono text-accent-primary">
          {formatCompactNumber(stats.impactScore)}
        </div>
        <p className="text-[10px] font-mono text-tertiary mt-1">
          Based on downloads & stars
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<DownloadOutlined />}
          label="Total Downloads"
          value={formatCompactNumber(stats.totalDownloads)}
          color="text-blue-400"
        />
        <StatCard
          icon={<RocketOutlined />}
          label="Packages"
          value={stats.totalPackages.toString()}
          color="text-green-400"
        />
        <StatCard
          icon={<StarOutlined />}
          label="GitHub Stars"
          value={formatCompactNumber(stats.totalStars)}
          color="text-purple-400"
        />
        <StatCard
          icon={<TrophyOutlined />}
          label="Top Package"
          value={stats.topPackage.split('/').pop() || stats.topPackage}
          color="text-yellow-400"
          truncate
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  truncate?: boolean;
}

function StatCard({ icon, label, value, color, truncate }: StatCardProps) {
  return (
    <div className="bg-elevated border border-primary rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-[10px] font-mono text-tertiary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className={`text-lg font-bold font-mono text-primary ${truncate ? 'truncate' : ''}`} title={value}>
        {value}
      </div>
    </div>
  );
}

export default memo(DeveloperLeaderboard);
