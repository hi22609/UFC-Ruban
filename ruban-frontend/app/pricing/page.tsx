import Link from 'next/link';

const monthlyLink =
  process.env.NEXT_PUBLIC_STRIPE_MONTHLY_LINK || 'https://discord.gg/yymtuNQwqC';
const annualLink =
  process.env.NEXT_PUBLIC_STRIPE_ANNUAL_LINK || 'https://discord.gg/yymtuNQwqC';

const featureListStyle: React.CSSProperties = {
  listStyle: 'none',
  display: 'grid',
  gap: 12,
  margin: '20px 0 28px',
};

const featureItemStyle: React.CSSProperties = {
  color: 'var(--muted)',
  fontSize: '0.92rem',
  fontFamily: 'Inter, sans-serif',
  paddingLeft: 22,
  position: 'relative',
  lineHeight: 1.55,
};

export default function Pricing() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ padding: '80px 0 64px', textAlign: 'center' }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <span className="eyebrow-dot" />
            Access
          </div>
          <h1
            style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              lineHeight: 0.9,
              marginBottom: 18,
            }}
          >
            Choose Your{' '}
            <span className="text-gradient">Access Level</span>
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.65,
              color: 'var(--muted)',
              maxWidth: 560,
              margin: '0 auto',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Full-card reads, confidence ratings, volatility flags, and private Discord
            delivery. Two tiers. One system. No noise.
          </p>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
              gap: 24,
              maxWidth: 840,
              margin: '0 auto',
            }}
            className="two-col"
          >
            {/* ── Operator ── */}
            <div className="card" style={{ padding: 36 }}>
              <h2
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '2rem',
                  marginBottom: 6,
                }}
              >
                Operator
              </h2>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: 20,
                  lineHeight: 1.55,
                }}
              >
                Monthly access for active fight weeks and full card coverage.
              </p>

              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '4rem',
                    lineHeight: 1,
                  }}
                >
                  $20
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  /month
                </span>
              </div>

              <ul style={featureListStyle}>
                {[
                  'Full card reads — every event',
                  'Confidence + volatility indicators per fight',
                  'Private Discord premium access',
                  'Fight-day updates and line notes',
                  'Structured member delivery for the full card',
                ].map((f, i) => (
                  <li key={i} style={featureItemStyle}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--green)',
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={monthlyLink}
                className="btn-secondary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                Get Operator Access
              </a>
            </div>

            {/* ── Syndicate ── */}
            <div
              className="card"
              style={{
                padding: 36,
                border: '1px solid rgba(251,191,36,0.28)',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '6px 16px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--gold), #fef08a)',
                  color: '#06070b',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                Best Value · Save $120/yr
              </span>

              <h2
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '2rem',
                  marginBottom: 6,
                  color: 'var(--gold)',
                }}
              >
                Syndicate
              </h2>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: 20,
                  lineHeight: 1.55,
                }}
              >
                Annual access for disciplined operators who want the full RUBAN layer.
              </p>

              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '4rem',
                    lineHeight: 1,
                  }}
                >
                  $120
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  /year
                </span>
              </div>

              <ul style={featureListStyle}>
                {[
                  'Everything in Operator',
                  'Earlier event-week access to reads',
                  'Top-tier spots surfaced faster',
                  'Priority access as product expands',
                  'Deepest reporting as new modules go live',
                ].map((f, i) => (
                  <li key={i} style={featureItemStyle}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--green)',
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={annualLink}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                Get Syndicate Access
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        style={{
          padding: '72px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}
            >
              How Access Works
            </h2>
          </div>
          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
              gap: 20,
            }}
          >
            {[
              {
                n: '01',
                title: 'Choose Access',
                body: 'Pick the tier that matches how closely you want to track the card.',
              },
              {
                n: '02',
                title: 'Get Your Discord Path',
                body: 'Receive access instructions after purchase. The board lives in the member room.',
              },
              {
                n: '03',
                title: 'Track The Full Card',
                body: 'Confidence scores, volatility notes, and fight-night updates — delivered before it gets loud.',
              },
            ].map((s) => (
              <div key={s.n} className="card" style={{ textAlign: 'center', padding: '28px 24px' }}>
                <p
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '2.8rem',
                    color: 'var(--purple)',
                    lineHeight: 1,
                    opacity: 0.6,
                    marginBottom: 10,
                  }}
                >
                  {s.n}
                </p>
                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.4rem',
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <section
        style={{
          padding: '56px 0 72px',
          borderTop: '1px solid var(--line)',
          textAlign: 'center',
        }}
      >
        <div className="wrap">
          <div
            style={{
              display: 'flex',
              gap: 32,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 24,
            }}
          >
            {[
              { icon: '🔒', text: 'Cancel anytime' },
              { icon: '💬', text: 'Discord access after purchase' },
              { icon: '⚖️', text: 'Analysis only — not financial advice' },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
          <p
            style={{
              color: '#4b5563',
              fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            RUBAN delivers structured fight analysis. Results are not guaranteed. Past
            read accuracy does not guarantee future results. Bet responsibly.
          </p>
        </div>
      </section>
    </>
  );
}
