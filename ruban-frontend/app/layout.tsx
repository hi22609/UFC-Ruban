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
              <Link
                href="https://discord.gg/yymtuNQwqC"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Discord
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
                <Link
                  href="https://discord.gg/yymtuNQwqC"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--muted)' }}
                >
                  Discord
                </Link>
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
