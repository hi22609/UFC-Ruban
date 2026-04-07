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
              This Week's Board • Premium Fight Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-[0.92]">
              THIS WEEK'S <span className="text-accent">BOARD</span>
              <br />
              SHARP FIGHT INTELLIGENCE, NOT HYPE
            </h1>

            <p className="text-xl text-white/90 mb-4 max-w-3xl leading-relaxed">
              Historic event. 13 fights on the board. RUBAN gives members a structured way to track the card with confidence scores, volatility framing, and select spots worth real attention.
            </p>

            <p className="text-lg text-muted mb-6 max-w-3xl leading-relaxed">
              No fake locks. No recycled tout language. Just cleaner reads, disciplined unit logic, and premium Discord delivery for people who want context before they take action.
            </p>

            <div className="mb-8 rounded-2xl border border-gold/20 bg-gold/5 p-5 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold mb-3">Why people buy</p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">13 tracked fight reads for the event</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Every spot framed with confidence + volatility</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Member delivery happens inside Discord, where the board stays organized</div>
              </div>
              <p className="text-xs text-muted mt-3">Analysis only. Outcomes are never guaranteed.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <Link href="/pricing" className="btn-primary text-center">
                GET ACCESS
              </Link>
              <Link href="/methodology" className="btn-secondary text-center">
                SEE HOW RUBAN FRAMES EDGE
              </Link>
            </div>
            <p className="text-sm text-muted mb-8">Prefer to look inside first? Review the <Link href="/discord" className="text-accent underline">Discord delivery flow</Link>.</p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Coverage</p>
                <p className="text-2xl font-extrabold">13 Event Reads</p>
              </div>
              <div className="card">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Framework</p>
                <p className="text-2xl font-extrabold">Confidence + Volatility</p>
              </div>
              <div className="card">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Access</p>
                <p className="text-2xl font-extrabold">Discord Member Room</p>
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
              WHY THIS WEEK'S BOARD DESERVES ATTENTION
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Not every fight card deserves urgency. This one does. The White House setting creates unusual public attention, heavier casual money, and a clearer need for disciplined filtering.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Historic Attention</h3>
              <p className="text-muted">A White House card pulls in a wider audience than a standard UFC weekend. More attention usually means more emotion in the market and more need for disciplined reads.</p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Full-Card Coverage</h3>
              <p className="text-muted">Instead of over-selling one main event angle, RUBAN tracks the entire event so members can evaluate multiple spots with context.</p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Structured Delivery</h3>
              <p className="text-muted">Confidence, volatility, and reasoning stay attached to each read so the product feels premium, organized, and transparent.</p>
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
              The free read shows the standard. Members unlock the rest of the board, with each spot framed for conviction and risk.
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
              UNLOCK THE FULL WHITE HOUSE BOARD
            </Link>
            <p className="text-muted mt-4">Discord is where members receive the full board, structured notes, and event-night updates.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4" id="performance-proof">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">TRANSPARENCY IS THE SALES ENGINE</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              People buy faster when the offer feels structured. RUBAN reduces skepticism by showing how each read is framed instead of hiding behind generic “trust us” language.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">What Members See</h3>
              <ul className="space-y-3 text-muted">
                <li>• Confidence-based reads instead of “100% lock” nonsense</li>
                <li>• Volatility labels so variance is visible before action</li>
                <li>• Select positions instead of forced plays on every fight</li>
                <li>• Event-week and fight-day delivery without noisy channel spam</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-3">Methodology</h3>
              <p className="text-muted leading-relaxed mb-3">
                Opponent quality, form, striking profile, grappling profile, durability, context, confidence banding, and volatility assessment all feed the final read.
              </p>
              <p className="text-muted">
                We don’t promise wins. We explain the reasoning behind each position. <Link href="/methodology" className="text-accent underline">See methodology</Link>
              </p>
            </div>
          </div>

          <div className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <h3 className="text-2xl font-bold mb-2">Clear Member Experience</h3>
              <p className="text-muted max-w-3xl">
                The premium promise is simple: cleaner reads on-site, then organized member delivery inside Discord. Performance visibility can deepen over time, but the current offer already lands when the framing stays honest.
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
            White House coverage is live. 13 fight reads tracked. The full board opens inside Discord.
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-6 py-2 w-full sm:w-auto text-center">
            UNLOCK ACCESS
          </Link>
        </div>
      </div>
    </>
  );
}
