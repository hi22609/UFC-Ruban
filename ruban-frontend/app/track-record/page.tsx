import Link from 'next/link';

const ledgerRows = [
  { event: 'UFC White House', fight: 'Topuria vs Gaethje', pick: 'Topuria', confidence: 68, volatility: 'Medium', result: 'Pending' },
  { event: 'UFC White House', fight: 'Zhang vs Suarez', pick: 'Pending', confidence: null, volatility: 'Pending', result: 'Pending' },
  { event: 'UFC White House', fight: 'Holloway vs Oliveira', pick: 'Pending', confidence: null, volatility: 'Pending', result: 'Pending' },
];

export default function TrackRecordPage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm font-bold uppercase tracking-wider">
            The Ledger
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5">TRACK RECORD</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Verifiable history for site and Discord predictions. Structure first. No mock wins. No vanity reporting.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <div className="card"><p className="text-xs uppercase tracking-wider text-muted mb-2">Total Picks</p><p className="text-3xl font-extrabold">—</p></div>
          <div className="card"><p className="text-xs uppercase tracking-wider text-muted mb-2">Win Rate</p><p className="text-3xl font-extrabold">—%</p></div>
          <div className="card"><p className="text-xs uppercase tracking-wider text-muted mb-2">Average Confidence</p><p className="text-3xl font-extrabold">—%</p></div>
          <div className="card"><p className="text-xs uppercase tracking-wider text-muted mb-2">Current Streak</p><p className="text-3xl font-extrabold">—</p></div>
        </div>

        <div className="card mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold mb-2">Discord Sync</p>
            <p className="text-muted">Live tracking updates in Discord. Webhook-ready structure, no mock data displayed.</p>
          </div>
          <Link href="/discord" className="btn-secondary text-center">See Discord Flow</Link>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-muted">
                <th className="py-4 pr-4">Event</th>
                <th className="py-4 pr-4">Fight</th>
                <th className="py-4 pr-4">Pick</th>
                <th className="py-4 pr-4">Confidence</th>
                <th className="py-4 pr-4">Volatility</th>
                <th className="py-4">Result</th>
              </tr>
            </thead>
            <tbody>
              {ledgerRows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 text-sm text-white/90">
                  <td className="py-4 pr-4">{row.event}</td>
                  <td className="py-4 pr-4">{row.fight}</td>
                  <td className="py-4 pr-4 font-semibold">{row.pick}</td>
                  <td className="py-4 pr-4">{row.confidence ? `${row.confidence}%` : '—'}</td>
                  <td className="py-4 pr-4">{row.volatility}</td>
                  <td className="py-4">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
