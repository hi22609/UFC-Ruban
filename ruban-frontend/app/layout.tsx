import type { Metadata } from "next";
import Link from "next/link";
import Popup from "./components/Popup";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUBAN | Fight Intelligence for the White House Card",
  description: "RUBAN maps the White House UFC card before the noise takes over. Confidence levels, volatility flags, and full-board reads for serious bettors. Members only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ── White House event banner ── */}
        <div style={{
          borderBottom: '1px solid rgba(251,191,36,0.2)',
          background: 'rgba(251,191,36,0.05)',
          backdropFilter: 'blur(18px)',
        }}>
          <div style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: '0.82rem',
          }}>
            <Link
              href="/whitehouse"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.9)' }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--green)',
                display: 'inline-block',
                animation: 'pulse-dot 2.4s ease-in-out infinite',
              }} />
              <span style={{ fontWeight: 700 }}>Special Event Live</span>
              <span style={{ color: 'var(--gold)' }}>→</span>
              <span>White House Card — April 12</span>
            </Link>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="ruban-nav">
          <div className="ruban-nav-inner">
            <Link href="/" className="logo-gradient">RUBAN</Link>
            <div className="ruban-nav-links">
              <Link href="/#free-pick" className="nav-link">Free Read</Link>
              <Link href="/pricing" className="nav-link">How It Works</Link>
              <Link href="/tonights-card" className="nav-link">Board</Link>
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="nav-link">Discord</Link>
              <Link href="/pricing" className="nav-cta">Get Access</Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* ── Footer ── */}
        <footer style={{
          padding: '26px 0 96px',
          borderTop: '1px solid var(--line)',
          color: 'var(--muted)',
          textAlign: 'center',
          fontSize: '0.88rem',
        }}>
          <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
              <Link href="/tonights-card" style={{ color: 'var(--muted)' }}>Board</Link>
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" style={{ color: 'var(--muted)' }}>Discord</Link>
              <Link href="/pricing" style={{ color: 'var(--muted)' }}>Access</Link>
            </div>
            <p style={{ marginBottom: 6, color: '#6b7280', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Structured fight intelligence. Not a sportsbook.
            </p>
            <p>© 2026 RUBAN. Analysis only. Gamble responsibly.</p>
          </div>
        </footer>

        <Popup />
      </body>
    </html>
  );
}
