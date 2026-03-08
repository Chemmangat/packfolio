/**
 * Enhanced Dashboard Component
 * 
 * High-end, minimal dashboard with all advanced features properly sectionized
 */

import { useState, useMemo } from 'react';
import { Tabs } from 'antd';
import { 
  LineChartOutlined, 
  DashboardOutlined, 
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { PackageData } from '@/types';
import PackageList from './PackageList';
import OverviewPanel from './OverviewPanel';
import ChartsPanel from './ChartsPanel';
import HealthScoreCard from './HealthScoreCard';
import TrendingFeed from './TrendingFeed';
import PackageTimeline from './PackageTimeline';
import DeveloperLeaderboard from './DeveloperLeaderboard';
import DownloadHeatmap from './DownloadHeatmap';
import { calculateHealthScore, generateTimeline, calculateDeveloperStats, identifyTrendingPackages } from '@/lib/advancedApi';

interface EnhancedDashboardProps {
  packages: PackageData[];
  onLoadMore?: () => void;
  loadingMore?: boolean;
  remainingCount?: number;
  username?: string;
}

export default function EnhancedDashboard({ 
  packages, 
  onLoadMore, 
  loadingMore, 
  remainingCount,
  username 
}: EnhancedDashboardProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageData>(packages[0]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate advanced features
  const enhancedPackage = useMemo(() => {
    if (!selectedPackage) return null;
    
    const healthScore = calculateHealthScore(selectedPackage);
    const timeline = generateTimeline(selectedPackage);
    
    return {
      ...selectedPackage,
      healthScore,
      timeline,
    };
  }, [selectedPackage]);
  
  const developerStats = useMemo(() => {
    if (!username || packages.length === 0) return null;
    return calculateDeveloperStats(packages, username);
  }, [packages, username]);
  
  const trendingPackages = useMemo(() => {
    return identifyTrendingPackages(packages);
  }, [packages]);
  
  const tabItems = [
    {
      key: 'overview',
      label: (
        <span className="flex items-center gap-2 text-xs font-mono">
          <DashboardOutlined />
          <span className="hidden sm:inline">OVERVIEW</span>
        </span>
      ),
      children: (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Stats Overview */}
            <div className="bg-elevated border border-primary rounded-lg">
              <OverviewPanel packages={packages} selectedPackage={selectedPackage} />
            </div>
            
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Health Score */}
              {enhancedPackage?.healthScore && (
                <HealthScoreCard 
                  healthScore={enhancedPackage.healthScore} 
                  packageName={selectedPackage.name}
                />
              )}
              
              {/* Trending Feed */}
              <TrendingFeed trending={trendingPackages} />
            </div>
            
            {/* Download Heatmap - Full Width */}
            <DownloadHeatmap 
              downloads={selectedPackage.stats.downloads}
              packageName={selectedPackage.name}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'charts',
      label: (
        <span className="flex items-center gap-2 text-xs font-mono">
          <LineChartOutlined />
          <span className="hidden sm:inline">CHARTS</span>
        </span>
      ),
      children: (
        <div className="h-full">
          <ChartsPanel package={selectedPackage} allPackages={packages} />
        </div>
      ),
    },
    {
      key: 'timeline',
      label: (
        <span className="flex items-center gap-2 text-xs font-mono">
          <CalendarOutlined />
          <span className="hidden sm:inline">TIMELINE</span>
        </span>
      ),
      children: (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6">
            {enhancedPackage?.timeline && (
              <PackageTimeline 
                timeline={enhancedPackage.timeline}
                packageName={selectedPackage.name}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'developer',
      label: (
        <span className="flex items-center gap-2 text-xs font-mono">
          <UserOutlined />
          <span className="hidden sm:inline">DEVELOPER</span>
        </span>
      ),
      children: (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6">
            {developerStats ? (
              <DeveloperLeaderboard stats={developerStats} />
            ) : (
              <div className="bg-card border border-primary rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">👤</div>
                <p className="text-xs font-mono text-tertiary">
                  Developer stats not available
                </p>
                <p className="text-[10px] font-mono text-tertiary mt-1">
                  Search by username to see developer statistics
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <div className="h-full flex flex-col lg:flex-row bg-primary">
      {/* Left Sidebar - Package List */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-primary bg-elevated flex-shrink-0">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <PackageList 
            packages={packages} 
            selectedPackage={selectedPackage}
            onSelect={setSelectedPackage}
            onLoadMore={onLoadMore}
            loadingMore={loadingMore}
            remainingCount={remainingCount}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="h-full dashboard-tabs"
          tabBarStyle={{
            marginBottom: 0,
            paddingLeft: '16px',
            paddingRight: '16px',
            borderBottom: '1px solid var(--border-primary)',
            backgroundColor: 'var(--bg-elevated)',
          }}
        />
      </div>
    </div>
  );
}
