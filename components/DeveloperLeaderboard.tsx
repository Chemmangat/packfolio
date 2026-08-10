/**
 * Developer Leaderboard Component
 * 
 * Shows developer statistics and rankings
 */

import { memo } from 'react';
import { TrophyOutlined, RocketOutlined, StarOutlined, DownloadOutlined, CrownOutlined, RiseOutlined } from '@ant-design/icons';
import type { DeveloperStats } from '@/types';
import { formatCompactNumber } from '@/lib/utils';

interface DeveloperLeaderboardProps {
  stats: DeveloperStats;
}

interface RankBadge {
  icon: React.ReactNode;
  label: string;
  textColor: string;
  style: React.CSSProperties;
}

function DeveloperLeaderboard({ stats }: DeveloperLeaderboardProps) {
  const getRankBadge = (): RankBadge => {
    const { impactScore } = stats;
    if (impactScore > 10000) return {
      icon: <CrownOutlined />, label: 'Legend', textColor: 'text-yellow-400',
      style: { background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.30)' },
    };
    if (impactScore > 1000) return {
      icon: <TrophyOutlined />, label: 'Elite', textColor: 'text-purple-400',
      style: { background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.30)' },
    };
    if (impactScore > 100) return {
      icon: <StarOutlined />, label: 'Pro', textColor: 'text-blue-400',
      style: { background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.30)' },
    };
    if (impactScore > 10) return {
      icon: <RiseOutlined />, label: 'Rising', textColor: 'text-green-400',
      style: { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.30)' },
    };
    return {
      icon: <RocketOutlined />, label: 'Starter', textColor: 'text-secondary',
      style: { background: 'rgba(156,163,175,0.12)', border: '1px solid rgba(156,163,175,0.30)' },
    };
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
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.textColor}`}
            style={badge.style}
          >
            <span className="text-sm">{badge.icon}</span>
            <span className="text-xs font-mono font-semibold">{badge.label}</span>
          </div>
        </div>
      </div>
      
      {/* Impact Score */}
      <div className="rounded-xl p-4 mb-4" style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.05) 100%)',
        border: '1px solid rgba(239,68,68,0.25)',
      }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-secondary uppercase tracking-wider">Impact Score</span>
          <TrophyOutlined className="text-accent-primary" />
        </div>
        <div className="text-3xl font-bold font-mono text-accent-primary tracking-tight">
          {formatCompactNumber(stats.impactScore)}
        </div>
        <p className="text-[10px] font-mono text-tertiary mt-1">
          Weighted by downloads &amp; community stars
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
