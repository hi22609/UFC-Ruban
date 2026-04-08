export type MissionStatus =
  | 'ONLINE'
  | 'IN BUILD'
  | 'MONITORING'
  | 'READY TO SHIP'
  | 'BLOCKED';

export type MissionTask = {
  id: string;
  title: string;
  type: 'Frontend' | 'Backend' | 'Automation' | 'Growth' | 'Data' | 'Ops';
  priority: 'P1' | 'P2' | 'P3';
  assignedAgent: string;
  status: MissionStatus;
  inputs: string[];
  output: string;
  logs: string[];
  dependencies: string[];
};

export const missionTasks: MissionTask[] = [
  {
    id: 'MC-001',
    title: 'Mission Control Operator Board',
    type: 'Frontend',
    priority: 'P1',
    assignedAgent: 'Mission Control Builder',
    status: 'IN BUILD',
    inputs: [
      'ruban-frontend app shell',
      'Current RUBAN visual language',
      'Operator schema from CEO request',
    ],
    output:
      'Desktop-grade Mission Control dashboard with operator metrics, board, and seeded task intelligence.',
    logs: [
      'Selected ruban-frontend as host surface to avoid fragmenting the product.',
      'Building a dedicated /mission-control route with premium operator styling.',
      'Seeding board with live repo initiatives and handoff-ready metadata.',
    ],
    dependencies: [],
  },
  {
    id: 'MC-002',
    title: 'Premium marketing site deployment lane',
    type: 'Frontend',
    priority: 'P1',
    assignedAgent: 'Frontend Systems',
    status: 'MONITORING',
    inputs: [
      'ruban-frontend/app/page.tsx',
      'pricing, methodology, track-record pages',
      'Railway deployment config',
    ],
    output:
      'High-conviction premium web surface for RUBAN members and prospects.',
    logs: [
      'Primary acquisition surface exists in Next.js app.',
      'Mission Control now tracks UI readiness and links execution back to growth.',
      'Continue monitoring launch polish and information architecture.',
    ],
    dependencies: ['MC-001'],
  },
  {
    id: 'MC-003',
    title: 'Discord operations and content automation',
    type: 'Automation',
    priority: 'P1',
    assignedAgent: 'Discord Ops Agent',
    status: 'READY TO SHIP',
    inputs: [
      'ruban-server/discord-bot.js',
      'discord-chart-poster.js',
      'workflows/daily-content.js',
    ],
    output:
      'Operational Discord layer for member delivery, chart posting, and recurring fight content.',
    logs: [
      'Bot and posting scripts are present in ruban-server.',
      'Daily content workflow already defined.',
      'Needs operator oversight for cadence, messaging, and reliability once scaled.',
    ],
    dependencies: [],
  },
  {
    id: 'MC-004',
    title: 'Prediction engine and model benchmarking lane',
    type: 'Data',
    priority: 'P1',
    assignedAgent: 'Fight Intelligence Agent',
    status: 'MONITORING',
    inputs: [
      'ufc-ruban/engine/model-manager.js',
      'benchmark-models.js',
      'python/model/predict.py',
    ],
    output:
      'Structured model pipeline for generating and validating fight intelligence.',
    logs: [
      'Engine, model manager, and benchmarking scripts are already in repo.',
      'Python prediction path indicates hybrid JS/Python system design.',
      'Mission Control should remain the single pane of glass for model confidence ops.',
    ],
    dependencies: [],
  },
  {
    id: 'MC-005',
    title: 'Payments and member access sync',
    type: 'Backend',
    priority: 'P2',
    assignedAgent: 'Revenue Systems',
    status: 'READY TO SHIP',
    inputs: [
      'stripe-webhook.js',
      'ruban-server/payment-to-discord.js',
      'ufc-ruban/server/stripe.js',
    ],
    output:
      'Payment events mapped into access control and community onboarding.',
    logs: [
      'Stripe and Discord linkage already exists in multiple project surfaces.',
      'System should be unified and monitored for post-payment access assurance.',
      'Future Mission Control iteration can ingest payment event telemetry.',
    ],
    dependencies: ['MC-003'],
  },
  {
    id: 'MC-006',
    title: 'Content archive and historical credibility layer',
    type: 'Growth',
    priority: 'P2',
    assignedAgent: 'Brand Intelligence',
    status: 'ONLINE',
    inputs: [
      'track-record page',
      'history dashboard assets',
      'predictions.json datasets',
    ],
    output:
      'Public proof layer reinforcing brand trust and data-backed positioning.',
    logs: [
      'Historical and dashboard assets are already published in site folders.',
      'Trust surface exists; operator view now maps it as an active asset.',
      'Opportunity: expose more evidence streams over time.',
    ],
    dependencies: ['MC-004'],
  },
  {
    id: 'MC-007',
    title: 'Automation stack hardening',
    type: 'Ops',
    priority: 'P2',
    assignedAgent: 'Ops Control',
    status: 'BLOCKED',
    inputs: [
      'automation-stack folder',
      'deployment playbooks',
      'cross-service runbooks',
    ],
    output:
      'Unified automation and deployment visibility across all RUBAN services.',
    logs: [
      'Automation surface exists but is not yet represented in the frontend operator layer.',
      'Needs explicit runbooks and integrated telemetry to leave blocked state.',
      'Recommend next iteration: connect real service health + recent deploy history.',
    ],
    dependencies: ['MC-001', 'MC-003', 'MC-005'],
  },
];

export const missionHighlights = [
  {
    label: 'Operator Surface',
    value: 'Desktop view',
    note: 'Built for local review, execution visibility, and future agent reference.',
  },
  {
    label: 'Board Schema',
    value: '9 fields',
    note: 'Task ID, Title, Type, Priority, Inputs, Assigned Agent, Status, Output, Logs, Dependencies.',
  },
  {
    label: 'System Posture',
    value: 'Operator-grade',
    note: 'Designed as premium Mission Control rather than a generic kanban.',
  },
];
