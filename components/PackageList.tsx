import type { PackageData } from '@/types';
import { formatCompactNumber } from '@/lib/utils';
import { config } from '@/lib/config';
import { LinkOutlined } from '@ant-design/icons';

interface PackageListProps {
  packages: PackageData[];
  selectedPackage: PackageData;
  onSelect: (pkg: PackageData) => void;
}

/**
 * Package List Component
 * 
 * Displays a list of packages in the sidebar.
 * Allows selection of a package to view details.
 */
export default function PackageList({ packages, selectedPackage, onSelect }: PackageListProps) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-xs font-mono text-secondary uppercase tracking-wider mb-2">
          Packages ({packages.length})
        </div>
      </div>
      
      <div className="space-y-2">
        {packages.map((pkg) => (
          <div key={pkg.name} className="relative group">
            <button
              onClick={() => onSelect(pkg)}
              className={`w-full text-left p-3 rounded border transition-all ${
                selectedPackage.name === pkg.name
                  ? 'bg-accent-primary/20 border-accent-primary shadow-lg'
                  : 'bg-secondary border-primary hover:border-secondary hover:bg-tertiary'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-semibold text-primary mb-1 truncate">
                    {pkg.name}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    {config.features.showVersions && (
                      <span className="text-secondary font-mono">v{pkg.version}</span>
                    )}
                    <span className="text-accent-primary font-mono font-bold">
                      {formatCompactNumber(pkg.stats.allTime)}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://www.npmjs.com/package/${pkg.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 p-1.5 rounded hover:bg-accent-primary/10 transition-colors text-secondary hover:text-accent-primary"
                  title="View on npm"
                >
                  <LinkOutlined className="text-sm" />
                </a>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
