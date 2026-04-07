import Link from 'next/link';
import Countdown from '../components/Countdown';
import predictionsData from '../data/predictions.json';

const mainEvent =
  predictionsData.predictions.find((p) => p.is_main_event) ||
  predictionsData.predictions[0];
const eventName = predictionsData.event_name;

const pillars = [
  {
    title: 'Casual Money Flood',
    body:
      'The White House card pulls in the widest casual audience UFC has seen in years. Millions of untrained bettors flooding lines with emotional, unstructured money. That irrational volume spikes favorites, inflates props, and creates specific distortions fight by fight.',
  },
  {
    title: 'Early Position Window',
    body:
      'Edges exist before fight week. After the attention spike, lines move fast and value compresses. Members who get the full board now — before the casual money floods in — get reads at better numbers with cleaner framing.',
  },
  {
    title: 'Board Depth',
    body:
      'A fourteen-fight card with a historic main event creates room to find clean positions beyond the obvious headline. The whole board is worth mapping. When confidence on a fight isn&apos;t high enough, members don&apos;t get a forced read.',
  },
];

export default function WhiteHousePage() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        style={{
          padding: '84px 0 72px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold glow */}
        <div
          style={{
            position: 'absolute',
            inset: '0 0 auto 0',
            height: 400,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <span className="eyebrow-dot" />
            Special Event · War Room
          </div>

          <span
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              fontSize: '0.76rem',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 16,
            }}
          >
            June 14 · 2026 · Live Event
          </span>

          <h1
            style={{
              fontSize: 'clamp(4rem, 9vw, 8rem)',
              lineHeight: 0.87,
              marginBottom: 22,
            }}
          >
            White House<br />
            <span className="text-gradient-gold">Card · June 14</span>
          </h1>

          <p
            style={{
              fontSize: '1.12rem',
              lineHeight: 1.65,
              color: '#d1d9e8',
              maxWidth: 640,
              margin: '0 auto 28px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Fourteen fights. One historic venue. Every casual bettor in America watching.
            RUBAN maps the full board before the noise takes over.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 32,
            }}
          >
            <Countdown />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link href="/pricing" className="btn-primary" style={{ padding: '0 36px' }}>
              Access The Full Board
            </Link>
            <Link href="/#free-pick" className="btn-secondary" style={{ padding: '0 36px' }}>
              See The Free Read
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          $1M PROJECTION
      ══════════════════════════════════════ */}
      <section
        style={{
          padding: '80px 0',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          background: 'rgba(12,14,22,0.55)',
          textAlign: 'center',
        }}
      >
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <span className="eyebrow-dot" />
            Profit Projection
          </div>
          <p
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(4rem, 10vw, 7rem)',
              color: 'var(--gold)',
              lineHeight: 0.9,
              marginBottom: 12,
            }}
          >
            $1,000,000+
          </p>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--gold)',
              fontWeight: 700,
              marginBottom: 20,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Projected member profits — White House card alone
          </p>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--muted)',
              maxWidth: 700,
              margin: '0 auto 14px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            This is not a marketing number. It&apos;s a structural case. 14 fights.
            Abnormal casual money volume creating specific distortions. Members who are
            positioned early — before lines move — capture the most value.
          </p>
          <p
            style={{
              fontSize: '0.78rem',
              color: '#4b5563',
              maxWidth: 520,
              margin: '0 auto',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6,
            }}
          >
            Projected profits represent estimated member opportunity based on position sizing
            and read confidence. Not a guarantee of returns.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          THREE PILLARS
      ══════════════════════════════════════ */}
      <section style={{ padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}
            >
              Why This Card Is Different
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
            {pillars.map((p) => (
              <div key={p.title} className="card">
                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.5rem',
                    marginBottom: 12,
                    color: 'var(--gold)',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                  }}
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAIN EVENT MODULE
      ══════════════════════════════════════ */}
      <section
        style={{
          padding: '80px 0',
          borderTop: '1px solid var(--line)',
          background: 'rgba(12,14,22,0.55)',
        }}
      >
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              Free Read
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 0.95,
                marginBottom: 10,
              }}
            >
              Main Event · Public Read
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
              }}
            >
              RUBAN&apos;s structural position on the headline fight
            </p>
          </div>

          <div
            className="card"
            style={{
              border: '1px solid rgba(139,92,246,0.25)',
              maxWidth: 860,
              margin: '0 auto',
              padding: 32,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--muted)',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {mainEvent.weight_class} · Main Event · {eventName}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    color: 'var(--gold)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {mainEvent.tier}
                </span>
                <span
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--muted)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Medium Volatility
                </span>
              </div>
            </div>

            <div
              className="two-col"
              style={{
                display: 'grid',
                gridTemplateColumns: '0.85fr 1.15fr',
                gap: 32,
                alignItems: 'center',
              }}
            >
              {/* Fighter visual */}
              <div
                style={{
                  minHeight: 280,
                  borderRadius: 20,
                  border: '1px solid var(--card-border)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* top glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 140,
                    background:
                      'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Left fighter card */}
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 16,
                    width: '42%',
                    bottom: 16,
                    borderRadius: 16,
                    border: '1px solid rgba(239,68,68,0.3)',
                    background:
                      'radial-gradient(ellipse at 50% 20%, rgba(239,68,68,0.2) 0%, transparent 55%), linear-gradient(180deg, #1f2937, #0f172a)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 10,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        marginBottom: 3,
                      }}
                    >
                      {mainEvent.fighter1.split(' ').slice(-1)[0]}
                    </p>
                    <p
                      style={{
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Pressure
                    </p>
                  </div>
                </div>

                {/* VS badge */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    border: '1px solid rgba(251,191,36,0.3)',
                    background: 'radial-gradient(circle, rgba(251,191,36,0.22), rgba(6,7,11,0.9))',
                    boxShadow: '0 0 24px rgba(251,191,36,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1.4rem',
                      color: 'var(--gold)',
                    }}
                  >
                    VS
                  </span>
                </div>

                {/* Right fighter card */}
                <div
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 16,
                    width: '42%',
                    bottom: 16,
                    borderRadius: 16,
                    border: '1px solid rgba(79,70,229,0.3)',
                    background:
                      'radial-gradient(ellipse at 50% 20%, rgba(79,70,229,0.2) 0%, transparent 55%), linear-gradient(180deg, #111827, #172554)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 10,
                    textAlign: 'right',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <p
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        marginBottom: 3,
                      }}
                    >
                      {mainEvent.fighter2.split(' ').slice(-1)[0]}
                    </p>
                    <p
                      style={{
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Variance
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div>
                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '2.4rem',
                    color: 'var(--green)',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {mainEvent.winner} Wins
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.88rem',
                    marginBottom: 18,
                  }}
                >
                  {mainEvent.method} lean · {mainEvent.fighter1} vs {mainEvent.fighter2}
                </p>

                {/* Confidence bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginBottom: 20,
                  }}
                >
                  <div className="conf-bar">
                    <span style={{ width: `${mainEvent.confidence}%` }} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '2rem',
                      color: 'var(--green)',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {mainEvent.confidence}%
                  </span>
                </div>

                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    marginBottom: 22,
                  }}
                >
                  {mainEvent.analysis.length > 220
                    ? mainEvent.analysis.slice(0, 220) + '…'
                    : mainEvent.analysis}
                </p>

                <Link
                  href="/pricing"
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  Unlock The Full Board
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BLOCK
      ══════════════════════════════════════ */}
      <section
        style={{
          padding: '80px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="wrap">
          <div
            className="card"
            style={{
              border: '1px solid rgba(251,191,36,0.2)',
              padding: '40px 36px',
              maxWidth: 820,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 24,
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                    lineHeight: 0.95,
                    marginBottom: 10,
                  }}
                >
                  The window closes<br />when the odds move
                </h2>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    lineHeight: 1.55,
                    maxWidth: 420,
                  }}
                >
                  Once fight-week money floods in, the best numbers are gone. Early
                  members get the full board before the market gets loud.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flexShrink: 0 }}>
                <Link href="/pricing" className="btn-primary">
                  Access The Full Board
                </Link>
                <Link
                  href="https://discord.gg/yymtuNQwqC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Join Discord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div
        style={{
          padding: '24px 16px',
          borderTop: '1px solid var(--line)',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.8rem',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.6,
        }}
      >
        Analysis only — not financial or betting advice. Structured fight intelligence
        for informational purposes. Bet responsibly.
      </div>
    </>
  );
}
