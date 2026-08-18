# Sleepy Studio Brand

`@sleepy-studio/brand` is the canonical source of truth for Sleepy Studio identity, assets, palette, semantic visual language, icons, motion, sound, voice, naming, public destinations, and application identity.

Brand answers: **what makes something Sleepy Studio?**

## Foundation ownership

- **Contracts** owns implementation-neutral schemas, validators, manifests, shared meaning, semantic flows, and compatibility rules.
- **Brand** owns canonical identity, assets, semantic design tokens, approved icons, motion, sound, voice, naming, public destinations, and global visual policy.
- **Components** consumes Brand and Contracts to provide the canonical reusable interface vocabulary.
- **Sleepy** owns ecosystem/runtime architecture, capability routing, and cross-surface coordination.
- **Products** compose the foundations and own product-specific state, routing, data, sessions, and orchestration.

Components and products must consume Brand rather than maintaining parallel icon sets, palettes, radii, logos, global styles, or alternate visual language.

## Palette and semantic theme

`tokens/tokens.json` separates the small canonical palette from semantic usage. The core palette is black, white, yellow, and red. Semantic tokens determine how those values and supporting state colors are used by interfaces.

Rectangular controls and reusable surfaces are rounded by Brand policy. `radius.control` is the canonical rectangular-control radius and `radius.surface` is the canonical reusable-surface radius. Components consume those semantics rather than inventing local shape rules.

Machine-readable tokens are exported through `@sleepy-studio/brand/tokens`; CSS variables are exported through `@sleepy-studio/brand/tokens.css`.

Global scrollbar treatment is exported through `@sleepy-studio/brand/scrollbars.css`. Generic gray browser/page/component scrollbar styling should not be introduced downstream as an alternate visual policy.

## Icons

`icons/icons.json` is the canonical approved Sleepy interface-icon vocabulary. Sleepy IDs are stable semantic names such as `profile`, `search`, `save`, `view`, `open-new-tab`, and `delete`.

Lucide is the upstream glyph source for approved interface glyphs. Brand selects a deliberately small subset and generates individual canonical SVG files. Downstream repositories do not select arbitrary Lucide glyphs or depend on Lucide naming.

Non-Lucide marks such as GitHub and X remain checked-in static Brand SVGs and use the same canonical Sleepy icon-ID surface.

```bash
pnpm install
pnpm icons:generate
```

Generated and retained canonical icons live under `icons/svg/` and are exported as `@sleepy-studio/brand/icons/<id>.svg`.

Add an interface icon by defining one approved Sleepy ID in `icons/icons.json`, then regenerate when the source is Lucide-derived. Do not create a second component merely to obtain a new icon.

## Logos and identity renderers

Canonical logo variants are exported from `@sleepy-studio/brand/logos` and through direct package SVG exports. Browser consumers should import package assets directly rather than reconstructing relative runtime URLs.

Brand also owns identity-specific renderers:

- LogoMotion
- SleepyWordmarkMotion
- LogoAscii
- AudioReactiveLogo

`SleepyWordmarkMotion` is the canonical animated SLEEPY wordmark identity. Its `wordmark` variant renders the animated mark alone. Its `frens` variant composes the same animation with the canonical yellow `frens` label and the spaced, low-frequency blinking colon.

```ts
import { createSleepyWordmarkMotion } from '@sleepy-studio/brand/identity/sleepy-wordmark-motion'
import '@sleepy-studio/brand/identity/sleepy-wordmark-motion/style.css'

const wordmark = createSleepyWordmarkMotion()
const frens = createSleepyWordmarkMotion({ variant: 'frens' })
```

These are identity behavior, not generic Components loading primitives. Components owns generic Spinner and Progress instead.

Logo SVGs used as package assets must be self-contained. Do not rely on nested relative SVG/image references that can break when bundled or embedded.

## Asset naming and formats

Canonical identity assets use one consistent noun. The Sleepy Studio mark is `logo-*`; `sleepy-*` is reserved for a genuinely distinct character or entity and is not an alias for the same logo.

Canonical source artwork uses SVG for vector artwork and WebP for raster artwork. PNG is not canonical source artwork. PNG remains permitted only as a generated compatibility artifact when a target platform requires it, including PWA, Apple-touch, and Linux application icon outputs.

## Canonical app icons

All browser, PWA, Windows, macOS, Linux, taskbar, launcher, installer, and shortcut icons come from `app-icons/` and are generated compatibility outputs.

Framework defaults such as React, Vite, Tauri, and Electron icons are not permitted in ecosystem applications.

```bash
pnpm app-icons:generate
pnpm validate
```

## Public destinations

Canonical organization destinations belong in Brand and should be consumed from Brand rather than repeated as product-local constants. This includes the Sleepy Studio website, GitHub organization/sponsors, X account, and contact destination.

## Contracts and validation

`assets.json` and `tokens/tokens.json` conform to schemas owned by `Sleepy-Studio/contracts`. Brand validation also checks canonical palette/radius requirements, approved icon definitions and SVGs, source-art rules, and required generated platform outputs.

```bash
cd ~/Sleepy-Studio/brand
pnpm install
pnpm validate
```

During coordinated foundation work, Brand and Components must validate against the same immutable Contracts compatibility checkpoint. Production consumers should use immutable compatible releases or tags rather than moving foundation branches.

## Repository scope

```text
logos/
characters/
3d-models/
app-icons/
tokens/
icons/
identity/
styles/
links/
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
- Runtime/ecosystem architecture belongs to `Sleepy-Studio/sleepy`.
- Luci-specific creative assets belong to `Sleepy-Studio/lucilab`.
- Product repositories own product composition, not shared visual vocabulary.
