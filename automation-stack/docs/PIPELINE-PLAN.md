# RUBAN Pipeline Plan

## 1. Content Pipeline
Trigger: schedule / fight-week updates
- Generate draft with local model
- Human/agent review
- Push to site or Discord delivery layer

## 2. Fight Board Pipeline
Trigger: event update / manual refresh
- ingest fight card data
- normalize names / bouts
- store to JSON/SQLite
- expose teaser + member-facing board

## 3. Visual Pipeline
Trigger: promo need / event refresh
- fighter asset prep
- composite generation
- mobile-safe variants
- site hero updates

## 4. Member Delivery Pipeline
Trigger: onboarding / event drop
- deliver instructions
- update member status
- prepare private content routing

## 5. Tracking / Chart Pipeline
Trigger: result updates
- append tracked outcomes
- compute records
- render charts only from real records
- optional Discord summary post

## 6. Reliability Pipeline
Trigger: deploy / heartbeat / check
- verify health endpoint
- verify page freshness
- verify workflow availability
- verify delivery dependencies
