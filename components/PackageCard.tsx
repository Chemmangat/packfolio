import { useState } from 'react';
import { Segmented } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StarOutlined, GithubOutlined } from '@ant-design/icons';
import type { PackageData, TimeRange } from '@/types';

interface PackageCardProps {
  package: PackageData;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');

  const chartData = pkg.stats.downloads.slice(-parseInt(timeRange));

  return (
    <div className="bg-card border border-primary rounded-lg p-4 hover:border-secondary transition-colors">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold font-mono text-primary truncate mb-0.5">
              {pkg.name}
            </h3>
            <p className="text-xs text-tertiary font-mono mb-1">v{pkg.version}</p>
            <p className="text-xs text-secondary leading-relaxed line-clamp-2">{pkg.description}</p>
          </div>
          {pkg.githubStars !== undefined && (
            <a
              href={pkg.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-elevated hover:bg-secondary border border-primary rounded-lg font-mono text-xs transition-colors"
              title="View on GitHub"
            >
              <GithubOutlined className="text-secondary" />
              <StarOutlined className="text-yellow-500 text-[10px]" />
              <span className="text-primary font-semibold">
                {pkg.githubStars.toLocaleString()}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 mb-4 bg-elevated border border-primary rounded-lg overflow-hidden">
        {[
          { label: 'Daily', value: pkg.stats.daily, color: 'text-blue-400' },
          { label: 'Weekly', value: pkg.stats.weekly, color: 'text-cyan-400' },
          { label: 'Monthly', value: pkg.stats.monthly, color: 'text-purple-400' },
          { label: 'All Time', value: pkg.stats.allTime, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={stat.label} className={`px-2 py-3 text-center ${i < 3 ? 'border-r border-primary' : ''}`}>
            <div className="text-[9px] font-mono text-tertiary uppercase tracking-wider mb-1">{stat.label}</div>
            <div className={`text-sm font-bold font-mono ${stat.color}`}>
              {stat.value >= 1_000_000
                ? `${(stat.value / 1_000_000).toFixed(1)}M`
                : stat.value >= 1_000
                ? `${(stat.value / 1_000).toFixed(1)}K`
                : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Time range selector */}
      <div className="mb-3">
        <Segmented
          options={[
            { label: '7D', value: '7' },
            { label: '30D', value: '30' },
            { label: '90D', value: '90' },
            { label: '1Y', value: '365' },
          ]}
          value={timeRange}
          onChange={(value) => setTimeRange(value as TimeRange)}
          block
          size="small"
        />
      </div>

      {/* Chart */}
      <div className="h-40">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9, fill: 'var(--chart-axis)', fontFamily: 'monospace' }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                stroke="var(--border-primary)"
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'var(--chart-axis)', fontFamily: 'monospace' }}
                stroke="var(--border-primary)"
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--chart-tooltip-bg)',
                  border: '1px solid var(--chart-tooltip-border)',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
                labelStyle={{ color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-secondary)' }}
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
                formatter={(v: number | undefined) => [v?.toLocaleString() ?? '0', 'Downloads']}
              />
              <Line
                type="monotone"
                dataKey="downloads"
                stroke="var(--accent-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs font-mono text-tertiary">No download data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
