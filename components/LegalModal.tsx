/**
 * Legal Modal Component
 *
 * Comprehensive Terms & Conditions, data source disclosures,
 * and important notices every developer needs to know.
 */

import { Modal } from 'antd';
import {
  DatabaseOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  EyeInvisibleOutlined,
  WarningOutlined,
  GlobalOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <span className="text-red-600">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function LegalModal({ open, onClose }: LegalModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileProtectOutlined className="text-red-600" />
          <span className="font-semibold text-gray-900 text-base">Terms, Conditions & Data Disclosures</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      className="legal-modal-professional"
    >
      <div className="space-y-6 text-sm max-h-[72vh] overflow-y-auto pr-1">

        {/* Effective Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-gray-50 rounded-lg px-4 py-2.5">
          <ClockCircleOutlined />
          <span>Effective as of 2025 · Last reviewed July 2025</span>
        </div>

        {/* Acceptance */}
        <Section icon={<SafetyOutlined />} title="Acceptance of Terms">
          <p className="text-xs text-gray-700 leading-relaxed">
            By accessing or using Packfolio ("the Service"), you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, please discontinue use of the Service immediately.
            Packfolio reserves the right to update these terms at any time without prior notice.
          </p>
        </Section>

        {/* Data Sources */}
        <Section icon={<DatabaseOutlined />} title="Data Sources & Collection Method">
          <div className="space-y-3 text-xs">
            <p className="text-gray-700 leading-relaxed">
              All data displayed by Packfolio is retrieved in real time from the following official public APIs. 
              Packfolio does not maintain its own database, does not store package data, and does not cache any statistics.
            </p>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start gap-2">
                  <ApiOutlined className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">npm Registry API</p>
                    <code className="text-red-600 text-[11px]">https://registry.npmjs.org</code>
                    <p className="text-gray-600 mt-1">Package metadata, versioning, description, author, and repository information.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start gap-2">
                  <ApiOutlined className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">npm Downloads API</p>
                    <code className="text-red-600 text-[11px]">https://api.npmjs.org/downloads</code>
                    <p className="text-gray-600 mt-1">Daily, weekly, monthly, and all-time download counts. Data covers up to 365 days of history per package.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start gap-2">
                  <ApiOutlined className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">GitHub Stars (Shields.io / GitHub API)</p>
                    <code className="text-red-600 text-[11px]">https://img.shields.io · https://api.github.com</code>
                    <p className="text-gray-600 mt-1">Repository star counts fetched via Shields.io with GitHub API as fallback. Subject to GitHub rate limits.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Download Count Disclaimer — CRITICAL for developers */}
        <Section icon={<WarningOutlined />} title="Important: What Download Counts Actually Mean">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-xs">
            <p className="text-amber-900 font-semibold">Developers must understand this before interpreting statistics.</p>
            <p className="text-amber-800 leading-relaxed">
              npm download counts represent <strong>installation events</strong>, not unique users or active projects. 
              The counts include, but are not limited to:
            </p>
            <ul className="text-amber-800 space-y-1 list-disc list-inside ml-1">
              <li>CI/CD pipeline installations (often the majority for popular packages)</li>
              <li>Mirror and proxy server pulls</li>
              <li>Automated dependency managers (Renovate, Dependabot, etc.)</li>
              <li>Developer installs across multiple machines and environments</li>
              <li>Bot and crawler activity</li>
              <li>Re-installs after cache invalidation</li>
            </ul>
            <p className="text-amber-800 leading-relaxed mt-1">
              This is a known and widely acknowledged limitation of npm's public download statistics, 
              not specific to Packfolio. <strong>Use these numbers as relative trend indicators, 
              not as measures of actual user adoption.</strong>
            </p>
          </div>
        </Section>

        {/* Geographic Distribution Disclaimer */}
        <Section icon={<GlobalOutlined />} title="Geographic Distribution — Estimated Data">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs space-y-2">
            <p className="text-blue-900 font-semibold">The geographic globe visualization shows estimated data.</p>
            <p className="text-blue-800 leading-relaxed">
              npm's public API does not expose per-country download data. The regional breakdown 
              displayed on the globe is calculated by applying a static set of developer-population 
              weights to the package's total download count. <strong>Every package uses the same 
              regional distribution model</strong> — the breakdown does not reflect actual geographic 
              origin of downloads for any individual package.
            </p>
            <p className="text-blue-800 leading-relaxed">
              All country figures are prefixed with "~" (approximately) to reflect this. 
              Geographic accuracy improvements are planned for a future release.
            </p>
          </div>
        </Section>

        {/* Health Score Methodology */}
        <Section icon={<InfoCircleOutlined />} title="Health Score Methodology">
          <p className="text-xs text-gray-700 leading-relaxed mb-2">
            The Package Health Score (0–100) is a heuristic computed entirely client-side from available data. 
            It is not an official npm metric. The score combines four equally weighted factors (25 points each):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Download Velocity', desc: 'Week-over-week growth rate of daily downloads' },
              { label: 'Freshness', desc: 'Days since the latest version was published to npm' },
              { label: 'Popularity', desc: 'Total all-time download volume on a logarithmic scale' },
              { label: 'Maintenance', desc: 'GitHub star count as a proxy for community engagement' },
            ].map((f) => (
              <div key={f.label} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                <p className="font-semibold text-gray-900 mb-0.5">{f.label}</p>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            The health score is informational only and should not be used as the sole basis for 
            package selection or security decisions.
          </p>
        </Section>

        {/* Rate Limiting */}
        <Section icon={<ClockCircleOutlined />} title="Rate Limiting & Fair Use">
          <p className="text-xs text-gray-700 leading-relaxed">
            Packfolio implements client-side rate limiting (up to 4 requests per second) to respect npm's 
            public API usage guidelines. Excessive automated usage of this tool to scrape npm data at scale 
            is prohibited. All API calls are made directly from your browser to npm's servers — 
            no server-side proxying or caching is performed by Packfolio.
          </p>
        </Section>

        {/* Privacy */}
        <Section icon={<EyeInvisibleOutlined />} title="Privacy & Data Collection">
          <div className="text-xs text-gray-700 space-y-2">
            <p className="leading-relaxed">
              <span className="font-semibold text-gray-900">No user data is collected</span> by Packfolio itself. 
              Search queries are stored only in your browser's <code className="bg-gray-100 px-1 rounded">localStorage</code> for 
              recent-search history and are never transmitted to Packfolio servers.
            </p>
            <p className="leading-relaxed">
              Packfolio uses <span className="font-semibold text-gray-900">Vercel Analytics and Speed Insights</span> for 
              anonymous, aggregated performance and usage metrics. These services operate under 
              Vercel's privacy policy and do not collect personally identifiable information.
            </p>
            <p className="leading-relaxed">
              No cookies are set by Packfolio. Theme preferences are stored in <code className="bg-gray-100 px-1 rounded">localStorage</code> only.
            </p>
          </div>
        </Section>

        {/* Disclaimer & No Warranties */}
        <Section icon={<WarningOutlined />} title="Disclaimer & No Warranties">
          <div className="text-xs text-gray-700 space-y-2">
            <p className="leading-relaxed">
              The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without any warranties 
              of any kind, either express or implied, including but not limited to implied warranties of 
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p className="leading-relaxed">
              Packfolio does not guarantee the accuracy, completeness, timeliness, or reliability of 
              any statistics displayed. Data accuracy is subject to npm's own API accuracy, 
              availability, and any changes npm may make to their data pipeline.
            </p>
            <p className="leading-relaxed">
              Packfolio shall not be liable for any direct, indirect, incidental, or consequential 
              damages arising from your use of or reliance on the Service.
            </p>
          </div>
        </Section>

        {/* Affiliations */}
        <Section icon={<CodeOutlined />} title="Open Source & Affiliations">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Independence</p>
              <p className="leading-relaxed">
                Packfolio is an independent project and is <strong>not affiliated with npm, Inc., GitHub, Inc., 
                or Microsoft Corporation.</strong> All npm trademarks, logos, and package data are the 
                property of their respective owners.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">License</p>
              <p className="leading-relaxed">
                Packfolio is open source, released under the <strong>MIT License</strong>. 
                Built with Next.js, TypeScript, Tailwind CSS, Ant Design, and Recharts.
              </p>
              <p className="mt-2">
                <a
                  href="https://chemmangathari.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline font-medium"
                >
                  chemmangathari.in
                </a>
              </p>
            </div>
          </div>
        </Section>

        {/* Close */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            I understand
          </button>
        </div>

      </div>
    </Modal>
  );
}
