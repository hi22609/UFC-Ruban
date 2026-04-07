import Link from 'next/link';
import Countdown from '../components/Countdown';
import predictionsData from '../data/predictions.json';

const freePick = predictionsData.predictions.find((p) => p.is_main_event) || predictionsData.predictions[0];
const eventName = predictionsData.event_name;
const f1Name = freePick.fighter1.split(' ').slice(-1)[0];
const f2Name = freePick.fighter2.split(' ').slice(-1)[0];

const pillars = [
  {
    title: 'The Casual Money Flood',
    body: 'The White House card pulls in the widest casual audience UFC has seen in years. Mainstream attention means millions of untrained bettors flooding lines with emotional, unstructured money. That irrational volume spikes favorites, inflates props, and creates specific distortions fight by fight.',
  },
  {
    title: 'The Early Position Window',
    body: 'Edges exist before fight week. After the attention spike, lines move fast and the value compresses. Members who get the full board now — before the casual money floods in — get reads at better numbers, with cleaner framing before the noise takes over.',
  },
  {
    title: 'The $1M Projection',
    body: 'Based on member position sizing, board depth, and historical read confidence, we project over $1,000,000 in combined member profits from this card alone. That is not a guarantee. It is a structural case built on 14 fights, an abnormal attention spike, and disciplined execution.',
  },
];

const boardFeatures = [
  { label: '14 Fights', desc: 'Full card coverage, every position framed' },
  { label: 'Pre-Movement Reads', desc: 'Delivered before fight-week line compression' },
  { label: 'Confidence Scoring', desc: 'No fake locks — every read comes with a number' },
  { label: 'Volatility Tags', desc: 'Know the risk before you act' },
  { label: 'Structural Reasoning', desc: 'Why the read exists, not just who to pick' },
  { label: 'Private Discord', desc: 'Board lives in the member room, organized by fight' },
];

