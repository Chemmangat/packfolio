/**
 * Download Heatmap Component
 * 
 * GitHub-style contribution calendar for package downloads
 */

import { memo, useMemo } from 'react';
import { Tooltip } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
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
      case 0: return 'heatmap-cell-0';
      case 1: return 'heatmap-cell-1';
      case 2: return 'heatmap-cell-2';
      case 3: return 'heatmap-cell-3';
      case 4: return 'heatmap-cell-4';
      default: return 'heatmap-cell-0';
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
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary border border-primary flex items-center justify-center">
            <CalendarOutlined className="text-tertiary text-xl" />
          </div>
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
            <div className="heatmap-cell-0 w-3 h-3 rounded-sm" />
            <div className="heatmap-cell-1 w-3 h-3 rounded-sm" />
            <div className="heatmap-cell-2 w-3 h-3 rounded-sm" />
            <div className="heatmap-cell-3 w-3 h-3 rounded-sm" />
            <div className="heatmap-cell-4 w-3 h-3 rounded-sm" />
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
                        className={`w-3 h-3 rounded-sm ${getColor(day.level)} hover:ring-1 hover:ring-accent-primary hover:scale-110 transition-transform duration-100 cursor-default`}
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
