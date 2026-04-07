import type { Metadata } from "next";
import Link from "next/link";
import Popup from "./components/Popup";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUBAN | Premium Fight Intelligence",
  description: "Structured UFC fight intelligence with confidence-based reads, volatility framing, and premium Discord delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-50 bg-void/95 backdrop-blur-xl border-b border-accent/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent shrink-0">
              RUBAN
            </Link>
            <div className="hidden md:flex items-center gap-6 flex-wrap justify-end">
              <Link href="/" className="text-muted hover:text-white transition">Home</Link>
              <Link href="/tonights-card" className="text-muted hover:text-white transition">Board</Link>
              <Link href="/whitehouse" className="text-white font-semibold hover:text-accent transition">White House</Link>
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="text-muted hover:text-white transition">Discord</Link>
              <Link href="/pricing" className="btn-primary text-sm px-6 py-2">GET ACCESS</Link>
            </div>
            <div className="flex md:hidden items-center gap-3">
              <Link href="/whitehouse" className="text-gold text-sm font-bold">White House</Link>
              <Link href="/pricing" className="btn-primary text-xs px-4 py-2">GET ACCESS</Link>
            </div>
          </div>
        </nav>
        <div className="border-b border-gold/20 bg-gold/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-2 text-center text-sm">
            <Link href="/whitehouse" className="inline-flex items-center gap-2 hover:text-gold transition text-white/90">
              <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse inline-block"></span>
              <span className="font-semibold">Special Event Live</span>
              <span className="text-gold">→</span>
              <span>White House Card — April 12</span>
            </Link>
          </div>
        </div>
        <main>{children}</main>
        <footer className="border-t border-accent/20 py-12 px-4 text-center text-muted text-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center gap-8 mb-6 flex-wrap">
              <Link href="/pricing" className="hover:text-white transition">Access</Link>
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="hover:text-white transition">Discord</Link>
              <Link href="/methodology" className="hover:text-white transition">Methodology</Link>
              <Link href="/track-record" className="hover:text-white transition">Track Record</Link>
            </div>
            <p className="mb-2">&copy; 2026 RUBAN. Structured fight intelligence. Analysis only. Gamble responsibly.</p>
            <p className="text-xs text-muted/60">Projected profits represent estimated member opportunity based on position sizing and read confidence. Not a guarantee of returns. For informational purposes only.</p>
          </div>
        </footer>
        <Popup />
      </body>
    </html>
  );
}
