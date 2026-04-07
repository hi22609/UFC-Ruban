import Link from 'next/link';

const recordRows = [
  {
    event: 'UFC Fight Night: Moicano vs. Duncan',
    fight: 'Renato Moicano vs Drew Duncan',
    call: 'Renato Moicano',
    confidence: 68,
    result: 'Correct',
    note: 'Main-event read landed. Correctly called by RUBAN.',
  },
];

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
              <p style={{ color: 'var(--green)', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
                Last Recorded Hit
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 0.92, marginBottom: 10 }}>
                Renato Moicano ✅
              </h2>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.65, maxWidth: 520 }}>
                RUBAN called Moicano correctly on the previous card. Clean read. Logged result.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(110px, 1fr))', gap: 12, minWidth: 'min(100%, 360px)' }}>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Call</div>
                <div style={{ fontSize: '1.4rem', lineHeight: 0.95 }}>Moicano</div>
              </div>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Confidence</div>
                <div style={{ fontSize: '1.4rem', lineHeight: 0.95 }}>68%</div>
              </div>
              <div className="card" style={{ padding: '16px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Result</div>
                <div style={{ fontSize: '1.4rem', lineHeight: 0.95, color: 'var(--green)' }}>Hit</div>
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
              {recordRows.map((row) => (
                <tr key={row.fight} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 0', color: 'var(--muted)' }}>{row.event}</td>
                  <td style={{ padding: '18px 0', color: 'var(--text)' }}>{row.fight}</td>
                  <td style={{ padding: '18px 0', fontWeight: 700 }}>{row.call}</td>
                  <td style={{ padding: '18px 0' }}>{row.confidence}%</td>
                  <td style={{ padding: '18px 0', color: 'var(--green)', fontWeight: 700 }}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ maxWidth: 920, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--gold)', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
              Next Layer
            </p>
            <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.65, maxWidth: 520 }}>
              More verified results will be added here as the tracked record grows. Current fight-week reads stay inside Discord.
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
