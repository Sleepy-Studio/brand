# Composable Site Kit

## Goal

Promote `branding/site-kit/` from a documentation-only reference layer into a consumable
package, `@sleepy-studio/site-kit`, so any Sleepy Studio subdomain or project composes its
theme, base styles, and shared components from the branding repository instead of copying
sitesite code. When a project asks to be built "in the framework and style of the main
sleepy sitesite", the resolved artifact is this package plus the reference docs.

## Decisions

- **Distribution**: private GitHub Packages registry (`https://npm.pkg.github.com`),
  scoped `@sleepy-studio/site-kit`. Keeps the org style system private, consistent with
  private repositories like `lucilab`.
- **Scope**: design tokens (Tailwind v4 `@theme` + `:root` vars), base styles, and the
  shared React primitives from `COMPONENT_PATTERNS.md`.
- **Style implementation**: components are styled with plain CSS classes from
  `styles.css` (matching how sitesite implements them today). Tailwind utilities stay
  available through the token `@theme` block for projects that use them.

## Package layout

```text
site-kit/
├── package.json            # @sleepy-studio/site-kit, exports map
├── tsconfig.json
├── vite.config.ts          # lib build (ESM) + dts via vite-plugin-dts
├── README.md               # existing site-kit README doubles as package README
├── AGENTS.md               # existing rules
├── COMPOSABLE_BUILD.md     # this document
├── src/
│   ├── index.ts            # public exports
│   ├── tokens.css          # :root variables + Tailwind v4 @theme (source of truth)
│   ├── styles.css          # base + component classes (glass, cards, buttons, inputs)
│   ├── assets.ts           # ASSET_URLS service pattern + types
│   └── components/
│       ├── index.ts
│       ├── Header.tsx
│       ├── Card.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── FloatingMark.tsx
```

## Consumption contract

Tailwind projects import tokens then styles in their own entry CSS:

```css
@import "@sleepy-studio/site-kit/styles.css";
```

Components are imported as ESM from the package and keep domain logic in the consumer:

```tsx
import { Button, Card, Header } from "@sleepy-studio/site-kit";
```

Auth for private installs (project `.npmrc`):

```ini
@sleepy-studio:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Milestones

- **M1 — Package skeleton**: `package.json`, `tsconfig`, Vite lib build, empty `src/`
  stubs, publish `v0.1.0` to GitHub Packages.
- **M2 — Extract tokens + styles**: copy sitesite `src/styles.css` tokens and shared
  classes verbatim into the package; verify byte-for-byte token parity.
- **M3 — Port shared components**: `Header`, `Card`, `Button`, `Input`, `FloatingMark`
  from sitesite, with Vitest tests and emitted `.d.ts` types.
- **M4 — Migrate sitesite (dogfood)**: sitesite consumes the package; remove vendored
  tokens/shared classes; `pnpm build` + `pnpm test` green; visual parity check.
- **M5 — CI publishing**: GitHub Actions publishes on version tags; document install +
  auth in README.
- **M6 — Lucilab adoption**: when the Lucilab Studio UI starts, compose from the package
  instead of reimplementing.

## Verification

- `vite build` and `vite-plugin-dts` output clean ESM + CSS + types.
- `npm publish --dry-run` against GitHub Packages succeeds before any real publish.
- sitesite `pnpm build` and `pnpm test` pass after M4.
- Rendered look of sitesite is unchanged after migration.

## Known limitations / open items

- **Auth friction**: every consumer machine needs a token with `read:packages`; the
  `sleepysdevin` token needs `write:packages` to publish (scope must be granted before M1).
- **Plain-CSS styling**: components use CSS classes, not Tailwind utility classes; this
  matches sitesite today and keeps the kit framework-light, but utility styling is not
  available on kit components out of the box.
- **No 3D/characters**: per `AGENTS.md`, Three.js, character runtimes, and heavy motion
  are excluded from the kit.
- **Semver coupling**: kit releases should be coordinated with sitesite so consumers pin a
  known-good version.
