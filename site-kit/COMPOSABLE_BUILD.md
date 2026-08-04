# Composable Site Kit

## Goal

Promote `branding/site-kit/` from a documentation-only reference layer into a consumable
package, `@sleepy-studio/site-kit`, so any Sleepy Studio subdomain or project composes its
theme, base styles, and shared components from the branding repository instead of copying
sitesite code. When a project asks to be built "in the framework and style of the main
sleepy sitesite", the resolved artifact is this package plus the reference docs.

## Decisions

- **Distribution**: public scoped package on npmjs.com — `@sleepy-studio/site-kit`.
  The `branding` repository is already public, so publishing the kit publicly loses no
  privacy while removing all registry auth for the three Sleepy Studio devs. GitHub
  Packages was considered, but its npm registry requires a PAT on every machine even for
  public packages, which conflicts with the "least friction" goal.
- **Publishing**: GitHub Actions on the `branding` repo publishes on version tags using
  an npm token stored as an organization secret. Devs never publish manually and never
  manage registry tokens.
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

Installing requires no registry configuration for any developer:

```bash
pnpm add @sleepy-studio/site-kit
```

## Milestones

- **M1 — Package skeleton**: `package.json`, `tsconfig`, Vite lib build, empty `src/`
  stubs, publish `v0.1.0` to npmjs.com.
- **M2 — Extract tokens + styles**: copy sitesite `src/styles.css` tokens and shared
  classes verbatim into the package; verify byte-for-byte token parity.
- **M3 — Port shared components**: `Header`, `Card`, `Button`, `Input`, `FloatingMark`
  from sitesite, with Vitest tests and emitted `.d.ts` types.
- **M4 — Migrate sitesite (dogfood)**: sitesite consumes the package; remove vendored
  tokens/shared classes; `pnpm build` + `pnpm test` green; visual parity check.
- **M5 — CI publishing**: GitHub Actions publishes to npmjs.com on `v*` tags using the
  `GITHUB_TOKEN` plus the npm token from an org secret; document versioning.
- **M6 — Lucilab adoption**: when the Lucilab Studio UI starts, compose from the package
  instead of reimplementing.

## Prerequisite (blocked on manual step)

Before M1 can publish, one org-level npm setup is needed — this is a one-time step I
cannot perform without npm credentials:

1. Create the `sleepy-studio` npm organization (or use an existing npm account).
2. Generate an npm **access token** (`automation` type) with publish rights.
3. Store it as an organization secret named `NPM_TOKEN` on GitHub for the
  `Sleepy-Studio` org (used by the M5 workflow).
4. Optionally create the npm org user as a bot account (e.g. `sleepy-studio-bot`) so no
  individual developer's npm login is the publishing identity.

Until then, local publishing (optionally used to kick off M1) can use the same token via
`NODE_AUTH_TOKEN`.

## Verification

- `vite build` and `vite-plugin-dts` output clean ESM + CSS + types.
- `npm publish --dry-run` succeeds before any real publish.
- sitesite `pnpm build` and `pnpm test` pass after M4.
- Rendered look of sitesite is unchanged after migration.
- A fresh clone of any project installs the package with `pnpm add` and no registry
  configuration.

## Known limitations / open items

- **Public visibility**: the package is public on npmjs (the `branding` repo is already
  public, so no additional exposure). Semver protects consumers.
- **One-time npm org setup**: an `NPM_TOKEN` org secret and `sleepy-studio` npm org must
  be created before CI publishing (see Prerequisite). No per-developer auth afterwards.
- **Plain-CSS styling**: components use CSS classes, not Tailwind utility classes; this
  matches sitesite today and keeps the kit framework-light, but utility styling is not
  available on kit components out of the box.
- **No 3D/characters**: per `AGENTS.md`, Three.js, character runtimes, and heavy motion
  are excluded from the kit.
- **Semver coupling**: kit releases should be coordinated with sitesite so consumers pin a
  known-good version.
