'use client';

/**
 * Contribute Modal Component
 * 
 * An ultra-premium, theme-aware donation modal.
 * Clean, spacious, and professionally crafted.
 */

import { Modal, Button, message } from 'antd';
import { HeartOutlined, CopyOutlined, CheckOutlined, QrcodeOutlined } from '@ant-design/icons';
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
    message.success({
      content: 'UPI ID copied to clipboard!',
      duration: 2,
      style: { borderRadius: 8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      className="contribute-modal"
      style={{ 
        borderRadius: 20,
        overflow: 'hidden',
      }}
      bodyStyle={{ padding: 0, background: 'transparent' }}
      maskStyle={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)' }}
    >
      <div 
        className="p-8"
        style={{ 
          background: 'var(--bg-primary)',
          borderRadius: 20,
          border: '1px solid var(--border-primary)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}
      >
        {/* Decorative top accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, var(--accent-primary), #f59e0b, var(--accent-primary))',
            backgroundSize: '200% 100%',
            animation: 'gradientMove 3s ease infinite',
            borderRadius: '20px 20px 0 0',
          }}
        />

        {/* Icon */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent-primary), #dc2626)',
              boxShadow: '0 8px 24px rgba(239,68,68,0.25)',
            }}
          >
            <HeartOutlined className="text-3xl text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-semibold font-mono tracking-tight mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Support PackFolio
          </h2>
          <p 
            className="text-sm font-mono leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Free and open source. Your contribution helps cover hosting and domain costs.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div 
            className="p-3 rounded-2xl"
            style={{ 
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <img
              src="/upi-qr-code.jpg"
              alt="UPI QR Code for donation"
              className="w-44 h-44 rounded-xl"
              onError={(e) => {
                e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=PackFolio&cu=INR`;
              }}
              style={{ display: 'block' }}
            />
          </div>
        </div>

        {/* UPI ID with copy */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3">
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-sm"
              style={{ 
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <QrcodeOutlined style={{ color: 'var(--text-tertiary)', fontSize: 14 }} />
              <code 
                className="font-mono text-sm truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {upiId}
              </code>
            </div>
            <Button
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopyUPI}
              className="theme-toggle"
              style={{
                height: 42,
                padding: '0 18px',
                borderRadius: 10,
                borderColor: 'var(--border-primary)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: 13,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center pt-4 border-t border-primary">
          <p 
            className="text-xs font-mono leading-relaxed"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Every contribution, no matter the size, helps keep this service running.
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>Thank you for your generosity.</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .contribute-modal .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }
        .contribute-modal .ant-modal-close {
          top: 16px;
          right: 16px;
          color: var(--text-secondary);
        }
        .contribute-modal .ant-modal-close:hover {
          color: var(--text-primary);
        }
      `}</style>
    </Modal>
  );
}