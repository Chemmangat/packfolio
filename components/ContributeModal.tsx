/**
 * Contribute Modal Component
 * 
 * A professional and humble way to accept contributions for hosting costs.
 */

'use client';

import { Modal, Button, message } from 'antd';
import { HeartOutlined, CopyOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface ContributeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContributeModal({ open, onClose }: ContributeModalProps) {
  const upiId = 'chemmangathari-1@okhdfcbank';
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    message.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      className="contribute-modal"
    >
      <div className="text-center py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-4">
            <HeartOutlined className="text-3xl text-accent-primary" />
          </div>
          <h2 className="text-2xl font-bold font-mono mb-2" style={{ color: '#0a0a0a' }}>
            Support This Project
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: '#525252' }}>
            PackFolio is free and open-source. If you find this tool valuable, 
            you can help cover the hosting and domain costs to keep it running for everyone.
          </p>
        </div>

        {/* QR Code */}
        <div className="mb-6">
          <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
            <img
              src="/upi-qr-code.jpg"
              alt="Official UPI QR Code"
              className="w-48 h-48"
              onError={(e) => {
                // Fallback to generated QR if official image not found
                e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=PackFolio&cu=INR`;
              }}
            />
          </div>
          <p className="text-xs mt-2 font-mono" style={{ color: '#737373' }}>
            Scan with any UPI app
          </p>
        </div>

        {/* UPI ID */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider mb-2 font-mono" style={{ color: '#737373' }}>
            UPI ID
          </p>
          <div className="flex items-center justify-center gap-2">
            <code className="px-4 py-2 rounded-lg font-mono text-sm" style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)'
            }}>
              {upiId}
            </code>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyUPI}
              className="theme-toggle"
              title="Copy UPI ID"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#737373' }}>
            Your contribution helps maintain this service and keep it accessible to the community. 
            Thank you for your support.
          </p>
        </div>
      </div>
    </Modal>
  );
}
