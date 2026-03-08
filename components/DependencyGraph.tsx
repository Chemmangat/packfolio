/**
 * Dependency Graph Component
 * 
 * Visual representation of package dependencies
 */

import { memo } from 'react';
import { LinkOutlined, ApiOutlined } from '@ant-design/icons';
import type { DependencyInfo } from '@/types';

interface DependencyGraphProps {
  dependencies: DependencyInfo;
  packageName: string;
}

function DependencyGraph({ dependencies, packageName }: DependencyGraphProps) {
  const { dependencies: deps, dependents } = dependencies;
  
  if (deps.length === 0 && dependents === 0) {
    return (
      <div className="bg-card border border-primary rounded-lg p-6">
        <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
          Dependencies
        </h3>
        <div className="text-center py-8">
          <div className="text-3xl mb-2">🕸️</div>
          <p className="text-xs font-mono text-tertiary">
            No dependencies found
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-primary rounded-lg p-4">
      <h3 className="text-xs font-mono text-tertiary uppercase tracking-wider mb-4">
        Dependencies
      </h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-elevated border border-primary rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ApiOutlined className="text-blue-400" />
            <span className="text-[10px] font-mono text-tertiary uppercase">
              Dependencies
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">
            {deps.length}
          </div>
        </div>
        
        <div className="bg-elevated border border-primary rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <LinkOutlined className="text-green-400" />
            <span className="text-[10px] font-mono text-tertiary uppercase">
              Dependents
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">
            {dependents > 0 ? dependents : 'N/A'}
          </div>
        </div>
      </div>
      
      {/* Visual Graph */}
      {deps.length > 0 && (
        <div className="bg-elevated border border-primary rounded-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              {/* Center node */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center border-2 border-accent-primary shadow-lg">
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-white truncate px-2">
                    {packageName.split('/').pop()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dependencies List */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-mono text-tertiary uppercase tracking-wider mb-2">
              Depends on:
            </div>
            {deps.slice(0, 10).map((dep, idx) => (
              <div
                key={dep}
                className="flex items-center gap-2 bg-card border border-primary rounded px-3 py-2 hover:bg-secondary hover:border-accent-cyan/50 transition-all group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs font-mono text-secondary group-hover:text-primary flex-1 truncate">
                  {dep}
                </span>
              </div>
            ))}
            {deps.length > 10 && (
              <div className="text-center py-2">
                <span className="text-[10px] font-mono text-tertiary">
                  +{deps.length - 10} more dependencies
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(DependencyGraph);
