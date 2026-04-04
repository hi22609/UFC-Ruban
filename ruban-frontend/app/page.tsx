import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-glow via-transparent to-transparent opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-signal-green/10 border border-signal-green rounded-full text-signal-green text-sm font-bold uppercase tracking-wider">
            🎯 67% Win Rate • 200+ Fights
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-none">
            UFC INTELLIGENCE<br/>
            FOR SERIOUS<br/>
            <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
              OPERATORS
            </span>
          </h1>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Structured fight reads. Confidence-based analysis. Event-night premium drops. The real edge lives inside the Discord.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary">
              JOIN DISCORD
            </Link>
            <Link href="/tonights-card" className="btn-secondary">
              VIEW TONIGHT'S CARD →
            </Link>
          </div>
        </div>
      </section>

      {/* What Is RUBAN */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-16">WHAT IS RUBAN</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">STRUCTURED</h3>
              <p className="text-muted">Every fight analyzed through 8+ data lenses. Opponent quality, form, striking, grappling, durability, context.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">EXPLAINABLE</h3>
              <p className="text-muted">No locks. No guarantees. Every pick includes reasoning, confidence bands, and volatility ratings.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-2xl font-bold mb-3">PREMIUM</h3>
              <p className="text-muted">Discord-first membership. Full event breakdowns. Live updates. High-signal discussion. Serious operators only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tonight's Featured Fight Preview */}
      <section className="py-24 px-4 bg-elevated">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12">TONIGHT'S FEATURED FIGHT</h2>
          <div className="card relative">
            <div className="absolute inset-0 backdrop-blur-sm bg-void/60 rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <p className="text-2xl font-bold mb-4">UNLOCK IN DISCORD</p>
                <Link href="/pricing" className="btn-primary">
                  JOIN NOW
                </Link>
              </div>
            </div>
            <div className="filter blur-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted uppercase tracking-wider">LIGHTWEIGHT • MAIN EVENT</span>
                <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">MEDIUM VOLATILITY</span>
              </div>
              <div className="text-center py-6">
                <h3 className="text-3xl font-extrabold mb-2">ILIA TOPURIA</h3>
                <p className="text-muted mb-4">vs.</p>
                <h3 className="text-3xl font-extrabold mb-6">JUSTIN GAETHJE</h3>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex-1 h-3 bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-signal-green to-green-400" style={{width: '68%'}}></div>
                  </div>
                  <span className="text-2xl font-mono font-bold">68%</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Topuria's defensive wrestling neutralizes Gaethje's forward pressure. Ilia out-points him over 5 rounds...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-16">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">1</div>
              <h3 className="text-2xl font-bold mb-3">WE ANALYZE</h3>
              <p className="text-muted">Structured fight breakdowns. Confidence scoring. Volatility assessment.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">2</div>
              <h3 className="text-2xl font-bold mb-3">YOU DECIDE</h3>
              <p className="text-muted">Full reasoning provided. Edge explained. Risk quantified. Your call.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">3</div>
              <h3 className="text-2xl font-bold mb-3">WE TRACK</h3>
              <p className="text-muted">Transparent record. Historical win rate. No hiding losses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discord Membership CTA */}
      <section className="py-24 px-4 bg-elevated">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold mb-6">THE REAL EDGE<br/>LIVES INSIDE</h2>
          <p className="text-xl text-muted mb-8 leading-relaxed">
            Full event breakdowns. Premium drops. Live event-night updates. Member-only channels. High-signal discussion. Serious operators only.
          </p>
          <Link href="/discord" className="btn-primary">
            EXPLORE DISCORD ACCESS
          </Link>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12">MEMBERSHIP ACCESS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4">OPERATOR</h3>
              <div className="text-5xl font-bold mb-4">
                $20<span className="text-xl text-muted">/mo</span>
              </div>
              <ul className="space-y-3 mb-6 text-muted">
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>Full event breakdowns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>Discord premium access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>Live event-night updates</span>
                </li>
              </ul>
              <Link href="/pricing" className="btn-secondary w-full block text-center">
                JOIN OPERATOR
              </Link>
            </div>
            <div className="card border-accent relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold mb-4">SYNDICATE</h3>
              <div className="text-5xl font-bold mb-4">
                $120<span className="text-xl text-muted">/yr</span>
              </div>
              <ul className="space-y-3 mb-6 text-muted">
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>Everything in Operator</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>Early event-week drops</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>1-on-1 strategy call</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-green mr-2">✓</span>
                  <span>Affiliate access (10% rev)</span>
                </li>
              </ul>
              <Link href="/pricing" className="btn-primary w-full block text-center">
                JOIN SYNDICATE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-6">STOP GUESSING.<br/>JOIN NOW.</h2>
        <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
          GET ACCESS
        </Link>
      </section>
    </>
  );
}
