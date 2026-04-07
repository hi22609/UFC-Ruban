import Link from 'next/link';

const pillars = [
  {
    title: 'Historic Attention',
    body: 'Fourteen fights. One historic venue. More casual money, more public noise, and more bad framing flooding the market.',
  },
  {
    title: 'Board Compression',
    body: 'RUBAN organizes the full event before the attention spike turns every angle into a loud take.',
  },
  {
    title: 'Disciplined Execution',
    body: 'Confidence, volatility, and structural reads stay attached to each position so the board feels usable, not theatrical.',
  },
];

export default function WhiteHousePage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-signal-red/10 border border-signal-red/40 rounded-full text-signal-red text-sm font-bold uppercase tracking-wider">
            The War Room
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-[0.92]">
            WHITE HOUSE <span className="text-accent">CARD</span>
          </h1>
          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Fourteen fights. One historic venue. Every casual bettor in America watching. RUBAN maps the board before the noise takes over.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch mb-12">
          <div className="relative min-h-[460px] flex items-center justify-center rounded-3xl border border-accent/20 bg-gradient-to-b from-white/5 to-white/[0.02] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="absolute w-[340px] h-[340px] rounded-full bg-accent/15 blur-3xl"></div>
            <div className="absolute bottom-14 w-[260px] h-[260px] rotate-[22deg] rounded-[24%] border border-white/10 bg-white/5"></div>

            <div className="absolute left-4 md:left-8 top-14 w-[150px] md:w-[200px] h-[280px] md:h-[360px] rounded-3xl overflow-hidden border border-signal-red/30 shadow-[0_0_35px_rgba(239,68,68,0.18)] bg-gradient-to-b from-white/10 to-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,0.22),transparent_45%),linear-gradient(180deg,#1f2937,#0f172a)]"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <p className="text-xl md:text-2xl font-extrabold">TOPURIA</p>
                <p className="text-xs md:text-sm text-white/80">Pressure. Control. Cleaner phases.</p>
              </div>
            </div>

            <div className="absolute right-4 md:right-8 top-14 w-[150px] md:w-[200px] h-[280px] md:h-[360px] rounded-3xl overflow-hidden border border-indigo/30 shadow-[0_0_35px_rgba(79,70,229,0.18)] bg-gradient-to-b from-white/10 to-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.22),transparent_45%),linear-gradient(180deg,#111827,#172554)]"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20 text-right">
                <p className="text-xl md:text-2xl font-extrabold">GAETHJE</p>
                <p className="text-xs md:text-sm text-white/80">Violence. Variance. Early danger.</p>
              </div>
            </div>

            <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30 bg-gold/10 shadow-[0_0_35px_rgba(251,191,36,0.18)] flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-extrabold text-gold">VS</span>
            </div>
          </div>

          <div className="card border-accent/30">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <span className="text-sm text-muted uppercase tracking-wider">Main Event Module</span>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                MEDIUM VOLATILITY
              </span>
            </div>

            <div className="pb-6 border-b border-accent/20 mb-6">
              <h2 className="text-4xl font-extrabold mb-3 text-signal-green">TOPURIA WINS</h2>
              <p className="text-muted text-lg mb-5">Decision lean with late-finish upside</p>
              <div className="flex items-center gap-4 flex-col sm:flex-row">
                <div className="flex-1 h-4 bg-elevated rounded-full overflow-hidden w-full">
                  <div className="h-full bg-gradient-to-r from-signal-green to-green-400" style={{ width: '68%' }}></div>
                </div>
                <span className="text-3xl font-mono font-bold text-signal-green">68%</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-accent">Structural Read</h3>
                <p className="text-muted leading-relaxed">
                  Topuria’s cleaner pressure, positional control, and more disciplined sequencing create the better five-round structure. If he keeps the fight inside those lanes, the read holds.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-accent">Risk Analysis</h3>
                <p className="text-muted leading-relaxed">
                  Gaethje still carries first-wave danger. The risk is not theoretical. Early knockout variance is the live counterweight to the cleaner technical side.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="card">
              <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
              <p className="text-muted leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>

        <div className="card mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <h3 className="text-3xl font-extrabold mb-2">The full board is where the value compounds</h3>
            <p className="text-muted max-w-3xl">
              The main event gets attention. The rest of the card is where structure matters most when public noise starts distorting how people see the board.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/pricing" className="btn-primary text-center">ACCESS THE FULL BOARD</Link>
            <Link href="/#free-pick" className="btn-secondary text-center">SEE THE FREE MAIN EVENT READ</Link>
          </div>
        </div>

        <div className="text-center text-sm text-muted border-t border-white/10 pt-8">
          No win-rate guarantees. No spam picks. Structured analysis for people who treat the card like a business.
        </div>
      </div>
    </div>
  );
}
