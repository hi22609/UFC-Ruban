import Link from 'next/link';
import Countdown from '../components/Countdown';

const pillars = [
  {
    title: 'The Casual Money Flood',
    body: 'The White House card pulls in the widest casual audience UFC has seen in years. Mainstream attention means millions of untrained bettors flooding lines with emotional, unstructured money. That irrational volume spikes favorites, inflates props, and creates specific distortions fight by fight.',
  },
  {
    title: 'The Early Position Window',
    body: 'Edges exist before fight week. After the attention spike, lines move fast and the value compresses. Members who get the full board now — before the casual money floods in — get reads at better numbers, with cleaner framing before the noise takes over.',
  },
  {
    title: 'The $1M Projection',
    body: 'Based on member position sizing, board depth, and historical read confidence, we project over $1,000,000 in combined member profits from this card alone. That is not a guarantee. It is a structural case built on 14 fights, an abnormal attention spike, and disciplined execution.',
  },
];

const boardFeatures = [
  { label: '14 Fights', desc: 'Full card coverage, every position framed' },
  { label: 'Pre-Movement Reads', desc: 'Delivered before fight-week line compression' },
  { label: 'Confidence Scoring', desc: 'No fake locks — every read comes with a number' },
  { label: 'Volatility Tags', desc: 'Know the risk before you act' },
  { label: 'Structural Reasoning', desc: 'Why the read exists, not just who to pick' },
  { label: 'Private Discord', desc: 'Board lives in the member room, organized by fight' },
];

export default function WhiteHousePage() {
  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <section className="py-20 px-4 text-center relative overflow-hidden border-b border-gold/20">
        <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-signal-red/10 border border-signal-red/40 rounded-full text-signal-red text-sm font-bold uppercase tracking-wider">
            Special Event · War Room
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[0.92]">
            WHITE HOUSE<br /><span className="text-gold">CARD · 2026</span>
          </h1>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Fourteen fights. One historic venue. Every casual bettor in America watching. RUBAN maps the board before the noise takes over.
          </p>
          <Countdown className="justify-center mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary text-xl px-12 py-4">ACCESS THE FULL BOARD</Link>
            <Link href="/#free-pick" className="btn-secondary text-xl px-12 py-4">SEE THE FREE READ</Link>
          </div>
        </div>
      </section>

      {/* $1M PROJECTION */}
      <section className="py-16 px-4 bg-elevated/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            $1,000,000+
          </h2>
          <p className="text-xl text-gold font-bold mb-6">Projected member profits — White House card alone</p>
          <p className="text-lg text-muted max-w-3xl mx-auto mb-6 leading-relaxed">
            This is not a marketing number. It is a structural case. 14 fights. Abnormal casual money volume creating specific distortions. RUBAN has been generating exceptional prediction accuracy across events. Members who are positioned early — before the lines move — capture the most value.
          </p>
          <p className="text-sm text-muted/70 max-w-2xl mx-auto">
            Projected profits represent estimated member opportunity based on position sizing and read confidence. Not a guarantee of returns. Past analysis accuracy does not guarantee future results.
          </p>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">WHY THIS CARD IS DIFFERENT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="card">
                <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
                <p className="text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN EVENT MODULE */}
      <section className="py-16 px-4 bg-elevated/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold mb-3">MAIN EVENT · FREE READ</h2>
            <p className="text-muted">RUBAN's public position on the headline fight</p>
          </div>
          <div className="card border-accent/40 shadow-xl">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <span className="text-sm text-muted uppercase tracking-wider">Lightweight · Main Event</span>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">MEDIUM VOLATILITY</span>
            </div>
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
              <div className="relative min-h-[320px] flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
                <div className="absolute left-3 top-8 w-[110px] h-[200px] rounded-2xl overflow-hidden border border-signal-red/30 bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,0.22),transparent_45%),linear-gradient(180deg,#1f2937,#0f172a)]">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-base font-extrabold">TOPURIA</p>
                    <p className="text-xs text-white/70">Pressure · Control</p>
                  </div>
                </div>
                <div className="absolute right-3 top-8 w-[110px] h-[200px] rounded-2xl overflow-hidden border border-indigo/30 bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.22),transparent_45%),linear-gradient(180deg,#111827,#172554)]">
                  <div className="absolute bottom-3 left-3 right-3 text-right">
                    <p className="text-base font-extrabold">GAETHJE</p>
                    <p className="text-xs text-white/70">Violence · Variance</p>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-gold">VS</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-signal-green mb-2">TOPURIA WINS</h3>
                <p className="text-muted mb-4">Decision lean with late-finish upside</p>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-3 bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-signal-green to-green-400" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-2xl font-mono font-bold text-signal-green">68%</span>
                </div>
                <p className="text-muted leading-relaxed mb-4">
                  Topuria's cleaner pressure, positional control, and disciplined sequencing create the better five-round structure. Gaethje's first-wave danger is real — this is not a foregone conclusion.
                </p>
                <Link href="/pricing" className="btn-primary w-full text-center">UNLOCK THE FULL BOARD</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MEMBERS GET */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">WHAT MEMBERS GET</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-12">
            {boardFeatures.map((f) => (
              <div key={f.label} className="card">
                <p className="text-signal-green font-bold mb-1">{f.label}</p>
                <p className="text-muted text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="card border-gold/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-extrabold mb-2">The window closes when the odds move</h3>
              <p className="text-muted">Once fight-week money floods in, the best numbers are gone.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/pricing" className="btn-primary text-center">ACCESS THE FULL BOARD</Link>
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="btn-secondary text-center">JOIN DISCORD</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="py-8 px-4 text-center text-sm text-muted border-t border-white/10">
        No win-rate guarantees. No spam picks. Structured analysis for people who treat the card like a business.
      </div>
    </div>
  );
}
