import Link from 'next/link';
import Countdown from './components/Countdown';
import predictionsData from './data/predictions.json';

const freePick = predictionsData.predictions.find((p) => p.is_main_event) || predictionsData.predictions[0];
const eventName = predictionsData.event_name;
const eventDate = predictionsData.event_date;

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section
        className="hero"
        id="hook"
        style={{ position: 'relative', padding: '32px 0 58px' }}
      >
        {/* top gold glow */}
        <div style={{
          content: '',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 560,
          background: 'radial-gradient(circle at 65% 18%, rgba(251,191,36,0.07), transparent 22%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.96fr) minmax(0, 1.04fr)',
            gap: 30,
            alignItems: 'center',
          }} className="hero-grid-responsive">

            {/* ── Left: copy ── */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 18 }}>
                <span className="eyebrow-dot" />
                UFC · White House Event · April 2026
              </div>

              <h1 style={{
                fontSize: 'clamp(4.4rem, 10vw, 8.4rem)',
                lineHeight: 0.84,
                marginBottom: 16,
              }}>
                THE WHITE<br />
                <span className="text-gradient-hero">HOUSE CARD.</span>
              </h1>

              <p style={{
                fontSize: '1.18rem',
                lineHeight: 1.58,
                color: '#edf2f7',
                maxWidth: 590,
                marginBottom: 14,
                fontFamily: 'Inter, sans-serif',
              }}>
                Fourteen fights. One historic venue. Every casual bettor in America watching. RUBAN maps the board before the noise takes over.
              </p>
              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: 'var(--muted)',
                maxWidth: 570,
                marginBottom: 24,
                fontFamily: 'Inter, sans-serif',
              }}>
                Not picks. Not predictions. A structured read of the full card — confidence levels, volatility flags, and fight-by-fight framing — delivered privately before fight week gets loud.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
                <Link href="/pricing" className="btn-primary">Access The Full Board</Link>
                <Link href="#free-pick" className="btn-secondary">See The Free Main Event Read</Link>
              </div>

              {/* mini stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 12,
                maxWidth: 640,
                marginBottom: 14,
              }}>
                <div className="mini-card">
                  <div className="kicker">Event</div>
                  <div className="value">White House · April 2026</div>
                </div>
                <div className="mini-card">
                  <div className="kicker">Coverage</div>
                  <div className="value">Full card, not just the main</div>
                </div>
                <div className="mini-card">
                  <div className="kicker">Delivery</div>
                  <div className="value">Private members only</div>
                </div>
              </div>

              <p style={{
                maxWidth: 620,
                color: '#cfd6df',
                fontSize: '0.86rem',
                lineHeight: 1.55,
                fontFamily: 'Inter, sans-serif',
              }}>
                No win-rate guarantees. No spam picks. Structured analysis for people who treat the card like a business.
              </p>
            </div>

            {/* ── Right: cinematic fight stage ── */}
            <div className="hero-stage">
              <div className="hero-aura" />
              <div className="stage-tag">White House Event · Main Event</div>

              {/* side info card */}
              <div className="stage-side-card">
                <div className="label">The opportunity</div>
                <h3>Historic card. More casual money. Bigger spreads.</h3>
                <p>High-attention events pull in noise that disciplined readers can work against.</p>
              </div>

              <div className="hero-rings" />
              <div className="stage-lines" />

              {/* Left fighter — Topuria */}
              <div className="fighter left" aria-label="Ilia Topuria stylized silhouette">
                <div className="fighter-rim" />
                <div className="fighter-core">
                  <div className="fighter-part fighter-head" />
                  <div className="fighter-part fighter-torso" />
                  <div className="fighter-part fighter-arm arm-a1" />
                  <div className="fighter-part fighter-arm arm-a2" />
                  <div className="fighter-part fighter-forearm forearm-f1" />
                  <div className="fighter-part fighter-forearm forearm-f2" />
                  <div className="fighter-part fighter-glove glove-g1" />
                  <div className="fighter-part fighter-glove glove-g2" />
                  <div className="fighter-part fighter-leg leg-l1" />
                  <div className="fighter-part fighter-leg leg-l2" />
                </div>
                <div className="fighter-label">
                  <div className="fighter-name">Topuria</div>
                  <div className="fighter-meta">Pressure • Control • Tight phases</div>
                </div>
              </div>

              {/* Right fighter — Gaethje */}
              <div className="fighter right" aria-label="Justin Gaethje stylized silhouette">
                <div className="fighter-rim" />
                <div className="fighter-core">
                  <div className="fighter-part fighter-head" />
                  <div className="fighter-part fighter-torso" />
                  <div className="fighter-part fighter-arm arm-a1" />
                  <div className="fighter-part fighter-arm arm-a2" />
                  <div className="fighter-part fighter-forearm forearm-f1" />
                  <div className="fighter-part fighter-forearm forearm-f2" />
                  <div className="fighter-part fighter-glove glove-g1" />
                  <div className="fighter-part fighter-glove glove-g2" />
                  <div className="fighter-part fighter-leg leg-l1" />
                  <div className="fighter-part fighter-leg leg-l2" />
                </div>
                <div className="fighter-label">
                  <div className="fighter-name">Gaethje</div>
                  <div className="fighter-meta">Violence • Variance • Early danger</div>
                </div>
              </div>

              <div className="hero-vs"><span>VS</span></div>

              <div className="story-card">
                <div className="kicker">Main Event · Topuria vs Gaethje</div>
                <h3>Control vs Chaos</h3>
                <p>
                  One man compresses the fight. One man detonates it. RUBAN tells you where the structure holds — and where the danger lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHITE HOUSE URGENCY BLOCK
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '84px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              Biggest Event of the Year
            </div>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95, marginBottom: 16 }}>
              White House Card · April 12 · 2026
            </h2>
            <p style={{
              fontSize: '1.18rem',
              lineHeight: 1.58,
              color: '#edf2f7',
              marginBottom: 14,
              fontFamily: 'Inter, sans-serif',
            }}>
              The largest influx of casual money UFC has seen in years floods this card. Mainstream attention spikes favorites, inflates certain lines, and creates edges that disappear by fight week. Members who are locked in before that happens get the full board read before the market gets loud.
            </p>
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--muted)',
              marginBottom: 28,
              fontFamily: 'Inter, sans-serif',
            }}>
              We are projecting over{' '}
              <span style={{ color: 'var(--green)', fontWeight: 800 }}>$1,000,000 in member profits</span>{' '}
              generated from this card alone. The window to get positioned early is now — not fight week, not when the odds have already moved.
            </p>
            <Countdown className="justify-center mb-8" />
            <div style={{ marginTop: 28 }}>
              <Link href="/pricing" className="btn-primary" style={{ fontSize: '1rem', padding: '0 32px' }}>
                Lock In Before The Odds Move
              </Link>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 14, fontFamily: 'Inter, sans-serif' }}>
              Projected profits based on member position sizing and read confidence. Not a guarantee of returns.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FREE PICK — dynamic from predictions.json
      ═══════════════════════════════════════════ */}
      <section id="free-pick" style={{ padding: '84px 0' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 28px' }}>
            <div className="eyebrow" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="eyebrow-dot" />
              Free Main Event Read
            </div>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95, marginBottom: 10 }}>
              One Honest Read. In Public.
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
              Before you commit to the full board, see how RUBAN frames a fight. Real analysis, in real language.
            </p>
          </div>

          {/* proof grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 18,
            alignItems: 'stretch',
          }} className="proof-grid-responsive">

            {/* Sample read card */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 18,
                color: 'var(--muted)',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                fontFamily: 'Inter, sans-serif',
              }}>
                <span>{freePick.weight_class} · Main Event · {eventName}</span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: 'rgba(251,191,36,0.12)',
                  color: 'var(--gold)',
                  border: '1px solid rgba(251,191,36,0.22)',
                  fontWeight: 700,
                }}>{freePick.tier || 'SELECT READ'}</span>
              </div>

              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', color: 'var(--green)', marginBottom: 6 }}>
                {freePick.winner} Wins
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                {freePick.method} lean · {freePick.fighter1} vs {freePick.fighter2}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
                <div className="conf-bar">
                  <span style={{ width: `${freePick.confidence}%` }} />
                </div>
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '2.5rem',
                  color: 'var(--green)',
                  lineHeight: 1,
                }}>
                  {freePick.confidence}%
                </div>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', marginBottom: 4 }}>The Structural Read</h4>
                  <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>{freePick.analysis}</p>
                </div>
                {freePick.key_factors && freePick.key_factors.slice(0, 2).map((f, i) => (
                  <div key={i}>
                    <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', marginBottom: 4 }}>
                      {i === 0 ? 'Why This Direction' : 'Where The Risk Lives'}
                    </h4>
                    <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full board tease */}
            <div className="card">
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>
                What The Full Board Includes
              </h3>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10, margin: '16px 0 22px', fontFamily: 'Inter, sans-serif' }}>
                {[
                  'Every meaningful fight on the card, not just the main event',
                  'Confidence ratings and volatility flags on each read',
                  'Fight-week notes as the market moves',
                  'Private member delivery — no public forum noise',
                  'Structured format for people who treat this like a business',
                ].map((item, i) => (
                  <li key={i} style={{ color: 'var(--muted)', paddingLeft: 16, position: 'relative', fontSize: '0.95rem' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--green)', fontWeight: 800 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Access The Full Board
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LOCKED BOARD TEASE
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '84px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95, marginBottom: 10 }}>
              Why The White House Card Is Different
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 28, fontFamily: 'Inter, sans-serif' }}>
              This is not a normal fight week. The attention is different. The money is different. The spots, when you find them, are bigger.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }} className="triple-responsive">
            <div className="card">
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>Unusual Attention. Unusual Opportunity.</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>UFC at the White House brings mainstream visibility that normal fight nights don&apos;t. More casual money flowing in means more structural opportunity for disciplined readers.</p>
            </div>
            <div className="card">
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>Deep Card. Multiple Strong Spots.</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>A fourteen-fight card with a historic main event creates room to find clean positions beyond the obvious headline. The whole board is worth mapping, not just the top.</p>
            </div>
            <div className="card">
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>Selectivity, Not Volume.</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>When RUBAN&apos;s confidence on a fight isn&apos;t high enough, members don&apos;t get a forced read. That discipline is the whole model — fewer, stronger positions.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <h3 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: 14,
            }}>
              {predictionsData.predictions.length - 1}+ More Reads
              <span style={{
                background: 'linear-gradient(135deg, var(--purple), var(--magenta))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}> Locked Inside Discord</span>
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: 28, fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
              The free read shows the standard. Members unlock the rest of the board, with every spot framed for conviction and risk.
            </p>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: '1rem', padding: '0 32px' }}>
              Unlock The Full Board
            </Link>
            <p style={{ color: 'var(--muted)', marginTop: 14, fontFamily: 'Inter, sans-serif', fontSize: '0.92rem' }}>
              Join at{' '}
              <Link href="https://discord.gg/yymtuNQwqC" target="_blank" style={{ color: 'var(--purple)', textDecoration: 'underline' }}>
                discord.gg/yymtuNQwqC
              </Link>{' '}
              after purchase.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '84px 0' }}>
        <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 28px' }}>
            <h2 style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)', lineHeight: 0.95, marginBottom: 10 }}>
              Access The White House Board
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
              Two tiers. One system. Built for people who treat the card like a business, not a hobby.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 20 }} className="triple-responsive">
            <div className="card">
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '2.4rem',
                color: 'var(--purple)',
                lineHeight: 1,
                marginBottom: 8,
              }}>1</div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>Choose Your Tier</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>Monthly or annual. Both tiers get the same board, same confidence ratings, same private delivery.</p>
            </div>
            <div className="card">
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '2.4rem',
                color: 'var(--purple)',
                lineHeight: 1,
                marginBottom: 8,
              }}>2</div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>Get Your Member Path</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>Join via Discord. You&apos;ll receive access instructions and the current board link — no waiting, no sales funnel.</p>
            </div>
            <div className="card">
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '2.4rem',
                color: 'var(--purple)',
                lineHeight: 1,
                marginBottom: 8,
              }}>3</div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', marginBottom: 10 }}>Read The Board, Not The Noise</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.65 }}>Full card structure, confidence levels, and volatility flags. Your edge, delivered before fight week gets loud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STICKY BOTTOM CTA
      ═══════════════════════════════════════════ */}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 120,
        background: 'rgba(6,7,11,0.92)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--line)',
      }}>
        <div style={{
          width: 'min(1180px, calc(100% - 32px))',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          padding: '12px 0',
          flexWrap: 'wrap',
        }}>
          <div style={{ color: '#e5e7eb', fontSize: '0.92rem', fontFamily: 'Inter, sans-serif' }}>
            The White House card is live. See the free main event read — or go straight to the full board.
          </div>
          <Link href="/pricing" className="btn-primary" style={{ minHeight: 44, padding: '0 20px', fontSize: '0.86rem' }}>
            Access The Board
          </Link>
        </div>
      </div>
    </>
  );
}
