import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUBAN | White House Fight Intelligence",
  description: "Structured UFC fight intelligence with confidence-based reads, volatility framing, and premium Discord delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-50 bg-void/95 backdrop-blur-xl border-b border-accent/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent shrink-0">
              RUBAN
            </Link>
            <div className="hidden md:flex items-center gap-6 flex-wrap justify-end">
              <Link href="/#free-pick" className="text-white font-semibold hover:text-accent transition">
                Free Read
              </Link>
              <Link href="/methodology" className="text-muted hover:text-white transition">
                How It Works
              </Link>
              <Link href="/track-record" className="text-muted hover:text-white transition">
                Board
              </Link>
              <Link href="https://t.me/RUBAN_UFC_Bot" className="text-muted hover:text-white transition">
                Telegram
              </Link>
              <Link href="/pricing" className="btn-primary text-sm px-6 py-2">
                GET ACCESS
              </Link>
            </div>
          </div>
        </nav>
        <div className="border-b border-accent/10 bg-elevated/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 text-center text-sm text-white/85">
            <Link href="/white-house" className="inline-flex items-center gap-2 hover:text-accent transition">
              <span className="font-semibold">Special Event Live</span>
              <span className="text-accent">→</span>
              <span>White House Card</span>
            </Link>
          </div>
        </div>
        <main>{children}</main>
        <footer className="border-t border-accent/20 py-12 px-4 text-center text-muted text-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center gap-8 mb-6 flex-wrap">
              <Link href="/pricing" className="hover:text-white transition">Access</Link>
              <Link href="https://t.me/RUBAN_UFC_Bot" className="hover:text-white transition">Telegram</Link>
              <Link href="/discord" className="hover:text-white transition">Discord</Link>
              <Link href="/methodology" className="hover:text-white transition">Methodology</Link>
            </div>
            <p>&copy; 2026 RUBAN. Structured fight intelligence. Analysis only. Gamble responsibly.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
