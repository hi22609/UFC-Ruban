import Link from 'next/link';
import Countdown from './components/Countdown';
import predictionsData from './data/predictions.json';

// ── Data helpers ─────────────────────────────────────────
const monthlyLink =
  process.env.NEXT_PUBLIC_STRIPE_MONTHLY_LINK || 'https://discord.gg/yymtuNQwqC';
const annualLink =
  process.env.NEXT_PUBLIC_STRIPE_ANNUAL_LINK || 'https://discord.gg/yymtuNQwqC';

const mainEvent =
  predictionsData.predictions.find((p) => p.is_main_event) ||
  predictionsData.predictions[0];
const eventName  = predictionsData.event_name;
const lockCount  = predictionsData.predictions.filter((p) => p.tier === 'LOCK').length;
const totalCount = predictionsData.predictions.length;
const lockRate   = Math.round((lockCount / totalCount) * 100);

const sectionStyle = {
  padding: '96px 0',
} as React.CSSProperties;

const dividerStyle = {
  borderTop: '1px solid var(--line)',
} as React.CSSProperties;

export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════ */}
      <section style={{ ...sectionStyle, paddingTop: 80 }}>
        <div className="wrap">
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              gap: 40,
              alignItems: 'center',
            }}
          >
            {/* ── Left: Copy ── */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 22 }}>
                <span className="eyebrow-dot" />
                Premium Fight Intelligence
              </div>

              <h1
                style={{
                  fontSize: 'clamp(3.8rem, 8vw, 7rem)',
                  lineHeight: 0.88,
                  marginBottom: 24,
                }}
              >
                THE EDGE IS<br />
                IN THE{' '}
                <span className="text-gradient">STRUCTURE.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.12rem',
                  lineHeight: 1.65,
                  color: '#d1d9e8',
                  maxWidth: 520,
                  marginBottom: 10,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Full-card reads delivered before the market moves.
                Confidence levels, volatility flags, and structured analysis — 
                not picks, not predictions.
              </p>
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--muted)',
                  maxWidth: 500,
                  marginBottom: 32,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                For operators who treat the card like a business.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <Link href="/pricing" className="btn-primary">
                  Get Access
                </Link>
                <Link href="#free-pick" className="btn-secondary">
                  See Free Read
                </Link>
              </div>
            </div>

            {/* ── Right: This Week's Board panel ── */}
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 24,
                padding: 28,
                boxShadow: 'var(--shadow)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle top glow */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 120,
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: 'var(--muted)',
                    }}
                  >
                    This Week&apos;s Board
                  </span>
                  <span
                    style={{
                      padding: '5px 10px',
                      borderRadius: 999,
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.25)',
                      color: 'var(--green)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Live
                  </span>
                </div>

                {/* Event name */}
                <h2
                  style={{
                    fontSize: '1.1rem',
                    fontFamily: 'Bebas Neue, sans-serif',
                    letterSpacing: '0.04em',
                    color: 'var(--muted)',
                    marginBottom: 4,
                    fontWeight: 400,
                  }}
                >
                  {eventName}
                </h2>

                {/* Main event fighters */}
                <div
                  style={{
                    margin: '16px 0',
                    padding: '16px 0',
                    borderTop: '1px solid var(--line)',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--gold)',
                      marginBottom: 10,
                    }}
                  >
                    Main Event · {mainEvent.weight_class}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: 'Bebas Neue, sans-serif',
                          fontSize: '1.5rem',
                          lineHeight: 1,
                          marginBottom: 3,
                        }}
                      >
                        {mainEvent.fighter1}
                      </p>
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--muted)',
                          fontFamily: 'Inter, sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Pressure · Control
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.2rem',
                        color: 'var(--gold)',
                        lineHeight: 1,
                      }}
                    >
                      VS
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontFamily: 'Bebas Neue, sans-serif',
                          fontSize: '1.5rem',
                          lineHeight: 1,
                          marginBottom: 3,
                        }}
                      >
                        {mainEvent.fighter2}
                      </p>
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--muted)',
                          fontFamily: 'Inter, sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Violence · Variance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.76rem',
                    }}
                  >
                    <span style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                      Confidence
                    </span>
                    <span style={{ color: 'var(--green)', fontWeight: 800 }}>
                      {mainEvent.confidence}%
                    </span>
                  </div>
                  <div className="conf-bar">
                    <span style={{ width: `${mainEvent.confidence}%` }} />
                  </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 20 }}>
                  <Link
                    href="/pricing"
                    className="btn-primary"
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      minHeight: 44,
                    }}
                  >
                    Unlock Full Board
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — WHITE HOUSE URGENCY
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          ...sectionStyle,
          ...dividerStyle,
          borderBottom: '1px solid var(--line)',
          background: 'rgba(12,14,22,0.5)',
        }}
      >
        <div className="wrap">
          <div
            style={{
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: 24,
              padding: '48px 40px',
              background: 'rgba(251,191,36,0.03)',
              textAlign: 'center',
              maxWidth: 860,
              margin: '0 auto',
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              Special Event · April 12, 2026
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 0.95,
                marginBottom: 14,
              }}
            >
              White House Card
              <br />
              <span className="text-gradient-gold">Window Closing</span>
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: '#d1d9e8',
                maxWidth: 620,
                margin: '0 auto 28px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              The biggest casual money event UFC has seen in years. Lines move
              fast once fight week starts. Members locked in now get reads at
              pre-movement numbers.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 32,
                flexWrap: 'wrap',
                marginBottom: 28,
              }}
            >
              <Countdown />
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '2.8rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                  }}
                >
                  $1M+
                </p>
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                  }}
                >
                  Projected Member Pool
                </p>
              </div>
            </div>

            <Link href="/pricing" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0 36px' }}>
              Lock In Before The Odds Move
            </Link>

            <p
              style={{
                fontSize: '0.74rem',
                color: 'var(--muted)',
                marginTop: 14,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Projected from member position sizing and read confidence. Not a
              guarantee of returns.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — FREE PICK
      ══════════════════════════════════════════════════ */}
      <section id="free-pick" style={{ ...sectionStyle }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
            <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              Free Main Event Read
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}
            >
              One Honest Read. In Public.
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '1rem',
                lineHeight: 1.7,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Before you commit to the full board, see how RUBAN frames a fight.
            </p>
          </div>

          <div
            className="two-col"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 20,
              alignItems: 'stretch',
            }}
          >
            {/* Main read card */}
            <div className="card" style={{ padding: 28 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {mainEvent.weight_class} · Main Event · {eventName}
                </span>
                <span
                  style={{
                    padding: '5px 10px',
                    borderRadius: 999,
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    color: 'var(--gold)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {mainEvent.tier}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '2.4rem',
                  color: 'var(--green)',
                  lineHeight: 1,
                  marginBottom: 4,
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

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 22,
                }}
              >
                <div className="conf-bar">
                  <span style={{ width: `${mainEvent.confidence}%` }} />
                </div>
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '2.2rem',
                    color: 'var(--green)',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {mainEvent.confidence}%
                </span>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <h4
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1.1rem',
                      marginBottom: 6,
                      color: 'var(--white)',
                    }}
                  >
                    The Structural Read
                  </h4>
                  <p
                    style={{
                      color: 'var(--muted)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                    }}
                  >
                    {mainEvent.analysis}
                  </p>
                </div>
                {mainEvent.key_factors.slice(0, 2).map((f, i) => (
                  <div key={i}>
                    <h4
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.1rem',
                        marginBottom: 6,
                        color: 'var(--white)',
                      }}
                    >
                      {i === 0 ? 'Why This Direction' : 'Where The Risk Lives'}
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        lineHeight: 1.65,
                      }}
                    >
                      {f}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Board teaser */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.5rem',
                    marginBottom: 16,
                  }}
                >
                  What The Full Board Includes
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'grid',
                    gap: 12,
                    marginBottom: 0,
                  }}
                >
                  {[
                    'Every meaningful fight — not just the main event',
                    'Confidence ratings and volatility flags per read',
                    'Fight-week notes as the market moves',
                    'Private Discord delivery — no public noise',
                    'Structured format for disciplined operators',
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        color: 'var(--muted)',
                        paddingLeft: 18,
                        position: 'relative',
                        fontSize: '0.88rem',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.55,
                      }}
                    >
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
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/pricing"
                className="btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 24 }}
              >
                Access The Full Board
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — SYSTEM STATS
      ══════════════════════════════════════════════════ */}
      <section style={{ ...sectionStyle, ...dividerStyle }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
            <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              System Output
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}
            >
              The Numbers
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Current event data from the live board.
            </p>
          </div>

          <div
            className="four-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 16,
            }}
          >
            {[
              { value: totalCount.toString(), label: 'Fights This Card', color: 'var(--purple)' },
              { value: '—', label: 'Historical Win Rate', color: 'var(--green)' },
              { value: `${lockRate}%`, label: 'Lock Tier Rate', color: 'var(--gold)' },
              { value: `${totalCount}`, label: 'Current Event Reads', color: 'var(--magenta)' },
            ].map((stat, i) => (
              <div
                key={i}
                className="card"
                style={{ textAlign: 'center', padding: '32px 16px' }}
              >
                <p
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '3.2rem',
                    color: stat.color,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--muted)',
                    fontWeight: 700,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section style={{ ...sectionStyle, ...dividerStyle }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Three steps. No funnel. No noise.
            </p>
          </div>

          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                num: '01',
                title: 'Choose Access',
                body: 'Monthly or annual. Both tiers get the same board, same confidence ratings, same private delivery.',
              },
              {
                num: '02',
                title: 'Join Discord',
                body: "Get your invite after purchase. The board lives in the member room — organized by fight, updated through fight week.",
              },
              {
                num: '03',
                title: 'Work The Card',
                body: 'Full card structure, confidence levels, and volatility flags. Your edge delivered before the noise takes over.',
              },
            ].map((step) => (
              <div key={step.num} className="card">
                <p
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '3rem',
                    color: 'var(--purple)',
                    lineHeight: 1,
                    marginBottom: 10,
                    opacity: 0.6,
                  }}
                >
                  {step.num}
                </p>
                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.5rem',
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 6 — PRICING PREVIEW
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          ...sectionStyle,
          ...dividerStyle,
          borderBottom: '1px solid var(--line)',
          background: 'rgba(12,14,22,0.4)',
        }}
      >
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}
            >
              Access
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Two tiers. One system. Built for people who treat the card like a
              business.
            </p>
          </div>

          <div
            className="two-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 20,
              maxWidth: 820,
              margin: '0 auto',
            }}
          >
            {/* Operator */}
            <div className="card" style={{ padding: 32 }}>
              <h3
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.8rem',
                  marginBottom: 4,
                }}
              >
                Operator
              </h3>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.88rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: 20,
                }}
              >
                Monthly access for active fight weeks
              </p>
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '3.5rem',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                $20
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: 'var(--muted)',
                    fontWeight: 400,
                  }}
                >
                  /mo
                </span>
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'grid',
                  gap: 10,
                  margin: '20px 0 24px',
                }}
              >
                {[
                  'Full card reads every event',
                  'Confidence + volatility ratings',
                  'Discord premium access',
                  'Fight-day updates',
                  'Structured member delivery',
                ].map((f, i) => (
                  <li
                    key={i}
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.88rem',
                      fontFamily: 'Inter, sans-serif',
                      paddingLeft: 18,
                      position: 'relative',
                    }}
                  >
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

            {/* Syndicate */}
            <div
              className="card"
              style={{
                padding: 32,
                border: '1px solid rgba(251,191,36,0.25)',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '5px 14px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--gold), #fef08a)',
                  color: '#06070b',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                Best Value
              </span>
              <h3
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.8rem',
                  marginBottom: 4,
                  color: 'var(--gold)',
                }}
              >
                Syndicate
              </h3>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.88rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: 20,
                }}
              >
                Annual access — save $120/year
              </p>
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '3.5rem',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                $120
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: 'var(--muted)',
                    fontWeight: 400,
                  }}
                >
                  /yr
                </span>
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'grid',
                  gap: 10,
                  margin: '20px 0 24px',
                }}
              >
                {[
                  'Everything in Operator',
                  'Earlier event-week access',
                  'Top-tier spots surfaced faster',
                  'Priority access as product expands',
                  'Deepest reporting as new modules go live',
                ].map((f, i) => (
                  <li
                    key={i}
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.88rem',
                      fontFamily: 'Inter, sans-serif',
                      paddingLeft: 18,
                      position: 'relative',
                    }}
                  >
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
    </>
  );
}
