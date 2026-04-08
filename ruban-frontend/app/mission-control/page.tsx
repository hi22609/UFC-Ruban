import Link from 'next/link';
import { missionHighlights, missionTasks } from '../data/missionControlData';

const statusStyles = {
  ONLINE: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: 'rgba(16,185,129,0.28)' },
  'IN BUILD': { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: 'rgba(59,130,246,0.28)' },
  MONITORING: { bg: 'rgba(251,191,36,0.12)', color: '#fde68a', border: 'rgba(251,191,36,0.28)' },
  'READY TO SHIP': { bg: 'rgba(139,92,246,0.14)', color: '#c4b5fd', border: 'rgba(139,92,246,0.32)' },
  BLOCKED: { bg: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: 'rgba(239,68,68,0.28)' },
} as const;

const priorityStyles = {
  P1: { bg: 'rgba(239,68,68,0.12)', color: '#fda4af' },
  P2: { bg: 'rgba(251,191,36,0.12)', color: '#fde68a' },
  P3: { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd' },
} as const;

const totalTasks = missionTasks.length;
const liveTasks = missionTasks.filter((task) => task.status === 'ONLINE' || task.status === 'READY TO SHIP').length;
const blockedTasks = missionTasks.filter((task) => task.status === 'BLOCKED').length;
const criticalTasks = missionTasks.filter((task) => task.priority === 'P1').length;

export default function MissionControlPage() {
  return (
    <div className="mission-shell">
      <section className="wrap mission-hero">
        <div className="mission-hero-grid">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              RUBAN Mission Control
            </div>
            <h1 className="mission-title">Operator board for the entire RUBAN machine.</h1>
            <p className="mission-subtitle">
              A premium desktop command surface for tracking task execution, dependencies,
              outputs, and active system posture across frontend, automation, model
              intelligence, and revenue operations.
            </p>

            <div className="mission-hero-actions">
              <a href="#task-board" className="btn-primary">
                Open Task Board
              </a>
              <Link href="/" className="btn-secondary">
                Back to Site
              </Link>
            </div>
          </div>

          <div className="mission-command-card">
            <div className="mission-command-topline">
              <span>Mission Uplink</span>
              <span>Local Operator Surface</span>
            </div>

            <div className="mission-metrics-grid">
              <MetricCard label="Tasks in system" value={String(totalTasks).padStart(2, '0')} note="Current seeded board" />
              <MetricCard label="Live / ready" value={String(liveTasks).padStart(2, '0')} note="Execution-ready lanes" />
              <MetricCard label="Critical lanes" value={String(criticalTasks).padStart(2, '0')} note="P1 operator focus" />
              <MetricCard label="Blocked" value={String(blockedTasks).padStart(2, '0')} note="Needs intervention" />
            </div>

            <div className="mission-signal-band">
              <Signal label="Frontend Surface" value="Stable" color="purple" />
              <Signal label="Automation" value="Tracked" color="blue" />
              <Signal label="Revenue Ops" value="Linked" color="gold" />
              <Signal label="Model Stack" value="Observed" color="green" />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap mission-strip-grid">
        {missionHighlights.map((item) => (
          <div className="mission-strip-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </div>
        ))}
      </section>

      <section className="wrap mission-panel-grid">
        <div className="mission-panel">
          <div className="mission-panel-head">
            <span className="mission-panel-label">Operating Doctrine</span>
            <h2>Single pane of execution truth</h2>
          </div>
          <p>
            Mission Control is structured for desktop review and future agent handoff. Every
            task captures the exact schema requested by leadership so execution state stays
            legible, auditable, and easy to resume.
          </p>
        </div>

        <div className="mission-panel mission-panel-secondary">
          <div className="mission-panel-head">
            <span className="mission-panel-label">Recommended Next Step</span>
            <h2>Wire in live telemetry</h2>
          </div>
          <p>
            The board is seeded from current repo reality. Next iteration should connect service
            health, deployment history, content job runs, and model output freshness.
          </p>
        </div>
      </section>

      <section className="wrap" id="task-board">
        <div className="mission-section-head">
          <div>
            <span className="mission-section-label">Task Board</span>
            <h2>RUBAN execution lattice</h2>
          </div>
          <p>Every card includes the operator schema: inputs, outputs, logs, ownership, and dependencies.</p>
        </div>

        <div className="mission-board">
          {missionTasks.map((task) => {
            const statusStyle = statusStyles[task.status];
            const priorityStyle = priorityStyles[task.priority];

            return (
              <article key={task.id} className="mission-task-card">
                <div className="mission-task-top">
                  <div>
                    <div className="mission-task-meta">
                      <span className="mission-id">{task.id}</span>
                      <span className="mission-type">{task.type}</span>
                    </div>
                    <h3>{task.title}</h3>
                  </div>

                  <div className="mission-chip-stack">
                    <span
                      className="mission-chip"
                      style={{
                        background: priorityStyle.bg,
                        color: priorityStyle.color,
                        borderColor: 'transparent',
                      }}
                    >
                      {task.priority}
                    </span>
                    <span
                      className="mission-chip"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: statusStyle.border,
                      }}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div className="mission-task-grid">
                  <Field label="Assigned Agent" value={task.assignedAgent} />
                  <Field label="Output" value={task.output} long />
                  <ListField label="Inputs" items={task.inputs} />
                  <ListField label="Dependencies" items={task.dependencies.length ? task.dependencies : ['None']} />
                  <ListField label="Logs" items={task.logs} wide />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="wrap mission-runbook">
        <div className="mission-section-head">
          <div>
            <span className="mission-section-label">Local Run</span>
            <h2>Bring Mission Control up locally</h2>
          </div>
        </div>

        <div className="mission-runbook-card">
          <ol>
            <li><code>cd ruban-work\ruban-frontend</code></li>
            <li><code>npm run dev</code></li>
            <li><code>Open http://localhost:3000/mission-control</code></li>
          </ol>
          <p>
            Designed for desktop viewing. Use a full-width monitor for the best operator feel.
          </p>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="mission-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  );
}

function Signal({ label, value, color }: { label: string; value: string; color: 'purple' | 'blue' | 'gold' | 'green' }) {
  return (
    <div className={`mission-signal mission-signal-${color}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Field({ label, value, long = false }: { label: string; value: string; long?: boolean }) {
  return (
    <div className={`mission-field ${long ? 'mission-field-long' : ''}`}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function ListField({ label, items, wide = false }: { label: string; items: string[]; wide?: boolean }) {
  return (
    <div className={`mission-field ${wide ? 'mission-field-wide' : ''}`}>
      <span>{label}</span>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
