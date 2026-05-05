import Link from 'next/link';
import trackRecordData from '../data/trackRecord.json';

const { summary, lastRecorded, rows } = trackRecordData;

export default function TrackRecordPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '88px 0 96px' }}>
      <div className="wrap">
        <div style={{ maxWidth: 760, margin: '0 auto 44px', textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
            <span className="eyebrow-dot" />
            Verified Record
          </div>
          <h1 style={{ fontSize: 'clamp(3.2rem, 7vw, 5.6rem)', lineHeight: 0.9, marginBottom: 14 }}>
            Proof Builds Trust
          </h1>
          <p
            style={{
              color: 'var(--muted)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            RUBAN keeps the public record clean. Real calls. Real outcomes. No padded dashboards and no fake performance theater.
          </p>
        </div>

        <div
          className="card"
          style={{
            maxWidth: 920,
            margin: '0 auto 28px',
            border: '1px solid rgba(16,185,129,0.2)',
            padding: '30px 28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ color: lastRecorded.result === 'Correct' ? 'var(--green)' : '#ef4444', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
                Last Recorded Result
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 0.92, marginBottom: 10 }}>
                {lastRecorded.fighter} {lastRecorded.result === 'Correct' ? '✅' : '❌'}
              </h2>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.65, maxWidth: 520 }}>
                {lastRecorded.note}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(88px, 1fr))', gap: 12, minWidth: 'min(100%, 420px)' }}>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Wins</div>
                <div style={{ fontSize: '1.4rem', lineHeight: 0.95 }}>{summary.wins}</div>
              </div>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Losses</div>
                <div style={{ fontSize: '1.4rem', lineHeight: 0.95 }}>{summary.losses}</div>
              </div>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Rate</div>
                <div style={{ fontSize: '1.4rem', lineHeight: 0.95 }}>{summary.winRate}%</div>
              </div>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Last Call</div>
                <div style={{ fontSize: '1.1rem', lineHeight: 1 }}>{lastRecorded.confidence}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 920, margin: '0 auto 28px', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                <th style={{ padding: '0 0 16px', textAlign: 'left' }}>Event</th>
                <th style={{ padding: '0 0 16px', textAlign: 'left' }}>Fight</th>
                <th style={{ padding: '0 0 16px', textAlign: 'left' }}>Call</th>
                <th style={{ padding: '0 0 16px', textAlign: 'left' }}>Confidence</th>
                <th style={{ padding: '0 0 16px', textAlign: 'left' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.event}-${row.fight}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 0', color: 'var(--muted)' }}>{row.event}</td>
                  <td style={{ padding: '18px 0', color: 'var(--text)' }}>{row.fight}</td>
                  <td style={{ padding: '18px 0', fontWeight: 700 }}>{row.call}</td>
                  <td style={{ padding: '18px 0' }}>{row.confidence}%</td>
                  <td style={{ padding: '18px 0', color: row.result === 'Correct' ? 'var(--green)' : '#ef4444', fontWeight: 700 }}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ maxWidth: 920, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--gold)', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
              Public Tracking
            </p>
            <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.65, maxWidth: 520 }}>
              This page updates as major public reads get logged. Current fight-week premium structure still lives inside Discord.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="btn-secondary">
              Join Discord
            </Link>
            <Link href="/pricing" className="btn-primary">
              Get Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
