/**
 * Package Timeline Component
 * 
 * Visual timeline of package milestones and releases
 */

import { memo } from 'react';
import { RocketOutlined, TrophyOutlined, StarOutlined } from '@ant-design/icons';
import type { PackageTimeline as TimelineType } from '@/types';
import { formatCompactNumber, formatRelativeTime } from '@/lib/utils';

interface PackageTimelineProps {
  timeline: TimelineType;
  packageName: string;
}

function PackageTimeline({ timeline, packageName }: PackageTimelineProps) {
  if (timeline.events.length === 0) {
    return (
      <div className="bg-card border border-primary rounded-lg p-6">
        <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
          Package Timeline
        </h3>
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-xs font-mono text-tertiary">
            No timeline events available
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
        Package Timeline
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border-primary" />
        
        <div className="space-y-4">
          {timeline.events.map((event, idx) => (
            <TimelineEvent key={idx} event={event} isLast={idx === timeline.events.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimelineEventProps {
  event: TimelineType['events'][0];
  isLast: boolean;
}

function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const getIcon = () => {
    switch (event.type) {
      case 'release':
        return <RocketOutlined className="text-blue-400" />;
      case 'milestone':
        return <TrophyOutlined className="text-yellow-400" />;
      case 'star-milestone':
        return <StarOutlined className="text-purple-400" />;
    }
  };
  
  const getIconBg = () => {
    switch (event.type) {
      case 'release':
        return 'bg-blue-500/15 border-blue-500/40';
      case 'milestone':
        return 'bg-yellow-500/15 border-yellow-500/40';
      case 'star-milestone':
        return 'bg-purple-500/15 border-purple-500/40';
    }
  };
  
  return (
    <div className="relative flex gap-3 group">
      {/* Icon */}
      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 ${getIconBg()} flex items-center justify-center bg-card`}>
        {getIcon()}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="bg-elevated group-hover:bg-secondary border border-primary rounded-lg p-3 transition-all">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-xs font-mono font-semibold text-primary">
              {event.title}
            </h4>
            {event.date && (
              <span className="text-[9px] font-mono text-tertiary flex-shrink-0">
                {formatRelativeTime(event.date)}
              </span>
            )}
          </div>
          
          <p className="text-[10px] font-mono text-secondary">
            {event.description}
          </p>
          
          {(event.downloads || event.stars) && (
            <div className="mt-2 flex items-center gap-3 text-[10px] font-mono">
              {event.downloads && (
                <span className="text-accent-primary font-semibold">
                  {formatCompactNumber(event.downloads)} downloads
                </span>
              )}
              {event.stars && (
                <span className="text-purple-400 font-semibold">
                  {formatCompactNumber(event.stars)} stars
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(PackageTimeline);
