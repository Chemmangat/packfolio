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
      title={<span className="font-sans text-base font-semibold text-gray-900">Legal & API Information</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
      className="legal-modal-professional"
    >
      <div className="space-y-4 text-sm md:max-h-none max-h-[70vh] md:overflow-visible overflow-y-auto md:pr-0 pr-2">
        {/* Data Sources */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1.5">
            Data Sources
          </h3>
          <div className="space-y-2.5 text-xs">
            <div>
              <h4 className="font-semibold text-gray-900 mb-0.5">npm Registry API</h4>
              <p className="text-gray-600 mb-0.5">
                <code className="text-red-600 bg-gray-50 px-1.5 py-0.5 rounded text-[11px] font-mono">
                  https://registry.npmjs.org
                </code>
              </p>
              <p className="text-gray-700">Package search and metadata retrieval.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-0.5">npm Downloads API</h4>
              <p className="text-gray-600 mb-0.5">
                <code className="text-red-600 bg-gray-50 px-1.5 py-0.5 rounded text-[11px] font-mono">
                  https://api.npmjs.org/downloads
                </code>
              </p>
              <p className="text-gray-700">Download statistics and trend analysis.</p>
            </div>
          </div>
        </section>

        {/* Terms of Use */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1.5">
            Terms of Use
          </h3>
          <div className="space-y-2 text-xs">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Data Accuracy:</span> All data is fetched directly from npm's public APIs. PackFolio does not modify, store, or cache any package data.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">No Warranties:</span> This tool is provided "as is" without warranties. Statistics are subject to npm's data accuracy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Rate Limiting:</span> Client-side rate limiting (4 requests/second) respects npm's API limits.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Privacy:</span> No data collection, no cookies, minimal analytics (Vercel Analytics only).
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1.5">
            Disclaimer
          </h3>
          <div className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
            <p>
              PackFolio is independent and <span className="font-semibold text-gray-900">not affiliated with npm, Inc.</span> or GitHub, Inc.
            </p>
            <p>
              All npm package data, trademarks, and logos are property of their respective owners.
            </p>
          </div>
        </section>

        {/* Open Source & Contact */}
        <div className="grid grid-cols-2 gap-4">
          <section>
            <h3 className="text-sm font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1.5">
              Open Source
            </h3>
            <p className="text-xs text-gray-700">
              MIT License. Built with Next.js 15, TypeScript, Tailwind CSS.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2 text-gray-900 border-b border-gray-200 pb-1.5">
              Contact
            </h3>
            <p className="text-xs text-gray-700">
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
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
