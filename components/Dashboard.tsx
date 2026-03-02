/**
 * Dashboard Component
 * 
 * Main dashboard layout with package list, overview, and charts.
 * Fully responsive with mobile-first design.
 */

import { useState } from 'react';
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

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      {/* Left Sidebar - Package List (collapsible on mobile) */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-primary bg-elevated lg:overflow-y-auto max-h-48 lg:max-h-full flex-shrink-0">
        <PackageList 
          packages={packages} 
          selectedPackage={selectedPackage}
          onSelect={setSelectedPackage}
          onLoadMore={onLoadMore}
          loadingMore={loadingMore}
          remainingCount={remainingCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:overflow-hidden min-h-0">
        {/* Overview Stats */}
        <div className="border-b border-primary bg-secondary flex-shrink-0">
          <OverviewPanel packages={packages} selectedPackage={selectedPackage} />
        </div>

        {/* Charts and Details */}
        <div className="flex-1 min-h-0">
          <ChartsPanel package={selectedPackage} allPackages={packages} />
        </div>
      </div>
    </div>
  );
}
