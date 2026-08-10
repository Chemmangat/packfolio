'use client';

import { useEffect, useState, useRef } from 'react';

const TESTIMONIALS = [
  {
    quote: "I've explored it and found it to be very clean and intuitive. The way you've structured the analytics and trends is impressive — it provides much more consolidated insight than what's available directly on the npm website.",
    author: 'Open Source Developer',
    role: 'AI-Augmented Software Engineer',
    location: 'Syria',
    pkg: 'react-doctor-cli-dev',
    initials: 'OK',
    accent: '#ef4444',
  },
  {
    quote: "100% agreed. The OSS community thrives on tools like this. I use Packfolio every time I evaluate a new dependency — the health score alone saves me a ton of research time. Nice work.",
    author: 'Open Source Developer',
    role: 'Senior Engineer',
    location: 'GitHub',
    pkg: 'lodash',
    initials: 'OD',
    accent: '#06b6d4',
  },
  {
    quote: "Thank you for this amazing and helpful app — it helps me and my team a lot. We track all our published packages from one place instead of juggling multiple tabs. Great job.",
    author: 'Engineering Team Lead',
    role: 'Team Lead · 6 packages',
    location: 'npm',
    pkg: 'express',
    initials: 'ET',
    accent: '#10b981',
  },
];

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setPrev(active);
    setActive(idx);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 420);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setPrev(active);
      setActive(i => {
        const next = (i + 1) % TESTIMONIALS.length;
        return next;
      });
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 420);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const t = TESTIMONIALS[active];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Main card — FIXED HEIGHT so no layout shift ── */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        /* Fixed height — tallest quote fits comfortably */
        height: '260px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-md)',
      }}>

        {/* Animated accent top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${t.accent} 0%, ${t.accent}40 60%, transparent 100%)`,
          transition: 'background 0.4s ease',
          zIndex: 2,
        }} />

        {/* Slides — absolute positioned so height is stable */}
        {TESTIMONIALS.map((item, i) => {
          const isActive = i === active;
          const isPrev = i === prev;
          return (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              padding: '1.5rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : isPrev ? 'translateY(-8px)' : 'translateY(10px)',
              transition: 'opacity 0.42s ease, transform 0.42s ease',
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 1 : 0,
            }}>
              {/* Quote */}
              <div>
                <div style={{
                  fontFamily: 'Georgia, serif', fontSize: '2rem', lineHeight: 1,
                  color: item.accent, opacity: 0.2, marginBottom: '6px',
                }}>&ldquo;</div>
                <p className="font-mono text-secondary" style={{ fontSize: '12.5px', lineHeight: 1.75 }}>
                  {item.quote}
                </p>
              </div>

              {/* Author row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '0.875rem', borderTop: '1px solid var(--border-primary)' }}>
                {/* Avatar */}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: `${item.accent}18`,
                  border: `1px solid ${item.accent}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                  color: item.accent, letterSpacing: '0.04em',
                }}>
                  {item.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-mono font-semibold text-primary" style={{ fontSize: '12px' }}>{item.author}</div>
                  <div className="font-mono text-tertiary" style={{ fontSize: '10.5px' }}>{item.role}</div>
                </div>
                {/* Package badge */}
                <div style={{
                  padding: '2px 8px', borderRadius: '5px', flexShrink: 0,
                  background: `${item.accent}10`,
                  border: `1px solid ${item.accent}25`,
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: item.accent, letterSpacing: '0.02em',
                }}>
                  {item.pkg}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Social proof bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px',
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {TESTIMONIALS.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === active ? '22px' : '6px',
                height: '6px', borderRadius: '99px',
                background: i === active ? t.accent : 'var(--border-primary)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease',
              }}
            />
          ))}
        </div>

        {/* "Real developers" trust signal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Stacked avatars */}
          {['#ef4444', '#06b6d4', '#10b981'].map((c, i) => (
            <div key={i} style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: `${c}20`, border: `1.5px solid ${c}40`,
              marginLeft: i === 0 ? 0 : '-7px',
              zIndex: 3 - i, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', fontWeight: 700, color: c,
              fontFamily: 'var(--font-mono)',
            }}>
              {['OK', 'OD', 'ET'][i]}
            </div>
          ))}
          <span className="font-mono text-tertiary" style={{ fontSize: '10px', marginLeft: '6px' }}>
            Real developers, real feedback
          </span>
        </div>
      </div>

      {/* ── Mini preview cards (fixed height, no text overflow shift) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {TESTIMONIALS.map((item, i) => {
          if (i === active) return null;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: '100%', textAlign: 'left',
                padding: '10px 12px', borderRadius: '10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, opacity 0.2s',
                opacity: 0.6,
                /* Fixed height prevents layout shift */
                height: '52px', overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.borderColor = item.accent + '45'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)'; }}
            >
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: item.accent, flexShrink: 0 }} />
              <p className="font-mono text-tertiary" style={{ fontSize: '11px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                &ldquo;{item.quote.slice(0, 80)}…&rdquo;
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
