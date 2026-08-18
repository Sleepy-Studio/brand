# Brand integration

Use `Sleepy-Studio/brand` as the canonical source for Sleepy Studio identity, static assets, semantic design tokens, icons, motion, terminal identity, global visual rules, and public destinations.

Brand owns identity and visual meaning. It does not own reusable interface implementation or product composition.

## Package-first consumption

For application and component builds, prefer the package exports so the bundler resolves immutable package assets correctly.

```ts
import logoWhite from '@sleepy-studio/brand/logos/logo-white.svg'
import logoYellow from '@sleepy-studio/brand/logos/logo-yellow.svg'
import favicon from '@sleepy-studio/brand/favicon.ico'
import { brandLogoVariants, brandLogoLabels, brandLogoBackdrops } from '@sleepy-studio/brand/logos'
import { getBrandLink } from '@sleepy-studio/brand/links/runtime'
```

Canonical logo variants are:

- `black`
- `black-red`
- `white`
- `white-red`
- `yellow`

Browser-rendered static assets should be imported through their direct package exports. Do not construct browser `<img>` URLs by resolving relative paths from `assets/runtime`; bundler optimization can relocate modules and invalidate those relative URLs. `assets/runtime` is discovery metadata for non-rendering workflows, not the browser rendering authority.

## Identity renderers

Brand owns logo-specific behavior and presentation:

```ts
import { createLogoMotion } from '@sleepy-studio/brand/identity/logo-motion'
import { createSleepyWordmarkMotion } from '@sleepy-studio/brand/identity/sleepy-wordmark-motion'
import { createLogoAscii } from '@sleepy-studio/brand/identity/logo-ascii'
import { createAudioReactiveLogo } from '@sleepy-studio/brand/identity/audio-reactive-logo'

import '@sleepy-studio/brand/identity/sleepy-wordmark-motion/style.css'
```

`createSleepyWordmarkMotion()` renders the canonical animated SLEEPY wordmark. The exact homepage-style ecosystem lockup is available through the Brand-owned identity variant:

```ts
const wordmark = createSleepyWordmarkMotion()
const frens = createSleepyWordmarkMotion({ variant: 'frens' })

mount.append(wordmark.element)
otherMount.append(frens.element)
```

The `frens` variant keeps the same SLEEPY animation and adds the canonical yellow `frens` label plus the widely spaced, low-frequency blinking colon. Consumers must not recreate the E timing, top-mark replacement, gold-ring frames, or colon cadence downstream.

Use generic `Spinner` and `Progress` from `@sleepy-studio/components` for interface loading state. Use Brand identity renderers only when the Sleepy Studio mark itself is the visual state.

## Semantic tokens and global visual rules

Import Brand tokens before reusable component or application styles. Import the Brand scrollbar policy globally for browser surfaces.

```css
@import '@sleepy-studio/brand/tokens.css';
@import '@sleepy-studio/brand/scrollbars.css';
```

Components may consume Brand semantic tokens as implementation defaults, but Components must not re-export Brand tokens, scrollbars, icons, links, logos, or identity renderers as convenience aliases.

Applications may compose Components and override component-local variables where supported without redefining canonical Brand values.

## Icons and action semantics

Use approved Brand icon IDs and runtime helpers rather than creating product-local equivalents for shared meanings. Canonical Button action semantics such as `view`, `open`, and `open-new-tab` are implemented by Components and resolve their shared visual meaning through Brand.

## Public destinations

Use the Brand runtime instead of duplicating organization URLs in products:

```ts
import { getBrandLink } from '@sleepy-studio/brand/links/runtime'

const github = getBrandLink('github')
const x = getBrandLink('x')
const website = getBrandLink('website')
const email = getBrandLink('email')
```

## Machine-readable assets and tokens

For discovery, documentation generation, validation, or non-rendering tooling:

```ts
import manifest from '@sleepy-studio/brand/assets' with { type: 'json' }
import tokens from '@sleepy-studio/brand/tokens' with { type: 'json' }
```

The asset manifest validates against the shared asset-manifest contract. The token document validates against the shared design-token contract in `Sleepy-Studio/contracts`.

## Foundation compatibility

Brand pins the same immutable Contracts compatibility checkpoint used by Components during coordinated foundation work. pnpm install-time approval for the git-hosted Contracts package must be durable at the repository URL level in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  '@sleepy-studio/contracts@git+https://github.com/Sleepy-Studio/contracts.git': true
```

Do not use commit-specific `allowBuilds` entries or `dangerouslyAllowAllBuilds`.

## Validation

```bash
cd ~/Sleepy-Studio/brand

rm -rf node_modules
pnpm install
pnpm validate
```

Validation checks canonical Brand documents against their shared Contracts schemas and verifies generated/declared Brand assets according to repository rules.

Do not publish or tag a Brand revision until validation succeeds locally.

## Releases

Production consumers should use immutable compatible releases or tags. Branch pins are acceptable during coordinated foundation refactors and deliberate preview work only.

Before creating a Brand release tag:

1. Set release-bound manifest references to the immutable release tag where required.
2. Rewrite release-bound asset URLs to that tag where required.
3. Run validation.
4. Confirm referenced files exist at the release commit.
5. Tag only the validated commit.

A manifest whose `ref` is `main` is a development manifest and must not be treated as immutable.

## Repository ownership

- Brand: identity, canonical assets, semantic tokens, icons, motion, sound, voice, copy/naming guidance, global visual rules, favicon/app marks, and public destinations.
- Contracts: implementation-neutral schemas, types, validators, fixtures, and compatibility rules.
- Components: reusable interface vocabulary and interaction; DOM is the baseline renderer and React is an optional adapter.
- Sleepy: ecosystem/runtime architecture, capability routing, cross-surface coordination, and Sleepy-specific runtime-domain definitions.
- Applications: product composition, data fetching, routing, state, and orchestration.
