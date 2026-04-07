import type { Metadata } from 'next';
import Link from 'next/link';
import Popup from './components/Popup';
import './globals.css';

export const metadata: Metadata = {
  title: 'RUBAN | Premium UFC Fight Intelligence',
  description:
    'RUBAN delivers structured fight intelligence before the market moves. Confidence levels, volatility flags, and full-card reads — members only.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ── Announcement Banner ── */}
        <div
          style={{
            background: 'rgba(251,191,36,0.05)',
            borderBottom: '1px solid rgba(251,191,36,0.18)',
          }}
        >
          <div
            style={{
              width: 'min(1100px, calc(100% - 32px))',
              margin: '0 auto',
              padding: '9px 0',
              textAlign: 'center',
              fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Link
              href="/whitehouse"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'rgba(255,255,255,0.88)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(16,185,129,0.7)',
                  animation: 'pulse-dot 2.4s ease-in-out infinite',
                }}
              />
              <span style={{ fontWeight: 700 }}>Special Event Live</span>
              <span style={{ color: '#fbbf24' }}>→</span>
              <span>White House Card</span>
            </Link>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="ruban-nav">
          <div className="ruban-nav-inner">
            <Link href="/" className="ruban-logo">
              RUBAN
            </Link>
            <div className="ruban-nav-links">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/track-record" className="nav-link">
                Record
              </Link>
              <Link href="/whitehouse" className="nav-link">
                White House
              </Link>
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" rel="noopener noreferrer" className="nav-link" title="Discord">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              </Link>
              <Link href="https://x.com/UFCRuban" target="_blank" rel="noopener noreferrer" className="nav-link" title="X / Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
              </Link>
              <Link href="https://instagram.com/ufcruban" target="_blank" rel="noopener noreferrer" className="nav-link" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </Link>
              <Link href="/pricing" className="btn-nav">
                Get Access
              </Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* ── Footer ── */}
        <footer
          style={{
            padding: '40px 0 48px',
            borderTop: '1px solid var(--line)',
            color: 'var(--muted)',
            fontSize: '0.84rem',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div className="wrap">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                textAlign: 'center',
              }}
            >
              <span className="ruban-logo" style={{ fontSize: '1.5rem' }}>
                RUBAN
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                }}
              >
                <Link href="/" style={{ color: 'var(--muted)' }}>
                  Home
                </Link>
                <Link href="/track-record" style={{ color: 'var(--muted)' }}>
                  Record
                </Link>
                <Link href="/whitehouse" style={{ color: 'var(--muted)' }}>
                  White House
                </Link>
                <Link href="/pricing" style={{ color: 'var(--muted)' }}>
                  Pricing
                </Link>
                <Link href="https://discord.gg/yymtuNQwqC" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>Discord</Link>
                <Link href="https://x.com/UFCRuban" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>X / Twitter</Link>
                <Link href="https://instagram.com/ufcruban" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>Instagram</Link>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#4b5563',
                  maxWidth: 480,
                  lineHeight: 1.6,
                }}
              >
                Analysis only — not financial or betting advice. Structured fight
                intelligence for informational purposes. Gamble responsibly.
              </p>
              <p style={{ fontSize: '0.75rem', color: '#374151' }}>
                © 2026 RUBAN. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <Popup />
      </body>
    </html>
  );
}
