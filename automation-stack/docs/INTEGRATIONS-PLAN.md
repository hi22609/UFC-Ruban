# RUBAN Integrations Plan

## 1. Cloudflare
Role:
- domain DNS
- SSL
- caching
- WAF / protection
- redirects

Recommended use:
- put public site behind Cloudflare
- point primary domain/subdomain to Railway deploy target
- use Cloudflare as traffic/security layer, not as app logic layer

## 2. PostHog
Role:
- analytics
- funnel tracking
- CTA tracking
- page performance / product insight

Recommended tracked events:
- homepage_view
- free_read_view
- pricing_view
- click_get_access
- click_request_syndicate
- click_open_board
- telegram_click

## 3. Resend
Role:
- onboarding emails
- purchase instructions
- access delivery
- launch / update emails

Recommended first email flows:
- access details requested
- premium onboarding instructions
- manual follow-up / waitlist style update

## 4. Framer
Role:
- optional premium marketing site front-end

Rule:
- only use Framer as the showroom if chosen explicitly
- do not let Framer become another competing app root without clear ownership

## Recommendation Order
1. Cloudflare
2. PostHog
3. Resend
4. Framer (only if public marketing layer is moving there)

## Operational Rule
One public site target at a time.
No split-brain stack.
