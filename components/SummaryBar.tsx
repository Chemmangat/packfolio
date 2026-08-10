import type { PackageData } from '@/types';

interface SummaryBarProps {
  packages: PackageData[];
}

export default function SummaryBar({ packages }: SummaryBarProps) {
  const totals = packages.reduce(
    (acc, pkg) => ({
      daily:   acc.daily   + pkg.stats.daily,
      weekly:  acc.weekly  + pkg.stats.weekly,
      monthly: acc.monthly + pkg.stats.monthly,
      allTime: acc.allTime + pkg.stats.allTime,
    }),
    { daily: 0, weekly: 0, monthly: 0, allTime: 0 }
  );

  const stats = [
    { label: 'Daily Avg',   value: totals.daily,   color: 'text-blue-400' },
    { label: 'Last Week',   value: totals.weekly,  color: 'text-cyan-400' },
    { label: 'Last Month',  value: totals.monthly, color: 'text-purple-400' },
    { label: 'All Time',    value: totals.allTime, color: 'text-red-400' },
  ];

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `${(n / 1_000).toFixed(1)}K`
    : n.toString();

  return (
    <div className="bg-elevated border border-primary rounded-lg overflow-hidden">
      <div className="grid grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-3 ${i < 3 ? 'border-r border-primary' : ''}`}
          >
            <div className="text-[10px] font-mono text-tertiary uppercase tracking-wider mb-1">
              {s.label}
            </div>
            <div className={`text-lg font-bold font-mono ${s.color}`}>
              {fmt(s.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
