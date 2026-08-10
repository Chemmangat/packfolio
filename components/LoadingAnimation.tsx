/**
 * Loading Animation Component
 * 
 * A minimal and professional loading animation with terminal-style output.
 */

'use client';

import { useEffect, useState } from 'react';

const loadingMessages = [
  '> Initializing package scanner...',
  '> Connecting to registry...',
  '> Fetching package metadata...',
  '> Analyzing download statistics...',
  '> Crunching numbers...',
  '> Almost there...',
];

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // If we've shown all messages and there's a completion callback, call it
    if (messageIndex >= loadingMessages.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messageIndex, onComplete]);

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 250);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 250);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  // Speed up animation if needed
  useEffect(() => {
    if (onComplete) {
      // Already fast
    }
  }, [onComplete]);

  return (
    <div className="h-full flex items-center justify-center bg-primary">
      <div className="text-center w-full max-w-md px-4">
        {/* Minimal Spinner */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-accent-primary opacity-5 rounded-full blur-2xl scale-150"></div>
          
          {/* Simple rotating ring */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full opacity-20" style={{ border: '2px solid var(--border-primary)' }}></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-accent-primary rounded-full animate-spin"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 text-accent-primary opacity-60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
                  <path d="M16.5 9.4 7.55 4.24"/>
                  <polyline points="3.29 7 12 12 20.71 7"/>
                  <line x1="12" x2="12" y1="22" y2="12"/>
                  <circle cx="18.5" cy="15.5" r="2.5"/>
                  <path d="M20.27 17.27 22 19"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal output */}
        <div className="bg-card border border-primary rounded-lg p-4 font-mono text-left shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary opacity-50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-60"></div>
            </div>
            <span className="text-[10px] text-tertiary uppercase tracking-wider">terminal</span>
          </div>
          
          {/* Fixed height container */}
          <div className="h-40 overflow-hidden">
            <div className="space-y-1.5 text-xs">
              {loadingMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-150 flex items-center gap-2 ${
                    idx <= messageIndex 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className={idx === messageIndex ? 'text-accent-primary' : 'text-secondary'}>
                    {msg}
                  </span>
                  {idx === messageIndex && (
                    <span className="inline-block w-6 text-accent-primary">{dots}</span>
                  )}
                  {idx < messageIndex && (
                    <span className="text-accent-green text-sm font-bold">✓</span>
                  )}
                </div>
              ))}
              <div className={`flex items-center gap-2 text-tertiary pt-2 transition-opacity duration-150 ${
                messageIndex >= loadingMessages.length - 1 ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="animate-pulse text-accent-primary">▊</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-tertiary font-mono text-[10px] mt-3 opacity-50 uppercase tracking-wider">
          This may take a few moments
        </p>
      </div>
    </div>
  );
}
