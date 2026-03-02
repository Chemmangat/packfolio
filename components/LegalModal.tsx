/**
 * Legal Modal Component
 * 
 * Displays API usage, data sources, and legal information.
 */

import { Modal } from 'antd';

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LegalModal({ open, onClose }: LegalModalProps) {
  return (
    <Modal
      title={<span className="font-sans text-lg font-semibold text-gray-900">Legal & API Information</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      className="legal-modal-professional"
    >
      <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto pr-2">
        {/* Data Sources */}
        <section>
          <h3 className="text-base font-semibold mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Data Sources
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">npm Registry API</h4>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Endpoint:</span>{' '}
                <code className="text-red-600 bg-gray-50 px-2 py-0.5 rounded text-xs font-mono">
                  https://registry.npmjs.org
                </code>
              </p>
              <p className="text-sm text-gray-700">
                Used for package search and metadata retrieval. This is a public API provided by npm, Inc.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">npm Downloads API</h4>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Endpoint:</span>{' '}
                <code className="text-red-600 bg-gray-50 px-2 py-0.5 rounded text-xs font-mono">
                  https://api.npmjs.org/downloads
                </code>
              </p>
              <p className="text-sm text-gray-700">
                Used for download statistics and trend analysis. This is a public API provided by npm, Inc.
              </p>
            </div>
          </div>
        </section>

        {/* Terms of Use */}
        <section>
          <h3 className="text-base font-semibold mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Terms of Use
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Data Accuracy</p>
              <p className="text-gray-700 leading-relaxed">
                All data is fetched directly from npm's public APIs. PackFolio does not modify, store, or cache any package data. Information is displayed as provided by npm.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">No Warranties</p>
              <p className="text-gray-700 leading-relaxed">
                This tool is provided "as is" without warranties of any kind. Download statistics and package information are subject to npm's data accuracy and availability.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Rate Limiting</p>
              <p className="text-gray-700 leading-relaxed">
                To respect npm's API rate limits, PackFolio implements client-side rate limiting (4 requests per second). Large searches may take time to complete.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Privacy & Data Collection</p>
              <p className="text-gray-700 leading-relaxed">
                PackFolio does not collect, store, or track any user data. No cookies, no personal information, minimal analytics (Vercel Analytics only).
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <h3 className="text-base font-semibold mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Disclaimer
          </h3>
          <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
            <p>
              PackFolio is an independent tool and is <span className="font-semibold text-gray-900">not affiliated with, endorsed by, or sponsored by npm, Inc.</span> or GitHub, Inc.
            </p>
            <p>
              All npm package data, trademarks, and logos are property of their respective owners.
            </p>
            <p>
              This tool is provided for informational purposes only. Users should verify package information on the official npm registry before making decisions.
            </p>
          </div>
        </section>

        {/* Open Source */}
        <section>
          <h3 className="text-base font-semibold mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Open Source
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              PackFolio is open source software released under the MIT License.
            </p>
            <p>
              <span className="font-semibold text-gray-900">Technology Stack:</span> Next.js 15, TypeScript, Tailwind CSS, Ant Design, Recharts
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h3 className="text-base font-semibold mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Contact
          </h3>
          <p className="text-sm text-gray-700">
            For questions, issues, or feedback, please visit{' '}
            <a 
              href="https://chemmangathari.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              chemmangathari.in
            </a>
          </p>
        </section>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
