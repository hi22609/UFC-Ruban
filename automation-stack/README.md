# RUBAN Automation Stack

This folder is the clean operations layer for RUBAN.

## Goal
Build a low-cost, high-control workflow stack around:
- Ollama (local models)
- n8n (workflow automation)
- Discord delivery
- website update pipelines
- chart/tracking generation
- background job runbooks

## Planned Components
- `n8n/` → workflow exports, credentials checklist, runbooks
- `prompts/` → reusable prompt templates
- `scripts/` → local automation helpers
- `data/` → lightweight tracked inputs/outputs
- `docs/` → operating procedures

## Principles
- Local-first where possible
- No fake metrics
- One canonical source of truth per workflow
- Separate public site, premium delivery, and payment/onboarding logic
- Prefer safe automation over brittle hype
