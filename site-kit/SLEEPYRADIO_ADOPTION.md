# SleepyRadio Adoption

## Objective

SleepyRadio should visibly belong to the Sleepy Studio ecosystem while remaining an efficient radio application rather than imitating the landing page section-for-section.

## Adopt directly

- React, Vite, TypeScript, TanStack Router, Tailwind 4
- dark token set
- Inter typography
- 12px controls and 16px cards
- sticky glass header
- branding service pattern
- subtle borders and shadows
- compact motion rules
- reduced-motion handling
- 1100px content maximum

## Adapt for radio

### Header

Use:

- Sleepy Studio or SleepyRadio mark on the left
- search entry point
- favorites entry point
- compact external organization link

Do not center social buttons as the primary navigation.

### Main content

Use a dense application layout:

```text
Header
Search and filters
Featured or recent stations
Station results
Persistent player
```

### Player

The persistent player should use the same glass surface language but stay fixed at the bottom. Reserve enough page padding so results are never hidden beneath it.

### Station cards

Use card tokens, but reduce vertical padding. Each card should expose:

- station name
- country or language
- tags
- codec and bitrate where useful
- play control
- favorite control
- clear failure or unsupported status

### Motion

Remove landing-page scroll snapping. Keep only subtle entry and state transitions.

### Branding asset path

SleepyRadio-specific marks and imagery should be added to `Sleepy-Studio/branding/projects/radio/` and referenced from a local `src/services/branding.ts` adapter.

## Do not inherit

- booking form
- project showcase data
- landing-specific full-screen story sequence
- social CTA pulse animations
- Luci behavior unless intentionally scoped as a lightweight cameo
- Three.js dependencies unless a concrete radio feature requires them
