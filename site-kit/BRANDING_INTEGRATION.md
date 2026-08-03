# Branding Integration

## Source of truth

The `Sleepy-Studio/branding` repository is the organization-wide source of truth for visual assets.

Projects should not duplicate shared organization assets in their own repositories.

## Service layer

Each frontend should expose asset references through a service module:

```ts
export const ASSET_URLS = {
  sleepyYellow: '...',
  sleepyBlack: '...',
  logo3d: '...',
  logoBlackSvg: '...',
  favicon: '...',
} as const
```

Components import from this service rather than embedding raw URLs.

## Asset categories

Recommended repository organization:

```text
branding/
├── characters/
├── logos/
├── 3d-models/
├── projects/
│   └── <project-name>/
├── site-kit/
└── assets.json
```

## Manifest

The asset manifest should include:

- stable asset ID
- name
- description
- format variants
- canonical raw URL
- MIME type
- file size
- optional dimensions
- optional project ownership

## Project assets

SleepyRadio-specific assets should live under:

```text
projects/radio/
```

The radio repository should only reference those assets through its branding service.

## Documentation placement

This site kit belongs in the branding repository because visual consistency, design tokens, and asset use are organization-wide branding concerns.