export default function WhiteHousePage() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        padding: '84px 0 68px',
        borderBottom: '1px solid var(--line)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 480,
          background: 'radial-gradient(circle at 50% 10%, rgba(251,191,36,0.07), transparent 32%)',
          pointerEvents: 'none',
        }} />
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <span className="eyebrow-dot" />
            Special Event · War Room
          </div>

          <div style={{
            display: 'inline-block',
            margin: '0 auto 18px',
            padding: '7px 16px',
            borderRadius: 999,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#ef4444',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: 'Inter, sans-serif',
          }}>
            April 12 · 2026 · Live Event
          </div>

          <h1 style={{
            fontSize: 'clamp(4.4rem, 10vw, 8.4rem)',
            lineHeight: 0.84,
            marginBottom: 22,
          }}>
            WHITE HOUSE<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--gold), #fef08a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>CARD · 2026</span>
          </h1>

          <p style={{
            fontSize: '1.18rem',
            lineHeight: 1.58,
            color: '#edf2f7',
            maxWidth: 680,
            margin: '0 auto 22px',
            fontFamily: 'Inter, sans-serif',
          }}>
            Fourteen fights. One historic venue. Every casual bettor in America watching. RUBAN maps the board before the noise takes over.
          </p>

          <Countdown className="justify-center mb-8" />

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 26 }}>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: '1rem', padding: '0 32px' }}>
              ACCESS THE FULL BOARD
            </Link>
            <Link href="/#free-pick" className="btn-secondary" style={{ fontSize: '1rem', padding: '0 32px' }}>
              SEE THE FREE READ
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          $1M PROJECTION
      ══════════════════════════════════════ */}
      <section style={{ padding: '84px 0', background: 'rgba(14,17,27,0.55)' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <span className="eyebrow-dot" />
            Profit Projection
          </div>
          <h2 style={{
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            lineHeight: 0.9,
            marginBottom: 12,
            color: 'var(--gold)',
          }}>
            $1,000,000+
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--gold)',
            fontWeight: 700,
            marginBottom: 20,
            fontFamily: 'Inter, sans-serif',
          }}>
            Projected member profits — White House card alone
          </p>
          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.68,
            color: 'var(--muted)',
            maxWidth: 740,
            margin: '0 auto 18px',
            fontFamily: 'Inter, sans-serif',
          }}>
            This is not a marketing number. It is a structural case. 14 fights. Abnormal casual money volume creating specific distortions. RUBAN has been generating exceptional prediction accuracy across events. Members who are positioned early — before the lines move — capture the most value.
          </p>
          <p style={{
            fontSize: '0.82rem',
            color: 'rgba(156,163,175,0.65)',
            maxWidth: 540,
            margin: '0 auto',
            fontFamily: 'Inter, sans-serif',
          }}>
            Projected profits represent estimated member opportunity based on position sizing and read confidence. Not a guarantee of returns. Past analysis accuracy does not guarantee future results.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          THREE PILLARS
      ══════════════════════════════════════ */}
      <section style={{ padding: '84px 0', borderTop: '1px solid var(--line)' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 42px' }}>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95 }}>
              WHY THIS CARD IS DIFFERENT
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }} className="triple-responsive">
            {pillars.map((p) => (
              <div key={p.title} className="card">
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 12 }}>{p.title}</h3>
                <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAIN EVENT MODULE
      ══════════════════════════════════════ */}
      <section style={{ padding: '84px 0', background: 'rgba(14,17,27,0.55)', borderTop: '1px solid var(--line)' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 42 }}>
            <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              Free Read
            </div>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95, marginBottom: 10 }}>
              MAIN EVENT · FREE READ
            </h2>
            <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}>
              RUBAN&apos;s public position on the headline fight
            </p>
          </div>

          <div className="card" style={{ border: '1px solid rgba(139,92,246,0.3)', maxWidth: 900, margin: '0 auto', padding: '28px 28px' }}>
            {/* Header row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 26,
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <span style={{
                fontSize: '0.82rem',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                fontFamily: 'Inter, sans-serif',
              }}>
                {freePick.weight_class} · Main Event · {eventName}
              </span>
              <span style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: 'rgba(251,191,36,0.15)',
                color: 'var(--gold)',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: '1px solid rgba(251,191,36,0.25)',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                MEDIUM VOLATILITY
              </span>
            </div>

            {/* Two-col layout: fighter stage + analysis */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 28, alignItems: 'center' }} className="fight-card-responsive">

              {/* Fighter visual */}
              <div style={{
                position: 'relative',
                minHeight: 300,
                borderRadius: 22,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* gold top glow */}
                <div style={{
                  position: 'absolute',
                  inset: '-10% 10% auto',
                  height: 160,
                  background: 'radial-gradient(circle, rgba(251,191,36,0.14), transparent 56%)',
                  filter: 'blur(20px)',
                  opacity: 0.8,
                  pointerEvents: 'none',
                }} />

                {/* Left fighter card */}
                <div style={{
                  position: 'absolute',
                  left: 12,
                  top: 20,
                  width: 120,
                  height: 220,
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid rgba(239,68,68,0.32)',
                  background: 'radial-gradient(circle at 50% 20%, rgba(239,68,68,0.22), transparent 46%), linear-gradient(180deg, #1f2937, #0f172a)',
                }}>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.25rem', lineHeight: 1, marginBottom: 3 }}>{f1Name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pressure · Control</p>
                  </div>
                </div>

                {/* Right fighter card */}
                <div style={{
                  position: 'absolute',
                  right: 12,
                  top: 20,
                  width: 120,
                  height: 220,
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid rgba(79,70,229,0.32)',
                  background: 'radial-gradient(circle at 50% 20%, rgba(79,70,229,0.22), transparent 46%), linear-gradient(180deg, #111827, #172554)',
                }}>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.25rem', lineHeight: 1, marginBottom: 3 }}>{f2Name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Violence · Variance</p>
                  </div>
                </div>

                {/* VS badge */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '1px solid rgba(251,191,36,0.3)',
                  background: 'radial-gradient(circle, rgba(251,191,36,0.26), rgba(9,10,14,0.78))',
                  boxShadow: '0 0 32px rgba(251,191,36,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.7rem', color: 'var(--gold)' }}>VS</span>
                </div>
              </div>

              {/* Analysis */}
              <div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.6rem', color: 'var(--green)', marginBottom: 6, lineHeight: 1 }}>
                  {freePick.winner} WINS
                </h3>
                <p style={{ color: 'var(--muted)', marginBottom: 20, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                  {freePick.method} lean with finish upside
                </p>

                {/* Confidence bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                  <div className="conf-bar">
                    <span style={{ width: `${freePick.confidence}%` }} />
                  </div>
                  <span style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '2.4rem',
                    color: 'var(--green)',
                    lineHeight: 1,
                  }}>
                    {freePick.confidence}%
                  </span>
                </div>

                <p style={{
                  color: 'var(--muted)',
                  lineHeight: 1.65,
                  marginBottom: 22,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.93rem',
                }}>
                  {freePick.analysis.slice(0, 220)}&hellip;
                </p>

                <Link href="/pricing" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  UNLOCK THE FULL BOARD
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHAT MEMBERS GET
      ══════════════════════════════════════ */}
      <section style={{ padding: '84px 0', borderTop: '1px solid var(--line)' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 42px' }}>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95 }}>
              WHAT MEMBERS GET
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 40 }} className="triple-responsive">
            {boardFeatures.map((f) => (
              <div key={f.label} className="card">
                <p style={{ color: 'var(--green)', fontWeight: 700, marginBottom: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>{f.label}</p>
                <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="card" style={{ border: '1px solid rgba(251,191,36,0.25)', padding: '28px 28px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}>
              <div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', marginBottom: 8 }}>
                  The window closes when the odds move
                </h3>
                <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                  Once fight-week money floods in, the best numbers are gone.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/pricing" className="btn-primary">ACCESS THE FULL BOARD</Link>
                <Link href="https://discord.gg/yymtuNQwqC" target="_blank" className="btn-secondary">JOIN DISCORD</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div style={{
        padding: '28px 16px',
        textAlign: 'center',
        borderTop: '1px solid var(--line)',
        color: 'var(--muted)',
        fontSize: '0.86rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        No win-rate guarantees. No spam picks. Structured analysis for people who treat the card like a business.
      </div>
    </>
  );
}
