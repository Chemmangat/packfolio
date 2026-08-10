'use client';

import { memo, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { formatNumber, formatCompactNumber } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import type { PackageData } from '@/types';

interface Point {
  country: string;
  lat: number;
  lng: number;
  weight: number;
  downloads: number;
}

const GlobeImpl = dynamic(() => import('./GlobeWrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-tertiary font-mono text-xs">Loading globe...</span>
    </div>
  ),
});

interface DownloadsGlobeProps {
  selectedPackage?: PackageData;
  allPackages: PackageData[];
}

const COUNTRY_WEIGHTS = [
  { country: 'United States',  lat: 37.09,  lng: -95.71,  weight: 0.28 },
  { country: 'Germany',        lat: 51.17,  lng: 10.45,   weight: 0.08 },
  { country: 'United Kingdom', lat: 55.38,  lng: -3.44,   weight: 0.07 },
  { country: 'China',          lat: 35.86,  lng: 104.19,  weight: 0.06 },
  { country: 'France',         lat: 46.23,  lng: 2.21,    weight: 0.05 },
  { country: 'Canada',         lat: 56.13,  lng: -106.35, weight: 0.05 },
  { country: 'India',          lat: 20.59,  lng: 78.96,   weight: 0.05 },
  { country: 'Brazil',         lat: -14.24, lng: -51.93,  weight: 0.04 },
  { country: 'Netherlands',    lat: 52.13,  lng: 5.29,    weight: 0.04 },
  { country: 'Australia',      lat: -25.27, lng: 133.78,  weight: 0.03 },
  { country: 'Japan',          lat: 36.20,  lng: 138.25,  weight: 0.03 },
  { country: 'Russia',         lat: 61.52,  lng: 105.32,  weight: 0.03 },
  { country: 'Sweden',         lat: 60.13,  lng: 18.64,   weight: 0.02 },
  { country: 'Poland',         lat: 51.92,  lng: 19.15,   weight: 0.02 },
  { country: 'South Korea',    lat: 35.91,  lng: 127.77,  weight: 0.02 },
  { country: 'Spain',          lat: 40.46,  lng: -3.75,   weight: 0.02 },
  { country: 'Italy',          lat: 41.87,  lng: 12.57,   weight: 0.02 },
  { country: 'Ukraine',        lat: 48.38,  lng: 31.17,   weight: 0.02 },
  { country: 'Mexico',         lat: 23.63,  lng: -102.55, weight: 0.01 },
  { country: 'Argentina',      lat: -38.42, lng: -63.62,  weight: 0.01 },
  { country: 'Singapore',      lat: 1.35,   lng: 103.82,  weight: 0.01 },
  { country: 'Switzerland',    lat: 46.82,  lng: 8.23,    weight: 0.01 },
  { country: 'Norway',         lat: 60.47,  lng: 8.47,    weight: 0.01 },
  { country: 'Denmark',        lat: 56.26,  lng: 9.50,    weight: 0.01 },
  { country: 'Finland',        lat: 61.92,  lng: 25.75,   weight: 0.01 },
];

function DownloadsGlobe({ selectedPackage, allPackages }: DownloadsGlobeProps) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState<Point | null>(null);
  const [mode, setMode] = useState<'single' | 'combined'>('single');

  const isCombined = mode === 'combined' && allPackages.length > 1;

  const totalDownloads = useMemo(() => {
    if (isCombined) {
      return allPackages.reduce((sum, p) => sum + (p?.stats?.allTime ?? 0), 0);
    }
    return selectedPackage?.stats?.allTime ?? 0;
  }, [isCombined, allPackages, selectedPackage]);

  const label = isCombined
    ? `${allPackages.length} packages combined`
    : (selectedPackage?.name ?? '');

  const pointsData = useMemo<Point[]>(() =>
    COUNTRY_WEIGHTS.map((c) => ({ ...c, downloads: Math.round(totalDownloads * c.weight) })),
    [totalDownloads]
  );

  const maxDownloads = useMemo(
    () => Math.max(...pointsData.map((p) => p.downloads), 1),
    [pointsData]
  );

  if (!selectedPackage && allPackages.length === 0) return null;

  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
        <div>
          <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider">
            Global Download Distribution
          </h3>
          <p className="text-[10px] text-tertiary font-mono mt-1">
            Estimated regional breakdown &mdash; {label}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {allPackages.length > 1 && (
            <div className="flex rounded-lg border border-primary overflow-hidden">
              <button
                onClick={() => setMode('single')}
                className={`globe-toggle ${mode === 'single' ? 'globe-toggle-active' : 'globe-toggle-inactive'}`}
              >
                Single
              </button>
              <button
                onClick={() => setMode('combined')}
                className={`globe-toggle border-l border-primary ${mode === 'combined' ? 'globe-toggle-active' : 'globe-toggle-inactive'}`}
              >
                Combined
              </button>
            </div>
          )}
          {hovered && (
            <div className="text-right">
              <div className="text-xs font-mono text-primary">{hovered.country}</div>
              <div className="text-[10px] font-mono text-accent-primary">
                ~{formatNumber(hovered.downloads)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Globe */}
      <div className="relative flex justify-center overflow-hidden rounded-lg" style={{ height: 380 }}>
        <GlobeImpl
          pointsData={pointsData}
          maxDownloads={maxDownloads}
          hovered={hovered}
          onHover={setHovered}
          theme={theme}
        />
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {[...pointsData]
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 5)
          .map((p) => (
            <div key={p.country} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: `rgba(239,68,68,${0.4 + (p.downloads / maxDownloads) * 0.6})` }}
              />
              <span className="text-[10px] font-mono text-tertiary">
                {p.country} (~{formatCompactNumber(p.downloads)})
              </span>
            </div>
          ))}
        <span className="text-[10px] font-mono text-tertiary">+ {pointsData.length - 5} more</span>
      </div>
    </div>
  );
}

export default memo(DownloadsGlobe);
