import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUBAN | Premium UFC Intelligence",
  description: "Structured fight reads. Confidence-based analysis. Event-night premium drops.",
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
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
              RUBAN
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/tonights-card" className="text-muted hover:text-white transition">
                Tonight's Card
              </Link>
              <Link href="/pricing" className="text-muted hover:text-white transition">
                Pricing
              </Link>
              <Link href="/discord" className="text-muted hover:text-white transition">
                Discord
              </Link>
              <Link href="/methodology" className="text-muted hover:text-white transition">
                Methodology
              </Link>
              <Link href="/faq" className="text-muted hover:text-white transition">
                FAQ
              </Link>
              <Link href="/pricing" className="btn-primary text-sm px-6 py-2">
                JOIN
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-accent/20 py-12 px-4 text-center text-muted text-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center gap-8 mb-6">
              <Link href="#" className="hover:text-white transition">Twitter</Link>
              <Link href="https://t.me/RUBAN_UFC_Bot" className="hover:text-white transition">Telegram</Link>
              <Link href="/discord" className="hover:text-white transition">Discord</Link>
            </div>
            <p>&copy; 2026 RUBAN. For entertainment only. Gamble responsibly.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
