# Asset Changelog

Track of all assets in the branding repository, including add dates, updates, and versions.

## Current Inventory (v1.0.0)

### Logos

| File | Format | Size | Added | Status | Notes |
|------|--------|------|-------|--------|-------|
| `logos/svg/LogoBlack.svg` | SVG | 10 KB | 2026-08-02 | active | Black variant, web-optimized |
| `logos/svg/LogoBlackRed.svg` | SVG | 10 KB | 2026-08-02 | active | Black with red accent |
| `logos/svg/LogoWhite.svg` | SVG | 10 KB | 2026-08-02 | active | White variant, dark backgrounds |
| `logos/svg/LogoWhiteRed.svg` | SVG | 10 KB | 2026-08-02 | active | White with red accent |

### Identity motion

| File | Format | Added | Status | Notes |
|------|--------|-------|--------|-------|
| `identity/sleepy-wordmark-motion/sleepy-wordmark-animated.svg` | SVG | 2026-08-18 | active | Canonical animated SLEEPY wordmark with staged E flickers and top-mark replacement frames |
| `identity/sleepy-wordmark-motion/sleepy-top-isolated.svg` | SVG | 2026-08-18 | active | Exact isolated top-mark replacement geometry |
| `identity/sleepy-wordmark-motion/sleepy-top-isolated-gold-ring.svg` | SVG | 2026-08-18 | active | Replacement frame with canonical yellow-gold ring |

### Characters

| File | Format | Size | Added | Status | Notes |
|------|--------|------|-------|--------|-------|
| `characters/png/sleepyblack.png` | PNG | 16 KB | 2026-08-02 | active | Mascot character, black |
| `characters/png/sleepyyellow.png` | PNG | 53 KB | 2026-08-02 | active | Mascot character, yellow |

### 3D Models

| File | Format | Size | Added | Status | Notes |
|------|--------|------|-------|--------|-------|
| `3d-models/glb/SleepyLogo3d.glb` | GLB | 820 KB | 2026-08-02 | active | 3D logo, GLTF binary format |

### Favicon

| File | Format | Size | Added | Status | Notes |
|------|--------|------|-------|--------|-------|
| `favicon.ico` | ICO | 4 KB | 2026-08-04 | active | 16/24/32/64px multi-size favicon; canonical tab/browser icon |

## Planned Additions

- [ ] WebP formats (logos, characters) — smaller file size
- [ ] AVIF formats (next-gen compression)
- [ ] USDZ models (iOS AR support)
- [ ] Favicon pack (PNG variants)
- [ ] Social media preview images (OG, Twitter, etc.)

## Version History

### v1.3.0 (2026-08-18)
- Added `SleepyWordmarkMotion` Brand identity renderer
- Added `wordmark` and `frens` variants
- Preserved the Dreamplay-developed E flicker, isolated top-mark replacement, gold-ring frames, zero middle/replacement overlap, and low-frequency frens colon cadence as canonical Brand behavior

### v1.2.0 (2026-08-04)
- Added canonical `favicon.ico` (16/24/32/64px) and `favicon` manifest entry
- Documented icon-only sticky-header pattern in site kit component patterns

### v1.0.0 (2026-08-02)
- Initial asset inventory
- Reorganized by format/type (logos/, characters/, 3d-models/)
- Created asset manifest (assets.json)
- Added CDN URLs for all assets

## How to Request New Assets

See [CONTRIBUTING.md](CONTRIBUTING.md) for the process to request or suggest new assets.

## Updates & Deprecations

When assets are updated or deprecated, this log will note:
- What changed
- Version bump (if applicable)
- Reason for change
- Migration guide (if replacing an asset)

---

**Last Updated**: 2026-08-18  
**Maintained By**: Sleepy Studio Brand Team