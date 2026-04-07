# RUBAN Environment Checklist

## Cloudflare
- CLOUDFLARE_API_TOKEN (if automating API-side tasks later)
- domain / zone details

## PostHog
- NEXT_PUBLIC_POSTHOG_KEY or site public key
- POSTHOG_HOST

## Resend
- RESEND_API_KEY
- verified sending domain
- from address

## Framer
- no app env needed unless embedding external services
- decision needed: marketing-only or not used

## General
- keep secrets in service environment, not committed files
- track what is live vs staged
- do not claim integrations are live until verified end-to-end
