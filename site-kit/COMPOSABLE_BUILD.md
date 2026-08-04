# Composable Site Kit

> Reference: the decision record and gotchas behind this plan live in
> `reference/SITE_KIT_REFERENCE.md`.

## Goal

Make Sleepy Studio's web style composable so any project ("in the framework and style of
the main sleepy sitesite") composes theme, base styles, and shared components from the
`branding` repository instead of copying sitesite code. This is approached in phases:
consume **in-house from the public branding repo** today, and move to an npm package only
once the component library is solid and confirmed.

## Phased approach

- **Phase 0 (current) — In-house consumption from the public repo.** `branding` is a
  public repository. Projects reference its files at a **pinned release tag** (e.g.
  `v1.0.0`) via `raw.githubusercontent.com`. No registry, no package, no auth. Works for
  every stack — CSS tokens via `@import`/`<link>`, assets via the manifest, and React
  projects import whatever they need directly.
- **Phase 1+ (future) — npm package `@sleepy-studio/site-kit`.** Only once the shared
  component library is confirmed solid (stable API, tests, visual sign-off) do we publish.
  Distribution is a public scoped package on npmjs, published by GitHub Actions on version
  tags using an `NPM_TOKEN` org secret. npm earns its keep specifically for React
  components: semver, lockfiles, types, tree-shaking. It is *not* required for tokens or
  styles.

## Phase 0 — how projects consume the public repo today

Anchor all branding references to a pinned tag, never `main`:

```ts
const BRANDING_TAG = 'v1.0.0'
const BRANDING_RAW_BASE =
  `https://raw.githubusercontent.com/Sleepy-Studio/branding/${BRANDING_TAG}`
```

Rules:

1. **Never hardcode `main` branch URLs** — they drift on every push to `branding`.
2. **Build asset URLs from the manifest's relative `file` path + the pinned base**, not
   from the absolute `url` field inside `assets.json` (the manifest currently records
   `main`-based URLs).
3. Bump the tag deliberately when consuming new assets or style updates, and coordinate
   with the `branding` repo's release notes.
4. Keep the pinned base in one place per project (a single service module), per the
   `BRANDING_INTEGRATION.md` service-layer pattern.
5. Compose theme + shared styles from the canonical kit CSS, now versioned in this repo:

   ```css
   @import "tailwindcss";
   @import url("https://raw.githubusercontent.com/Sleepy-Studio/branding/v1.1.0/site-kit/src/tokens.css");
   @import url("https://raw.githubusercontent.com/Sleepy-Studio/branding/v1.1.0/site-kit/src/styles.css");
   ```

   `site-kit/src/tokens.css` is the stack-agnostic Layer A source (`:root` vars + Tailwind
   v4 `@theme`); `site-kit/src/styles.css` holds the shared base + component classes
   (cards, buttons, inputs, header, footer).

Example (as implemented in `sitesite/src/services/branding.ts` and
`sitesite/src/services/assets.ts`).

## Future package layout (Phase 1+)

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

Consumption contract once published:

```css
@import "@sleepy-studio/site-kit/styles.css";
```

```tsx
import { Button, Card, Header } from "@sleepy-studio/site-kit";
```

## Phases / milestones

- **Phase 0 — Pinned-tag in-house consumption (done).** Tag `v1.0.0` cut on `branding`;
  `sitesite` pinned to it with tag-base + file-path URL construction.
- **Phase 1 — Package skeleton (gated).** `package.json`, `tsconfig`, Vite lib build,
  empty `src/` stubs; publish `v0.1.0` to npmjs. Gate: component API confirmed solid.
- **Phase 2 — Extract tokens + styles.** Copy sitesite `src/styles.css` tokens and shared
  classes verbatim into the package; verify byte-for-byte token parity.
- **Phase 3 — Port shared components.** `Header`, `Card`, `Button`, `Input`,
  `FloatingMark` from sitesite, with Vitest tests and emitted `.d.ts` types.
- **Phase 4 — Migrate sitesite (dogfood).** sitesite consumes the package; remove vendored
  tokens/shared classes; `pnpm build` green; visual parity check.
- **Phase 5 — CI publishing.** GitHub Actions publishes to npmjs.com on `v*` tags using
  `GITHUB_TOKEN` plus the npm token from an org secret; document versioning.
- **Phase 6 — Lucilab adoption.** When the Lucilab Studio UI starts, compose from the
  package instead of reimplementing.

## Prerequisite for Phase 1 (blocked on manual step)

Before Phase 1 can publish, one org-level npm setup is needed — a one-time step that cannot
be performed without npm credentials:

1. Create the `sleepy-studio` npm organization (or use an existing npm account).
2. Generate an npm **access token** (`automation` type) with publish rights.
3. Store it as an organization secret named `NPM_TOKEN` on GitHub for the `Sleepy-Studio`
   org (used by the Phase 5 workflow).
4. Optionally create the npm org user as a bot account (e.g. `sleepy-studio-bot`) so no
   individual developer's npm login is the publishing identity.

## Verification

- Phase 0: `vite build` green in `sitesite`; every pinned `v1.0.0` asset URL resolves
  (HTTP 200).
- Phase 1+: `vite build` and `vite-plugin-dts` output clean ESM + CSS + types;
  `npm publish --dry-run` succeeds; fresh clones install with `pnpm add` and no registry
  configuration.

## Known limitations / open items

- **Phase 0 ties consumers to `raw.githubusercontent.com`** — fine for a public repo, but
  there is no semver enforcement beyond the pinned tag; asset URLs in `assets.json` still
  point at `main`, so consumers must construct URLs from `file` + base.
- **Worker CDN (`branding.sleepystudio.xyz`) returns 503** — the Cloudflare Worker is not
  actually serving; do not point consumers at it until it is deployed and verified.
- **Plain-CSS styling**: components use CSS classes, not Tailwind utility classes; this
  matches sitesite today and keeps the kit framework-light, but utility styling is not
  available on kit components out of the box.
- **No 3D/characters**: per `AGENTS.md`, Three.js, character runtimes, and heavy motion
  are excluded from the kit.
- **Semver coupling**: package releases should be coordinated with sitesite so consumers
  pin a known-good version.
