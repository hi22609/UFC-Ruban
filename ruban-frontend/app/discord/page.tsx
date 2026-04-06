import Link from 'next/link';

export default function Discord() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent rounded-full text-accent text-sm font-bold uppercase tracking-wider">
          Premium Delivery Layer
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          THE INNER CHAMBER
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          The site is the showroom. Discord is where the full board opens up: fight reads, confidence bands, volatility notes, chart visibility, and event-night updates.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
        <div className="card">
          <h3 className="text-2xl font-bold mb-3">📊 Full Matchup Breakdowns</h3>
          <p className="text-muted">
            Detailed reasoning, edge analysis, and context for every fight. No surface-level picks. Users see why the data leans strongest.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">🎯 Confidence + Volatility</h3>
          <p className="text-muted">
            Every serious spot is framed with conviction and risk context. High-confidence spots are separated from higher-variance chaos.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">⏰ Controlled Delivery</h3>
          <p className="text-muted">
            Not spam. Not ten notifications a day. Fight-week drop early, then fight-day updates when the board actually matters.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">📈 Performance Visibility</h3>
          <p className="text-muted">
            Premium members get chart visibility and tracked performance framing so the system feels calculated, not random.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">💬 Member-Only Separation</h3>
          <p className="text-muted">
            Free vs premium separation is intentional. Public gets the showroom. Paid members get the sharp board, premium rooms, and cleaner signal.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">🔒 Private By Design</h3>
          <p className="text-muted">
            This is not built like a public gambling page. It’s structured like a premium intelligence layer for disciplined operators.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-accent mb-3">1</div>
          <h3 className="text-2xl font-bold mb-2">Join</h3>
          <p className="text-muted">Choose your access tier and enter the premium path.</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-accent mb-3">2</div>
          <h3 className="text-2xl font-bold mb-2">Get Access Instructions</h3>
          <p className="text-muted">Receive the Discord entry flow and role path after purchase.</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-accent mb-3">3</div>
          <h3 className="text-2xl font-bold mb-2">Track The Board</h3>
          <p className="text-muted">See the full card, select positions, and event-night movement in one place.</p>
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-muted">Not every fight is worth touching — these are.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/pricing" className="btn-primary text-xl px-10 py-4 text-center">
            GET WHITE HOUSE ACCESS
          </Link>
          <Link href="/methodology" className="btn-secondary text-xl px-10 py-4 text-center">
            SEE HOW WE FRAME EDGE
          </Link>
        </div>
      </div>
    </div>
  );
}
