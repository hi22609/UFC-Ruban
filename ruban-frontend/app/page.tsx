import Link from 'next/link';
import Countdown from './components/Countdown';
import predictionsData from './data/predictions.json';

const freePick = predictionsData.predictions.find((p) => !p.is_main_event === false) || predictionsData.predictions[0];
const eventName = predictionsData.event_name;
const eventDate = predictionsData.event_date;

export default function Home() {
  return (
    <>
      {/* HERO — RUBAN as the system */}
      <section className="relative overflow-hidden px-4 py-16 lg:py-24 xl:py-28">
        <div className="absolute inset-0 bg-gradient-radial from-accent-glow via-transparent to-transparent opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:gap-14 xl:gap-16 items-center">
          <div className="max-w-3xl">
            <div className="inline-block mb-5 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm font-bold uppercase tracking-wider">
              Premium Fight Intelligence System
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[0.92]">
              THE EDGE IS IN<br />
              <span className="text-accent">THE STRUCTURE</span>
            </h1>
            <p className="text-xl text-white/90 mb-4 max-w-2xl leading-relaxed">
              RUBAN is a fight intelligence system built for disciplined operators. Every read comes with confidence framing, volatility scoring, and structural reasoning — not picks, not hype.
            </p>
            <p className="text-lg text-muted mb-8 max-w-2xl leading-relaxed">
              Members receive the full board before the market moves, inside a private Discord where every position is framed for conviction and risk. No recycled tout language. No fake locks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/pricing" className="btn-primary text-center">GET ACCESS</Link>
              <Link href="/whitehouse" className="btn-secondary text-center">WHITE HOUSE CARD →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="card"><p className="text-xs text-muted uppercase tracking-wider mb-2">Framework</p><p className="text-xl font-extrabold">Confidence + Volatility</p></div>
              <div className="card"><p className="text-xs text-muted uppercase tracking-wider mb-2">Delivery</p><p className="text-xl font-extrabold">Private Discord</p></div>
              <div className="card"><p className="text-xs text-muted uppercase tracking-wider mb-2">Model</p><p className="text-xl font-extrabold">Structural Reads</p></div>
            </div>
          </div>
          <div className="relative flex items-center lg:justify-end">
            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl sm:h-[380px] sm:w-[380px]"></div>
            <div className="relative z-10 w-full max-w-md rounded-[1.5rem] border border-accent/30 bg-[#141419]/95 p-6 shadow-[0_30px_80px_rgba(10,10,15,0.45)] sm:p-7">
              <div className="text-xs uppercase tracking-[0.18em] text-gold font-bold mb-5">White House Window</div>
              <Countdown className="mb-6 justify-center" />
              <div className="text-center border-t border-white/5 pt-6">
                <div className="text-4xl font-extrabold text-signal-green mb-2">$1M+</div>
                <div className="text-sm text-muted mb-5 max-w-[16rem] mx-auto">Projected member profit pool — White House card</div>
              </div>
              <Link href="/whitehouse" className="btn-primary w-full text-center text-sm">SEE THE FULL CASE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHITE HOUSE URGENCY BLOCK */}
      <section className="py-16 px-4 bg-elevated/50 border-y border-gold/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-bold uppercase tracking-wider">
            Biggest Event of the Year
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            WHITE HOUSE CARD · APRIL 12 · 2026
          </h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-6 leading-relaxed">
            The largest influx of casual money UFC has seen in years floods this card. Mainstream attention spikes favorites, inflates certain lines, and creates edges that disappear by fight week. Members who are locked in before that happens get the full board read before the market gets loud.
          </p>
          <p className="text-lg text-muted max-w-3xl mx-auto mb-8">
            We are projecting over <span className="text-signal-green font-bold">$1,000,000 in member profits</span> generated from this card alone. The window to get positioned early is now — not fight week, not when the odds have already moved.
          </p>
          <Countdown className="justify-center mb-8" />
          <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
            LOCK IN BEFORE THE ODDS MOVE
          </Link>
          <p className="text-xs text-muted mt-4">Projected profits based on member position sizing and read confidence. Not a guarantee of returns.</p>
        </div>
      </section>

      {/* FREE PICK — dynamic from predictions.json */}
      <section id="free-pick" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-signal-green/10 border border-signal-green rounded-full text-signal-green text-sm font-bold uppercase tracking-wider mb-4">
              Free Main Event Read
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2">{eventName.toUpperCase()}</h2>
            <p className="text-muted">{new Date(eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="card border-accent/40 shadow-xl">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <span className="text-sm text-muted uppercase tracking-wider">
                {freePick.weight_class} · Main Event
              </span>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                {freePick.tier || 'SELECT READ'}
              </span>
            </div>
            <div className="text-center py-6 border-b border-accent/20 mb-6">
              <h3 className="text-3xl font-extrabold mb-2 text-signal-green">{freePick.winner.toUpperCase()} WINS</h3>
              <p className="text-muted mb-1">{freePick.fighter1} vs {freePick.fighter2}</p>
              <p className="text-muted text-lg mb-5">{freePick.method} lean</p>
              <div className="flex items-center justify-center gap-4 mb-2 flex-col sm:flex-row">
                <div className="flex-1 max-w-md h-4 bg-elevated rounded-full overflow-hidden w-full">
                  <div className="h-full bg-gradient-to-r from-signal-green to-green-400" style={{ width: `${freePick.confidence}%` }}></div>
                </div>
                <span className="text-3xl font-mono font-bold text-signal-green">{freePick.confidence}%</span>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <h4 className="text-xl font-bold mb-2 text-accent">THE READ</h4>
                <p className="text-muted leading-relaxed">{freePick.analysis}</p>
              </div>
              {freePick.key_factors && (
                <div>
                  <h4 className="text-xl font-bold mb-2 text-accent">KEY FACTORS</h4>
                  <ul className="space-y-2 text-muted">
                    {freePick.key_factors.slice(0, 3).map((f: string, i: number) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCKED BOARD TEASE */}
      <section className="py-16 px-4 bg-elevated/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">
            {predictionsData.predictions.length - 1}+ MORE READS<br />
            <span className="text-accent">LOCKED INSIDE DISCORD</span>
          </h2>
          <p className="text-xl text-muted mb-8">
            The free read shows the standard. Members unlock the rest of the board, with every spot framed for conviction and risk.
          </p>
          <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
            UNLOCK THE FULL BOARD
          </Link>
          <p className="text-muted mt-4">Join at <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="text-accent underline">discord.gg/yymtuNQwqC</Link> after purchase.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">HOW RUBAN WORKS</h2>
            <p className="text-xl text-muted">Structure before action. Every time.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-4xl font-extrabold text-accent mb-4">01</div>
              <h3 className="text-2xl font-bold mb-3">Choose Access</h3>
              <p className="text-muted">Select Operator ($20/mo) or Syndicate ($120/yr). Both unlock the full board and private Discord.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-extrabold text-accent mb-4">02</div>
              <h3 className="text-2xl font-bold mb-3">Join Discord</h3>
              <p className="text-muted">Get your invite link and enter the private member room where the board lives, organized and updated.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-extrabold text-accent mb-4">03</div>
              <h3 className="text-2xl font-bold mb-3">Work the Card</h3>
              <p className="text-muted">Every position framed with confidence, volatility, and structural reasoning. No noise, no hype.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-gold/20 py-3 px-4 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm font-bold text-center sm:text-left">
            White House card is live. $1M+ projected member pool. Early access closes when the odds move.
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-6 py-2 w-full sm:w-auto text-center whitespace-nowrap">
            LOCK IN NOW
          </Link>
        </div>
      </div>
    </>
  );
}
