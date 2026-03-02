import { useState, useMemo, memo } from 'react';
import { Tabs } from 'antd';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PackageData, TimeRange } from '@/types';
import { config } from '@/lib/config';
import { chartColors } from '@/lib/theme';

interface ChartsPanelProps {
  package: PackageData;
  allPackages: PackageData[];
}

function ChartsPanel({ package: pkg, allPackages }: ChartsPanelProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [showAllPackages, setShowAllPackages] = useState(false);

  // Memoize chart data calculations
  const chartData = useMemo(() => {
    const days = parseInt(timeRange);
    return pkg.stats.downloads.slice(-days);
  }, [pkg.stats.downloads, timeRange]);

  const comparisonData = useMemo(() => {
    const days = parseInt(timeRange);
    const allDates = new Set<string>();
    
    const packagesToCompare = showAllPackages 
      ? allPackages 
      : allPackages.slice(0, config.ui.maxComparisonPackages);
    
    packagesToCompare.forEach(p => {
      p.stats.downloads.slice(-days).forEach(d => allDates.add(d.day));
    });

    const sortedDates = Array.from(allDates).sort();
    
    return sortedDates.map(date => {
      const dataPoint: any = { day: date };
      packagesToCompare.forEach(p => {
        const download = p.stats.downloads.find(d => d.day === date);
        dataPoint[p.name] = download?.downloads || 0;
      });
      return dataPoint;
    });
  }, [allPackages, timeRange, showAllPackages]);

  // Memoize distribution data
  const distributionData = useMemo(() => {
    return allPackages
      .sort((a, b) => b.stats.allTime - a.stats.allTime)
      .slice(0, 20)
      .map(p => ({
        name: p.name.split('/').pop() || p.name,
        fullName: p.name,
        downloads: p.stats.allTime
      }));
  }, [allPackages]);

  // Format dates based on time range
  const formatXAxisDate = (value: string) => {
    const date = new Date(value);
    const days = parseInt(timeRange);
    
    if (days >= 365) {
      // For 1 year, show month/year
      return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
    } else if (days >= 90) {
      // For 90 days, show month/day
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      // For shorter ranges, show month/day
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  const colors = chartColors;

  const TimeRangeButtons = () => (
    <div className="flex flex-wrap gap-2">
      {[
        { label: '7D', value: '7' },
        { label: '30D', value: '30' },
        { label: '90D', value: '90' },
        { label: '1Y', value: '365' },
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => setTimeRange(option.value as TimeRange)}
          className={`px-3 sm:px-4 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
            timeRange === option.value
              ? 'bg-accent-primary border-accent-primary text-white shadow-lg'
              : 'bg-elevated border-primary text-secondary hover:border-secondary hover:text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const tabItems = [
    {
      key: 'trend',
      label: <span className="font-mono text-xs">TREND</span>,
      children: (
        <div className="h-full p-4 sm:p-6 bg-card flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 flex-shrink-0">
            <div>
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider font-semibold">
                Download Trend
              </h3>
              <p className="text-xs text-tertiary font-mono mt-1">
                Daily downloads over time for {pkg.name}
              </p>
            </div>
            <TimeRangeButtons />
          </div>
          <div className="flex-1 min-h-0 h-[300px] lg:h-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.5} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={formatXAxisDate}
                  stroke="var(--border-primary)"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'monospace' }}
                  stroke="var(--border-primary)"
                  width={50}
                />
                <Tooltip
                  position={{ y: 0 }}
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    border: '1px solid var(--chart-tooltip-border)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--text-secondary)' }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number | undefined) => [value?.toLocaleString() || '0', 'Downloads']}
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#colorDownloads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
    {
      key: 'comparison',
      label: <span className="font-mono text-xs">COMPARISON</span>,
      children: (
        <div className="h-full p-4 sm:p-6 bg-card flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 flex-shrink-0">
            <div>
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider font-semibold">
                Package Comparison
              </h3>
              <p className="text-xs text-tertiary font-mono mt-1">
                Compare download trends across {showAllPackages ? allPackages.length : Math.min(allPackages.length, config.ui.maxComparisonPackages)} package{allPackages.length > 1 ? 's' : ''}
                {allPackages.length > config.ui.maxComparisonPackages && !showAllPackages && (
                  <button 
                    onClick={() => setShowAllPackages(true)}
                    className="ml-2 text-accent-primary hover:underline cursor-pointer"
                  >
                    (show all {allPackages.length})
                  </button>
                )}
                {showAllPackages && allPackages.length > config.ui.maxComparisonPackages && (
                  <button 
                    onClick={() => setShowAllPackages(false)}
                    className="ml-2 text-accent-primary hover:underline cursor-pointer"
                  >
                    (show top {config.ui.maxComparisonPackages})
                  </button>
                )}
              </p>
            </div>
            <TimeRangeButtons />
          </div>
          <div className="flex-1 min-h-0 h-[300px] lg:h-auto">
            {allPackages.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.5} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={formatXAxisDate}
                    stroke="var(--border-primary)"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="var(--border-primary)"
                    width={50}
                  />
                  <Tooltip
                    position={{ y: 0 }}
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{
                      backgroundColor: 'var(--chart-tooltip-bg)',
                      border: '1px solid var(--chart-tooltip-border)',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    itemStyle={{ color: 'var(--text-secondary)' }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontFamily: 'monospace', 
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      maxHeight: '80px',
                      overflowY: 'auto'
                    }}
                    iconType="line"
                  />
                  {(showAllPackages ? allPackages : allPackages.slice(0, config.ui.maxComparisonPackages)).map((p, idx) => (
                    <Line
                      key={p.name}
                      type="monotone"
                      dataKey={p.name}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-secondary font-mono text-sm">
                    Comparison requires multiple packages
                  </p>
                  <p className="text-tertiary font-mono text-xs mt-2">
                    Search for a username to see multiple packages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'distribution',
      label: <span className="font-mono text-xs">DISTRIBUTION</span>,
      children: (
        <div className="h-full p-4 sm:p-6 bg-card flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 flex-shrink-0">
            <div>
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider font-semibold">
                Total Downloads Distribution
              </h3>
              <p className="text-xs text-tertiary font-mono mt-1">
                Top {Math.min(distributionData.length, 20)} packages ranked by all-time downloads
                {allPackages.length > 20 && (
                  <span className="text-tertiary"> (showing {distributionData.length} of {allPackages.length})</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-0 h-[400px] lg:h-auto">
            {allPackages.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={distributionData}
                  layout="vertical"
                  margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.5} />
                  <XAxis 
                    type="number"
                    tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="var(--border-primary)"
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'var(--chart-axis)', fontSize: 9, fontFamily: 'monospace' }}
                    stroke="var(--border-primary)"
                    width={100}
                  />
                  <Tooltip
                    position={{ x: 0 }}
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{
                      backgroundColor: 'var(--chart-tooltip-bg)',
                      border: '1px solid var(--chart-tooltip-border)',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    itemStyle={{ color: 'var(--text-secondary)' }}
                    formatter={(value: number | undefined, name?: string, props?: any) => [
                      value?.toLocaleString() || '0', 
                      props?.payload?.fullName || name || 'Downloads'
                    ]}
                  />
                  <Bar dataKey="downloads" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-secondary font-mono text-sm">
                    Distribution requires multiple packages
                  </p>
                  <p className="text-tertiary font-mono text-xs mt-2">
                    Search for a username to see multiple packages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full bg-card lg:overflow-hidden">
      <Tabs
        items={tabItems}
        className="h-full charts-tabs"
        tabBarStyle={{
          marginBottom: 0,
          paddingLeft: '24px',
          borderBottom: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-elevated)'
        }}
      />
    </div>
  );
}


// Export memoized component to prevent unnecessary re-renders
export default memo(ChartsPanel);
