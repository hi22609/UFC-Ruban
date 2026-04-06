import Link from 'next/link';

const fights = [
  {
    division: 'LIGHTWEIGHT • MAIN EVENT',
    fighter1: 'ILIA TOPURIA',
    fighter2: 'JUSTIN GAETHJE',
    confidence: 68,
    volatility: 'MEDIUM',
    preview: "Topuria's defensive wrestling neutralizes Gaethje's forward pressure. Ilia is better built to control the fight's cleaner phases over five rounds.",
    locked: false,
  },
  {
    division: 'WELTERWEIGHT • CO-MAIN',
    fighter1: 'SHAVKAT RAKHMONOV',
    fighter2: 'SEAN BRADY',
    confidence: 72,
    volatility: 'LOW',
    preview: 'Rakhmonov carries the cleaner layered edge. Pressure, grappling threat, and finishing equity all stack on his side.',
    locked: true,
  },
  {
    division: 'MIDDLEWEIGHT FEATURE',
    fighter1: 'PREMIUM READ',
    fighter2: 'LOCKED POSITION',
    confidence: 61,
    volatility: 'MEDIUM',
    preview: 'Confidence and risk framing available inside Discord.',
    locked: true,
  },
  {
    division: 'LIGHT HEAVYWEIGHT',
    fighter1: 'SELECT EDGE',
    fighter2: 'MEMBERS ONLY',
    confidence: 58,
    volatility: 'HIGH',
    preview: 'Higher variance angle — surfaced only with full context.',
    locked: true,
  },
  {
    division: 'BANTAMWEIGHT',
    fighter1: 'TRACKED POSITION',
    fighter2: 'MEMBERS ONLY',
    confidence: 73,
    volatility: 'LOW',
    preview: 'One of the cleaner reads on the board.',
    locked: true,
  },
  {
    division: 'FEATHERWEIGHT',
    fighter1: 'PREMIUM READ',
    fighter2: 'LOCKED POSITION',
    confidence: 66,
    volatility: 'MEDIUM',
    preview: 'Top-tier edge with controlled risk framing.',
    locked: true,
  },
  {
    division: 'PRELIM FEATURE',
    fighter1: 'SELECT POSITION',
    fighter2: 'MEMBERS ONLY',
    confidence: 54,
    volatility: 'HIGH',
    preview: 'Not every fight is worth touching. This one needs context.',
    locked: true,
  },
  {
    division: 'UNDERCARD',
    fighter1: 'TRACKED SPOT',
    fighter2: 'MEMBERS ONLY',
    confidence: 69,
    volatility: 'MEDIUM',
    preview: 'Disciplined read with clear event-week framing.',
    locked: true,
  },
];

export default function TonightsCard() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <div className="inline-block mb-4 px-4 py-2 bg-signal-red/10 border border-signal-red rounded-full text-signal-red text-sm font-bold uppercase tracking-wider">
          White House Event Board
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          FULL CARD TEASE
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          This is the public-facing edge preview. The complete board, confidence framing, volatility notes, and select positions open up inside Discord.
        </p>
        <p className="mt-4 text-lg text-accent font-bold">
          13 FIGHTS TRACKED • SELECT POSITIONS ONLY
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {fights.map((fight, idx) => (
          <div key={idx} className={`card relative ${fight.locked ? 'opacity-70' : ''}`}>
            {fight.locked && (
              <div className="absolute inset-0 backdrop-blur-sm bg-void/80 rounded-xl flex items-center justify-center z-10">
                <div className="text-center px-4">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-lg font-bold mb-3">UNLOCK INSIDE DISCORD</p>
                  <Link href="/pricing" className="btn-primary text-sm px-6 py-2">
                    GET WHITE HOUSE ACCESS
                  </Link>
                </div>
              </div>
            )}
            <div className={fight.locked ? 'filter blur-sm' : ''}>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <span className="text-sm text-muted uppercase tracking-wider">{fight.division}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  fight.volatility === 'LOW'
                    ? 'bg-signal-green/20 text-signal-green'
                    : fight.volatility === 'MEDIUM'
                    ? 'bg-gold/20 text-gold'
                    : 'bg-signal-red/20 text-signal-red'
                }`}>
                  {fight.volatility} VOLATILITY
                </span>
              </div>
              <div className="text-center py-4">
                <h3 className="text-3xl font-extrabold mb-2">{fight.fighter1}</h3>
                <p className="text-muted mb-2">vs.</p>
                <h3 className="text-3xl font-extrabold mb-6">{fight.fighter2}</h3>
                <div className="flex items-center justify-center gap-4 mb-6 flex-col sm:flex-row">
                  <div className="flex-1 h-3 bg-elevated rounded-full overflow-hidden max-w-md w-full">
                    <div
                      className="h-full bg-gradient-to-r from-signal-green to-green-400 transition-all"
                      style={{ width: `${fight.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-2xl font-mono font-bold text-accent">{fight.confidence}%</span>
                </div>
                <p className="text-muted leading-relaxed max-w-2xl mx-auto">{fight.preview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-accent/20 py-4 px-4 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm font-bold text-center sm:text-left">
            Full White House board lives inside Discord.
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-8 py-3 w-full sm:w-auto text-center">
            GET WHITE HOUSE ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
}
