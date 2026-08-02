# Sleepy Studio Brand Assets

Single source of truth for all Sleepy Studio logos, characters, and 3D models.

## Quick Start

### Use Assets

```html
<img src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg" />
```

### Get Manifest

```bash
curl https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json
```

## What's Here?

```
logos/svg/           — Vector logos (scalable)
logos/png/           — Raster logo formats
characters/png/      — Mascot assets
3d-models/glb/       — 3D models (GLTF binary)
```

## Use This Repo

- **Fetch assets** instead of copying
- **Reference via CDN** for consistency
- **Integrate easily** — see [INTEGRATION.md](INTEGRATION.md)
- **Request assets** — see [CONTRIBUTING.md](CONTRIBUTING.md)

## Documentation

- [INTEGRATION.md](INTEGRATION.md) — How to use in apps and platforms
- [CONTRIBUTING.md](CONTRIBUTING.md) — Request or suggest assets
- [CHANGELOG.md](CHANGELOG.md) — Asset inventory and dates
- [assets.json](assets.json) — Full asset manifest with URLs

## Deployment

This repo deploys to `branding.sleepystudio.xyz` as the public, CDN-accessible source for all org brand assets. All Sleepy Studio repos and platforms fetch from here instead of storing local copies.
