# First RUBAN Workflows

## Workflow 1 — Site Health + Freshness Check
Trigger: manual / schedule
- GET public homepage
- GET /api/health
- verify expected title/content markers
- alert if stale or broken

## Workflow 2 — Fight Week Content Draft
Trigger: manual / fight-week schedule
- pull current event metadata
- draft concise promo copy with local model
- save draft for review

## Workflow 3 — Board Teaser Update
Trigger: manual / event update
- write/update teaser JSON
- reflect main event read and event metadata
- keep public site honest and current

## Workflow 4 — Premium Delivery Prep
Trigger: manual / post-payment ready state later
- generate member instruction text
- stage premium drop notes
- prepare Discord/member room payloads

## Workflow 5 — Result Tracking Skeleton
Trigger: after event results available
- append outcomes
- compute tracked stats from real records only
- prepare on-site chart inputs

## Rules
- No fake metrics
- No public posting without real data
- Keep public site and private delivery logically separate
- Human review on money- or trust-sensitive outputs
