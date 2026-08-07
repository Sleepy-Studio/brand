# Sleepy Studio Brand

Canonical source of truth for Sleepy Studio identity, assets, palette, semantic visual language, icons, motion, sound, voice, naming, and application identity.

## Ownership model

Brand answers: **what makes something Sleepy Studio?**

Brand owns:

- the canonical raw palette and semantic theme values;
- shape and visual constraints such as control and surface radii;
- approved icons and their canonical Sleepy IDs;
- logos, marks, characters, illustration, 3D assets, motion, sound, voice, and copy identity;
- generated platform compatibility assets such as PWA PNGs, ICO, and ICNS files.

Components consumes Brand. Components must not maintain an independent icon set, palette, radius system, or alternate visual language.

## Palette and semantic theme

`tokens/tokens.json` separates the small canonical palette from semantic usage. The core palette is black, white, yellow, and red. Semantic tokens determine how those values and supporting state colors are used by interfaces.

Rectangular controls and surfaces are rounded by Brand policy. `radius.control` is the canonical rectangular-control radius and `radius.surface` is the canonical reusable-surface radius. Components consume those semantics rather than inventing local shape rules.

JSON tokens are published through `@sleepy-studio/brand/tokens`; CSS variables are published through `@sleepy-studio/brand/tokens.css`.

## Icons

`icons/icons.json` is the canonical approved Sleepy interface-icon vocabulary. Sleepy IDs are stable semantic names such as `profile`, `search`, `save`, and `delete`.

Lucide is the upstream glyph source because it provides a compact, consistent, framework-neutral SVG library under the ISC license. Brand selects a deliberately small subset and generates individual SVG files; downstream repositories do not select arbitrary Lucide glyphs or depend on Lucide naming.

```bash
pnpm install
pnpm icons:generate
```

Generated icons live under `icons/svg/` and are exported as `@sleepy-studio/brand/icons/<id>.svg`. Add a new icon by adding one approved Sleepy ID to `icons/icons.json`, then regenerate. Do not add a second component merely to obtain a new icon.

## Asset naming and formats

Canonical identity assets use one consistent noun. The Sleepy Studio mark is `logo-*`; `sleepy-*` is reserved for a genuinely distinct character or entity and is not an alias for the same logo.

Canonical source artwork uses SVG for vector artwork and WebP for raster artwork. PNG is not canonical source artwork. PNG remains permitted only as a generated compatibility artifact when a target platform requires it, including PWA, Apple-touch, and Linux application icon outputs.

The legacy `sleepyblack.png` and `sleepyyellow.png` logo aliases are removed from the canonical asset set.

## Canonical app icons

All browser, PWA, Windows, macOS, Linux, taskbar, launcher, installer, and shortcut icons come from `app-icons/` and are generated compatibility outputs.

The canonical treatment is the yellow Sleepy Studio logo on a dark rounded tile. Framework defaults such as React, Vite, Tauri, and Electron icons are not permitted in ecosystem applications.

```bash
pnpm app-icons:generate
pnpm validate
```

## Contracts and validation

`assets.json` and `tokens/tokens.json` conform to schemas owned by `Sleepy-Studio/contracts`. Brand validation also checks required platform outputs and the approved icon vocabulary.

Production applications should pin immutable Brand releases. `main` remains the development channel.

## Repository scope

```text
logos/
characters/
3d-models/
app-icons/
tokens/
icons/
illustration/
motion/
sound/
voice/
copy/
assets.json
```

## Ownership rules

- Consume Brand assets and semantic values rather than redrawing or redefining them.
- Generated mirrors must identify their source and remain reproducible.
- Reusable component behavior belongs to `Sleepy-Studio/components`.
- Implementation-neutral schemas and shared data contracts belong to `Sleepy-Studio/contracts`.
- Luci-specific creative assets belong to `Sleepy-Studio/lucilab`.
- Product repositories own product composition, not shared visual vocabulary.
