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
}

export default function Dashboard({ packages }: DashboardProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageData>(packages[0]);

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left Sidebar - Package List (collapsible on mobile) */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-primary bg-elevated overflow-y-auto max-h-48 lg:max-h-full">
        <PackageList 
          packages={packages} 
          selectedPackage={selectedPackage}
          onSelect={setSelectedPackage}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Overview Stats */}
        <div className="border-b border-primary bg-secondary overflow-y-auto">
          <OverviewPanel packages={packages} selectedPackage={selectedPackage} />
        </div>

        {/* Charts and Details */}
        <div className="flex-1 overflow-hidden">
          <ChartsPanel package={selectedPackage} allPackages={packages} />
        </div>
      </div>
    </div>
  );
}
