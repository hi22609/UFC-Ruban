'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Countdown from './Countdown';

export default function Popup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ruban_popup_dismissed');
    if (!dismissed) {
      const id = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(id);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('ruban_popup_dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 340,
        width: 'calc(100% - 40px)',
      }}
    >
      <div
        className="card"
        style={{
          border: '1px solid rgba(251,191,36,0.35)',
          boxShadow: '0 0 48px rgba(251,191,36,0.14), 0 25px 70px rgba(0,0,0,0.6)',
          padding: 24,
          position: 'relative',
        }}
      >
        <button
          onClick={dismiss}
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '1.4rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Dismiss"
        >
          ×
        </button>

        <p
          style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--gold)',
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
            marginBottom: 12,
          }}
        >
          White House Window Closing
        </p>

        <div style={{ marginBottom: 14 }}>
          <Countdown />
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.55,
            marginBottom: 16,
          }}
        >
          $1M+ projected member profits from this card. Early access means
          pre-movement odds.
        </p>

        <Link
          href="/pricing"
          className="btn-primary"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '0.82rem',
            minHeight: 44,
          }}
        >
          Get Access Now
        </Link>
      </div>
    </div>
  );
}
