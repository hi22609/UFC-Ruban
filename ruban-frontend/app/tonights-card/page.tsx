import Link from 'next/link';

export default function TonightsCard() {
  const fights = [
    {
      division: "LIGHTWEIGHT • MAIN EVENT",
      fighter1: "ILIA TOPURIA",
      fighter2: "JUSTIN GAETHJE",
      confidence: 68,
      volatility: "MEDIUM",
      preview: "Topuria's defensive wrestling neutralizes Gaethje's forward pressure. Ilia out-points him over 5 rounds. Gaethje's durability is compromised after recent wars.",
      locked: false,
    },
    {
      division: "WELTERWEIGHT • CO-MAIN",
      fighter1: "SHAVKAT RAKHMONOV",
      fighter2: "SEAN BRADY",
      confidence: 72,
      volatility: "LOW",
      preview: "Rakhmonov's grappling and finishing rate dominate. Brady has no clear path to victory.",
      locked: true,
    },
    // Add 11 more fights (locked)
    ...Array(11).fill(null).map((_, i) => ({
      division: `FIGHT #${i + 3}`,
      fighter1: "FIGHTER A",
      fighter2: "FIGHTER B",
      confidence: Math.floor(Math.random() * 30) + 50,
      volatility: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      preview: "Full breakdown available inside Discord.",
      locked: true,
    })),
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Hero */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <div className="inline-block mb-4 px-4 py-2 bg-signal-red/10 border border-signal-red rounded-full text-signal-red text-sm font-bold uppercase tracking-wider">
          🔴 LIVE EVENT
        </div>
        <h1 className="text-6xl font-extrabold mb-4">
          UFC 322: WHITE HOUSE
        </h1>
        <p className="text-xl text-muted">
          April 19, 2026 • Washington D.C.
        </p>
        <p className="mt-4 text-lg text-accent font-bold">
          13 FIGHTS ANALYZED
        </p>
      </div>

      {/* Fight Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {fights.map((fight, idx) => (
          <div key={idx} className={`card relative ${fight.locked ? 'opacity-60' : ''}`}>
            {fight.locked && (
              <div className="absolute inset-0 backdrop-blur-sm bg-void/80 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-lg font-bold mb-3">UNLOCK IN DISCORD</p>
                  <Link href="/pricing" className="btn-primary text-sm px-6 py-2">
                    JOIN NOW
                  </Link>
                </div>
              </div>
            )}
            <div className={fight.locked ? 'filter blur-sm' : ''}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted uppercase tracking-wider">{fight.division}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  fight.volatility === 'LOW' ? 'bg-signal-green/20 text-signal-green' :
                  fight.volatility === 'MEDIUM' ? 'bg-gold/20 text-gold' :
                  'bg-signal-red/20 text-signal-red'
                }`}>
                  {fight.volatility} VOLATILITY
                </span>
              </div>
              <div className="text-center py-4">
                <h3 className="text-3xl font-extrabold mb-2">{fight.fighter1}</h3>
                <p className="text-muted mb-2">vs.</p>
                <h3 className="text-3xl font-extrabold mb-6">{fight.fighter2}</h3>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex-1 h-3 bg-elevated rounded-full overflow-hidden max-w-md">
                    <div 
                      className="h-full bg-gradient-to-r from-signal-green to-green-400 transition-all" 
                      style={{width: `${fight.confidence}%`}}
                    ></div>
                  </div>
                  <span className="text-2xl font-mono font-bold text-accent">{fight.confidence}%</span>
                </div>
                <p className="text-muted leading-relaxed max-w-2xl mx-auto">
                  {fight.preview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-accent/20 py-4 px-4 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm font-bold">
            🔒 Full event breakdown inside Discord
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-8 py-3">
            JOIN NOW — $20/mo
          </Link>
        </div>
      </div>
    </div>
  );
}
