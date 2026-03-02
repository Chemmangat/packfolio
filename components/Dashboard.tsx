/**
 * Dashboard Component
 * 
 * Main dashboard layout with package list, overview, and charts.
 * Fully responsive with mobile-first design.
 */

import { useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { PackageData } from '@/types';
import PackageList from './PackageList';
import OverviewPanel from './OverviewPanel';
import ChartsPanel from './ChartsPanel';

interface DashboardProps {
  packages: PackageData[];
  onLoadMore?: () => void;
  loadingMore?: boolean;
  remainingCount?: number;
}

export default function Dashboard({ packages, onLoadMore, loadingMore, remainingCount }: DashboardProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageData>(packages[0]);
  const [expandedSection, setExpandedSection] = useState<'info' | 'charts'>('charts');

  const toggleSection = (section: 'info' | 'charts') => {
    setExpandedSection(expandedSection === section ? 'charts' : section);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left Sidebar - Package List (accordion on mobile) */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-primary bg-elevated lg:overflow-y-auto lg:max-h-full flex-shrink-0">
        {/* Mobile accordion header for Packages & Overview */}
        <button
          onClick={() => toggleSection('info')}
          className="lg:hidden w-full px-4 py-3 flex items-center justify-between bg-elevated border-b border-primary hover:bg-card transition-colors"
        >
          <span className="font-mono text-sm font-semibold text-primary">PACKAGES & OVERVIEW</span>
          {expandedSection === 'info' ? <UpOutlined className="text-xs" /> : <DownOutlined className="text-xs" />}
        </button>
        
        <div className={`${expandedSection === 'info' ? 'block' : 'hidden'} lg:block`}>
          {/* Package List */}
          <div className="overflow-y-auto max-h-[32vh] lg:max-h-full border-b lg:border-b-0 border-primary">
            <PackageList 
              packages={packages} 
              selectedPackage={selectedPackage}
              onSelect={setSelectedPackage}
              onLoadMore={onLoadMore}
              loadingMore={loadingMore}
              remainingCount={remainingCount}
            />
          </div>
          
          {/* Overview Stats - shown in accordion on mobile */}
          <div className="lg:hidden border-b border-primary bg-secondary">
            <OverviewPanel packages={packages} selectedPackage={selectedPackage} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:overflow-hidden min-h-0">
        {/* Overview Stats - shown separately on desktop */}
        <div className="hidden lg:block border-b border-primary bg-secondary flex-shrink-0">
          <OverviewPanel packages={packages} selectedPackage={selectedPackage} />
        </div>

        {/* Charts and Details (accordion on mobile) */}
        <div className="flex-1 lg:min-h-0">
          {/* Mobile accordion header */}
          <button
            onClick={() => toggleSection('charts')}
            className="lg:hidden w-full px-4 py-3 flex items-center justify-between bg-elevated border-b border-primary hover:bg-card transition-colors"
          >
            <span className="font-mono text-sm font-semibold text-primary">CHARTS</span>
            {expandedSection === 'charts' ? <UpOutlined className="text-xs" /> : <DownOutlined className="text-xs" />}
          </button>
          
          <div className={`${expandedSection === 'charts' ? 'block' : 'hidden'} lg:block h-full`}>
            <ChartsPanel package={selectedPackage} allPackages={packages} />
          </div>
        </div>
      </div>
    </div>
  );
}
