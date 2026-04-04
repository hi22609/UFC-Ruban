import Link from 'next/link';

export default function Discord() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-6">
          THE INNER CHAMBER
        </h1>
        <p className="text-xl text-muted">
          Full fight reads. Premium drops. High-signal discussion. Event-night edge.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 mb-12">
        <div className="card">
          <h3 className="text-2xl font-bold mb-3">📊 Full Matchup Breakdowns</h3>
          <p className="text-muted">
            Detailed reasoning, edge analysis, and context for every fight. No surface-level picks.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">⏰ Premium Event-Week Drops</h3>
          <p className="text-muted">
            Early access 48 hours before fight night for Syndicate members. Line value before the market moves.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">🔴 Live Event-Night Updates</h3>
          <p className="text-muted">
            Line movement tracking. Late breaking news. Injury updates. Real-time adjustments.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">💬 Member-Only Channels</h3>
          <p className="text-muted">
            #premium-picks, #strategy, #results. High-signal discussion. No lurkers. Paid members only.
          </p>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold mb-3">🔒 Gated Access</h3>
          <p className="text-muted">
            This is not a public server. Premium membership required. Serious operators only.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/pricing" className="btn-primary text-xl px-12 py-4">
          JOIN DISCORD — $20/mo
        </Link>
      </div>
    </div>
  );
}
