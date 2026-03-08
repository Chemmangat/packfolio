/**
 * Download Heatmap Component
 * 
 * GitHub-style contribution calendar for package downloads
 */

import { memo, useMemo } from 'react';
import { Tooltip } from 'antd';
import type { DailyDownload } from '@/types';
import { formatNumber, formatFullDate } from '@/lib/utils';

interface DownloadHeatmapProps {
  downloads: DailyDownload[];
  packageName: string;
}

function DownloadHeatmap({ downloads, packageName }: DownloadHeatmapProps) {
  // Get last 365 days of data
  const heatmapData = useMemo(() => {
    const last365 = downloads.slice(-365);
    
    if (last365.length === 0) return [];
    
    // Calculate intensity levels
    const downloadCounts = last365.map(d => d.downloads);
    const max = Math.max(...downloadCounts);
    const min = Math.min(...downloadCounts);
    
    return last365.map(day => {
      const normalized = max > min ? (day.downloads - min) / (max - min) : 0.5;
      let level = 0;
      if (normalized > 0.75) level = 4;
      else if (normalized > 0.5) level = 3;
      else if (normalized > 0.25) level = 2;
      else if (normalized > 0) level = 1;
      
      return {
        ...day,
        level,
      };
    });
  }, [downloads]);
  
  // Group by weeks and months
  const { weeks, monthLabels } = useMemo(() => {
    type DayData = typeof heatmapData[0];
    const result: DayData[][] = [];
    let currentWeek: DayData[] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    heatmapData.forEach((day: DayData, idx: number) => {
      const date = new Date(day.day);
      const dayOfWeek = date.getDay();
      const month = date.getMonth();
      
      // Track month changes
      if (month !== lastMonth && dayOfWeek === 0) {
        months.push({
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: result.length,
        });
        lastMonth = month;
      }
      
      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return { weeks: result, monthLabels: months };
  }, [heatmapData]);
  
  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-[#2d2d2d]'; // Visible empty state
      case 1: return 'bg-[#ef444433]'; // 20% opacity
      case 2: return 'bg-[#ef444466]'; // 40% opacity
      case 3: return 'bg-[#ef444499]'; // 60% opacity
      case 4: return 'bg-[#ef4444]'; // Full opacity
      default: return 'bg-[#2d2d2d]';
    }
  };
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (heatmapData.length === 0) {
    return (
      <div className="bg-card border border-primary rounded-lg p-6">
        <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
          Download Heatmap
        </h3>
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-xs font-mono text-tertiary">
            No download data available
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider">
            Download Activity
          </h3>
          <p className="text-[10px] text-tertiary font-mono mt-1">
            {heatmapData.length} days of download history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-tertiary">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#2d2d2d] border border-[#3d3d3d]" />
            <div className="w-3 h-3 rounded-sm bg-[#ef444433] border border-[#ef444450]" />
            <div className="w-3 h-3 rounded-sm bg-[#ef444466] border border-[#ef444470]" />
            <div className="w-3 h-3 rounded-sm bg-[#ef444499] border border-[#ef444490]" />
            <div className="w-3 h-3 rounded-sm bg-[#ef4444] border border-[#ef4444]" />
          </div>
          <span className="text-[10px] font-mono text-tertiary">More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 ml-8">
            {monthLabels.map((month, idx) => (
              <div
                key={idx}
                className="text-[9px] font-mono text-tertiary"
                style={{ 
                  marginLeft: idx === 0 ? 0 : `${(month.weekIndex - (monthLabels[idx - 1]?.weekIndex || 0)) * 13}px`,
                }}
              >
                {month.label}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] justify-around pr-2">
              {[1, 3, 5].map(dayIdx => (
                <div key={dayIdx} className="text-[9px] font-mono text-tertiary h-3 flex items-center">
                  {dayLabels[dayIdx]}
                </div>
              ))}
            </div>
            
            {/* Weeks */}
            {weeks.map((week: typeof heatmapData[0][], weekIdx: number) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const day = week.find((d: typeof heatmapData[0]) => {
                    const date = new Date(d.day);
                    return date.getDay() === dayIdx;
                  });
                  
                  if (!day) {
                    return (
                      <div
                        key={dayIdx}
                        className="w-3 h-3 rounded-sm bg-transparent"
                      />
                    );
                  }
                  
                  return (
                    <Tooltip
                      key={dayIdx}
                      title={
                        <div className="text-[10px] font-mono">
                          <div className="font-semibold mb-1">{formatFullDate(day.day)}</div>
                          <div className="text-accent-primary">{formatNumber(day.downloads)} downloads</div>
                        </div>
                      }
                    >
                      <div
                        className={`w-3 h-3 rounded-sm ${getColor(day.level)} border border-[#3d3d3d] hover:ring-2 hover:ring-accent-primary hover:scale-110 transition-all cursor-default`}
                      />
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DownloadHeatmap);
