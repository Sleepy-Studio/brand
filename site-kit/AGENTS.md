# AGENTS.md — Sleepy Studio Site Kit

## Purpose

Use this directory as the canonical documentation reference when adapting a Sleepy Studio web project to the organization-wide visual system derived from `Sleepy-Studio/sitesite`.

## Rules

1. Preserve project-specific behavior and domain architecture.
2. Reuse tokens and patterns, not unrelated landing-page features.
3. Keep shared organization assets in `Sleepy-Studio/branding`.
4. Never hardcode branding asset URLs inside visual components.
5. Maintain the always-dark baseline unless a project explicitly documents an exception.
6. Prefer 12px control radii and 16px card radii.
7. Keep borders and shadows subtle.
8. Respect reduced-motion preferences.
9. Use semantic HTML and keyboard-operable controls.
10. Do not add Three.js, character runtimes, or heavy animation solely for visual parity.

## SleepyRadio-specific instruction

SleepyRadio should adopt the site tokens, header language, card surfaces, inputs, buttons, and branding service pattern. It should not adopt the landing site's scroll-snapped narrative layout, booking form, project cards, or social CTA choreography.

## Source references

- `Sleepy-Studio/sitesite/README.md`
- `Sleepy-Studio/sitesite/src/styles.css`
- `Sleepy-Studio/sitesite/src/routes/__root.tsx`
- `Sleepy-Studio/sitesite/src/routes/index.tsx`
- `Sleepy-Studio/sitesite/src/components/Header.tsx`
- `Sleepy-Studio/sitesite/BRANDING.md`
