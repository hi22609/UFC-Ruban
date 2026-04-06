import Link from 'next/link';

const lockedTeasers = [61, 58, 73, 66, 54, 69];

export default function Home() {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-glow via-transparent to-transparent opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-signal-green/10 border border-signal-green rounded-full text-signal-green text-sm font-bold uppercase tracking-wider">
              Historic White House Event • 13 Fights Tracked
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-[0.92]">
              UFC <span className="text-accent">WHITE HOUSE</span>
              <br />
              WHERE SHARP MONEY LOOKS
            </h1>

            <p className="text-xl text-white/90 mb-4 max-w-3xl leading-relaxed">
              Historic event. 13 stacked fights. Unusual betting volume. This is not a “join before we hit $1M” pitch — this is a White House card where RUBAN members are positioned across multiple high-confidence spots and select edges.
            </p>

            <p className="text-lg text-muted mb-4 max-w-3xl leading-relaxed">
              We don’t chase. We select. Confidence bands, volatility ratings, and disciplined unit strategy — built for people who want calculated reads, not random picks.
            </p>

            <p className="text-2xl font-bold text-gold mb-2">
              Projected collective member profit pool: $1.2M+
            </p>
            <p className="text-sm text-muted mb-8 max-w-3xl">
              Projection based on member participation, tracked positions, and event-specific betting volume. Analysis only. Never guaranteed outcomes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/pricing" className="btn-primary text-center">
                UNLOCK ALL 13 WHITE HOUSE PICKS
              </Link>
              <Link href="/white-house" className="btn-secondary text-center">
                ENTER THE WHITE HOUSE ROOM
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Fight Intelligence</p>
                <p className="text-2xl font-extrabold">13 Tracked Reads</p>
              </div>
              <div className="card">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Approach</p>
                <p className="text-2xl font-extrabold">Disciplined Unit Strategy</p>
              </div>
              <div className="card">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Delivery</p>
                <p className="text-2xl font-extrabold">Discord + Charts</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px] flex items-center justify-center">
            <div className="absolute w-[440px] h-[440px] rounded-full bg-indigo/20 blur-3xl"></div>
            <div className="absolute bottom-12 w-[300px] h-[300px] rotate-[22deg] rounded-[24%] border border-white/10 bg-white/5"></div>

            <div className="absolute left-0 md:left-6 top-14 w-[180px] md:w-[220px] h-[320px] md:h-[390px] rounded-3xl overflow-hidden border border-signal-red/30 shadow-[0_0_35px_rgba(239,68,68,0.18)] bg-gradient-to-b from-white/10 to-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,0.22),transparent_45%),linear-gradient(180deg,#1f2937,#0f172a)]"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <p className="text-2xl font-extrabold">ILIA TOPURIA</p>
                <p className="text-sm text-white/80">16-0 • Pressure, control, cleaner reads</p>
              </div>
            </div>

            <div className="absolute right-0 md:right-6 top-14 w-[180px] md:w-[220px] h-[320px] md:h-[390px] rounded-3xl overflow-hidden border border-indigo/30 shadow-[0_0_35px_rgba(79,70,229,0.18)] bg-gradient-to-b from-white/10 to-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.22),transparent_45%),linear-gradient(180deg,#111827,#172554)]"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20 text-right">
                <p className="text-2xl font-extrabold">JUSTIN GAETHJE</p>
                <p className="text-sm text-white/80">25-5 • Violence, variance, early danger</p>
              </div>
            </div>

            <div className="absolute w-24 h-24 rounded-full border border-gold/30 bg-gold/10 shadow-[0_0_35px_rgba(251,191,36,0.18)] flex items-center justify-center">
              <span className="text-4xl font-extrabold text-gold">VS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-elevated/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              WHY THIS EVENT IS DIFFERENT
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Not every fight is worth touching. These are. The White House card brings rare attention, inflated handle, and more chances for disciplined bettors to isolate top-tier edges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Historic Volume</h3>
              <p className="text-muted">First White House UFC event. More public attention. More casual money. More market noise to exploit.</p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">13 Select Positions</h3>
              <p className="text-muted">The board is deep. The edge compounds when a full card offers multiple strong reads instead of one headline pick.</p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Structured Delivery</h3>
              <p className="text-muted">Confidence, volatility, and reasoning attached to every position so users see why the data leans strongest.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="free-pick" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-signal-green/10 border border-signal-green rounded-full text-signal-green text-sm font-bold uppercase tracking-wider mb-4">
              Free Main Event Read
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              TOPURIA VS GAETHJE
            </h2>
            <p className="text-muted">One full read in the open. No fluff. No fake locks.</p>
          </div>

          <div className="card bg-card border-2 border-accent/40 shadow-xl shadow-accent-glow">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <span className="text-sm text-muted uppercase tracking-wider">LIGHTWEIGHT • MAIN EVENT</span>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                MEDIUM VOLATILITY
              </span>
            </div>

            <div className="text-center py-6 border-b border-accent/20 mb-6">
              <h3 className="text-4xl font-extrabold mb-3 text-signal-green">ILIA TOPURIA WINS</h3>
              <p className="text-muted text-lg mb-6">Decision lean with late-finish upside</p>

              <div className="flex items-center justify-center gap-4 mb-2 flex-col sm:flex-row">
                <div className="flex-1 max-w-md h-4 bg-elevated rounded-full overflow-hidden w-full">
                  <div className="h-full bg-gradient-to-r from-signal-green to-green-400 transition-all" style={{ width: '68%' }}></div>
                </div>
                <span className="text-3xl font-mono font-bold text-signal-green">68%</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">THE READ</h4>
                <p className="text-muted leading-relaxed">
                  Topuria’s defensive wrestling and cleaner layered offense create a control problem for Gaethje. Over five rounds, the sharper technical sequencing, better pace management, and stronger positional answers favor Ilia.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">WHY THE DATA LEANS HERE</h4>
                <p className="text-muted leading-relaxed">
                  Gaethje thrives in chaos and early exchanges. Topuria is better built to reduce chaos, win disciplined phases, and bank rounds while preserving finishing equity if damage accumulates late.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">RISK FACTOR</h4>
                <p className="text-muted leading-relaxed">
                  Early knockout variance is real. Gaethje’s round 1-2 danger is the live flip side of this read. This is a high-confidence spot — not a guaranteed outcome.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">
              12 MORE READS<br />
              <span className="text-accent">LOCKED INSIDE DISCORD</span>
            </h2>
            <p className="text-xl text-muted">
              Select positions. Confidence scores. Volatility ratings. Premium event-week delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {lockedTeasers.map((confidence, i) => (
              <div key={i} className="card relative opacity-70">
                <div className="absolute inset-0 backdrop-blur-sm bg-void/80 rounded-xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-sm font-bold">UNLOCK IN DISCORD</p>
                  </div>
                </div>
                <div className="filter blur-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-muted uppercase">Tracked Position #{i + 2}</span>
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">SELECT EDGE</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Premium Fight Read</h3>
                  <p className="text-muted text-sm mb-3">Confidence and volatility attached inside member view.</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-signal-green to-green-400" style={{ width: `${confidence}%` }}></div>
                    </div>
                    <span className="text-sm font-mono">{confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
              GET WHITE HOUSE ACCESS
            </Link>
            <p className="text-muted mt-4">Discord is where the full board, chart tracking, and event-night updates live.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4" id="performance-proof">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">TRANSPARENCY BUILDS TRUST</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              The edge only matters if users understand why it exists. RUBAN shows confidence, volatility, and reasoning so the product feels calculated — not random.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">What Members See</h3>
              <ul className="space-y-3 text-muted">
                <li>• Confidence-based reads, not fake locks</li>
                <li>• Volatility labels so users know where variance lives</li>
                <li>• Select positions instead of forced action on every angle</li>
                <li>• Event-week and fight-day delivery, not channel spam</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Methodology</h3>
              <p className="text-muted leading-relaxed mb-3">
                Opponent quality, form, striking profile, grappling profile, durability, context, confidence banding, and volatility assessment all feed the final read.
              </p>
              <p className="text-muted">
                We don’t promise wins. We structure edge. <Link href="/methodology" className="text-accent underline">See methodology</Link>
              </p>
            </div>
          </div>

          <div className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <h3 className="text-2xl font-bold mb-2">Charts + Discord Visibility</h3>
              <p className="text-muted max-w-3xl">
                Elite dashboard visibility is now part of the product framing. Members can review performance charts on-site and receive premium chart snapshots in Discord when the data feed is finalized.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/discord" className="btn-secondary text-center">SEE DISCORD FLOW</Link>
              <Link href="/pricing" className="btn-primary text-center">GET MEMBER ACCESS</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-accent/20 py-3 px-4 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm font-bold text-center sm:text-left">
            White House card live. 13 tracked reads. Discord is where the full board opens up.
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-6 py-2 w-full sm:w-auto text-center">
            GET WHITE HOUSE ACCESS
          </Link>
        </div>
      </div>
    </>
  );
}
