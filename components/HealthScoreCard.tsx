/**
 * Health Score Card Component
 * 
 * Displays package health score with visual gauge and breakdown
 */

import { memo } from 'react';
import { Tooltip } from 'antd';
import { RiseOutlined, FallOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { HealthScore } from '@/types';

interface HealthScoreCardProps {
  healthScore: HealthScore;
  packageName: string;
}

function HealthScoreCard({ healthScore, packageName }: HealthScoreCardProps) {
  const { score, trend, factors } = healthScore;
  
  // Score badge background + border style — inline to avoid broken Tailwind v4 opacity modifiers
  const getScoreBadgeStyle = (s: number): React.CSSProperties => {
    if (s >= 80) return { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.30)' };
    if (s >= 60) return { background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.30)' };
    if (s >= 40) return { background: 'rgba(250,204,21,0.12)',  border: '1px solid rgba(250,204,21,0.30)' };
    return             { background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)' };
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 60) return 'text-blue-400';
    if (s >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreStroke = (s: number) => {
    if (s >= 80) return '#4ade80';
    if (s >= 60) return '#60a5fa';
    if (s >= 40) return '#facc15';
    return '#f87171';
  };
  
  const getTrendIcon = (t: HealthScore['trend']) => {
    switch (t) {
      case 'growing': return <RiseOutlined className="text-green-400" />;
      case 'stable': return <CheckCircleOutlined className="text-blue-400" />;
      case 'declining': return <FallOutlined className="text-red-400" />;
      case 'stale': return <ExclamationCircleOutlined className="text-yellow-400" />;
    }
  };

  const getTrendLabel = (t: HealthScore['trend']) => {
    switch (t) {
      case 'growing': return 'Growing';
      case 'stable': return 'Stable';
      case 'declining': return 'Declining';
      case 'stale': return 'Stale';
    }
  };
  
  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-1">
            Health Score
          </h3>
          <p className="text-[10px] font-mono text-tertiary">
            {packageName}
          </p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-elevated border border-primary flex items-center justify-center">
          {getTrendIcon(trend)}
        </div>
      </div>
      
      {/* Score Gauge */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="var(--border-primary)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={getScoreStroke(score)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold font-mono ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-[8px] font-mono text-tertiary">/ 100</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3`}
            style={getScoreBadgeStyle(score)}
          >
            <span className="text-sm">{getTrendIcon(trend)}</span>
            <span className={`text-xs font-mono font-semibold tracking-wide ${getScoreColor(score)}`}>
              {getTrendLabel(trend)}
            </span>
          </div>
          <p className="text-[10px] font-mono text-tertiary leading-relaxed">
            Based on downloads, freshness, popularity &amp; maintenance
          </p>
        </div>
      </div>
      
      {/* Factors Breakdown */}
      <div className="space-y-2">
        <FactorBar label="Download Velocity" value={factors.downloadVelocity} max={25} />
        <FactorBar label="Freshness" value={factors.freshness} max={25} />
        <FactorBar label="Popularity" value={factors.popularity} max={25} />
        <FactorBar label="Maintenance" value={factors.maintenance} max={25} />
      </div>
    </div>
  );
}

interface FactorBarProps {
  label: string;
  value: number;
  max: number;
}

function FactorBar({ label, value, max }: FactorBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <Tooltip title={`${value}/${max} points`}>
      <div className="group cursor-default">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-secondary tracking-wide">{label}</span>
          <span className="text-[10px] font-mono text-tertiary tabular-nums">{value}/{max}</span>
        </div>
        <div className="h-1.5 bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))`,
            }}
          />
        </div>
      </div>
    </Tooltip>
  );
}

export default memo(HealthScoreCard);
