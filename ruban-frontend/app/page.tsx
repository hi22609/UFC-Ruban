import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero - White House Event */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-glow via-transparent to-transparent opacity-20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-signal-red/10 border border-signal-red rounded-full text-signal-red text-sm font-bold uppercase tracking-wider animate-pulse">
            🔴 LIVE EVENT — UFC 322
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
            UFC WHITE HOUSE
          </h1>
          <p className="text-xl text-muted mb-6">
            April 19, 2026 • Washington D.C.
          </p>
          <div className="mb-8">
            <Image 
              src="/topuria-gaethje.jpg" 
              alt="Topuria vs Gaethje" 
              width={700} 
              height={400}
              className="rounded-xl border-2 border-accent/30 shadow-2xl shadow-accent-glow mx-auto"
            />
          </div>
          <p className="text-2xl font-bold mb-8">
            13 FIGHTS ANALYZED • <span className="text-accent">1 FREE PICK BELOW</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#free-pick" className="btn-primary">
              SEE FREE PICK ↓
            </a>
            <Link href="/pricing" className="btn-secondary">
              UNLOCK FULL CARD
            </Link>
          </div>
        </div>
      </section>

      {/* FREE PICK - Main Event */}
      <section id="free-pick" className="py-16 px-4 bg-elevated">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-signal-green/10 border border-signal-green rounded-full text-signal-green text-sm font-bold uppercase tracking-wider mb-4">
              🎁 FREE PICK
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              MAIN EVENT BREAKDOWN
            </h2>
            <p className="text-muted">Our full analysis. Free. No catch.</p>
          </div>

          <div className="card bg-card border-2 border-accent/40 shadow-xl shadow-accent-glow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted uppercase tracking-wider">LIGHTWEIGHT • MAIN EVENT</span>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                MEDIUM VOLATILITY
              </span>
            </div>
            
            <div className="text-center py-6 border-b border-accent/20 mb-6">
              <h3 className="text-4xl font-extrabold mb-3">ILIA TOPURIA</h3>
              <p className="text-muted text-lg mb-3">vs.</p>
              <h3 className="text-4xl font-extrabold mb-6">JUSTIN GAETHJE</h3>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex-1 max-w-md h-4 bg-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-signal-green to-green-400 transition-all" style={{width: '68%'}}></div>
                </div>
                <span className="text-3xl font-mono font-bold text-signal-green">68%</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">🎯 THE PICK</h4>
                <p className="text-lg font-bold text-signal-green mb-2">✅ ILIA TOPURIA WINS</p>
                <p className="text-muted">Method: Decision (65%) or Late Finish (35%)</p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">📊 ANALYSIS</h4>
                <p className="text-muted leading-relaxed">
                  Topuria's defensive wrestling is the key factor here. Gaethje's game plan relies on sustained forward pressure and volume striking, but Ilia's ability to neutralize takedowns while mixing in his own grappling entries creates a control problem for Gaethje.
                </p>
                <p className="text-muted leading-relaxed mt-3">
                  Over 5 rounds, Topuria out-points him through superior cardio, sharper technical striking, and better fight IQ. Gaethje has shown durability cracks in recent wars — if Ilia finds the right opening late, this could end inside the distance.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">⚠️ RISK FACTORS</h4>
                <p className="text-muted leading-relaxed">
                  <strong>Volatility: MEDIUM.</strong> Gaethje's early knockout power is real. If he lands clean in rounds 1-2 before Topuria establishes rhythm, this pick flips. Ilia's chin has never been truly tested at this level. Early aggression from Gaethje is the primary risk variable.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">🔢 CONFIDENCE</h4>
                <p className="text-muted">
                  <strong>68% confidence.</strong> This is not a lock. We quantify edge, not guarantees. The 32% scenario is real and includes early knockout variance and potential wrestling stalemates that favor Gaethje's volume game.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locked Fights Tease */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">
              12 MORE FIGHTS<br/>
              <span className="text-accent">LOCKED IN DISCORD</span>
            </h2>
            <p className="text-xl text-muted">
              Full card breakdown. Confidence scores. Volatility ratings. Premium analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card relative opacity-60">
                <div className="absolute inset-0 backdrop-blur-sm bg-void/80 rounded-xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-sm font-bold">UNLOCK IN DISCORD</p>
                  </div>
                </div>
                <div className="filter blur-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-muted uppercase">FIGHT #{i + 2}</span>
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">MEDIUM</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">FIGHTER A</h3>
                  <p className="text-muted text-sm mb-1">vs.</p>
                  <h3 className="text-xl font-bold mb-3">FIGHTER B</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-signal-green to-green-400" style={{width: `${Math.floor(Math.random() * 30) + 50}%`}}></div>
                    </div>
                    <span className="text-sm font-mono">XX%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
              UNLOCK FULL CARD — $20/MO
            </Link>
            <p className="text-muted mt-4">Cancel anytime. Premium Discord invite sent instantly.</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-elevated">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-12">WHY RUBAN</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-extrabold text-accent mb-2">67%</div>
              <p className="text-muted">Historical win rate over 200+ fights</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-accent mb-2">8+</div>
              <p className="text-muted">Data lenses per fight analysis</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-accent mb-2">24/7</div>
              <p className="text-muted">Premium Discord access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-8">
          STOP GUESSING.<br/>
          JOIN THE INNER CHAMBER.
        </h2>
        <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
          GET FULL ACCESS — $20/MO
        </Link>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-accent/20 py-3 px-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm font-bold">
            🔒 Full White House card inside Discord
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-6 py-2">
            JOIN NOW
          </Link>
        </div>
      </div>
    </>
  );
}
