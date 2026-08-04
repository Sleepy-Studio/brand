# Reference — Composable Site Kit (decision record + gotchas)

Status: living reference. Last updated: 2026-08-04.

## Purpose

This file records *why* we are building a composable style system for Sleepy Studio web
projects, the process we went through, the decisions we made, and the gotchas we hit so
future work (and future agents) don't re-litigate the same tradeoffs.

## Background

The org runs multiple web surfaces — `sitesite`, `lucilab` (future Studio UI),
SleepyRadio, landing pages, subdomains — and `Sleepy-Studio/branding` is the
organization-wide source of truth for visual assets. We wanted a "composable build" so
these surfaces align fluidly, and we wanted the shorthand "in the framework and style of
the main sleepy sitesite" to resolve to the branding repo rather than per-project copying.

What we did, in order:

1. Codified the phrase resolution in `site-kit/AGENTS.md` ("Main sleepy sitesite style
   resolution"): the phrase resolves to the site-kit docs.
2. Wrote `site-kit/COMPOSABLE_BUILD.md` — the plan for a consumable package,
   `@sleepy-studio/site-kit`.
3. Evaluated distribution options (below) and chose **public npmjs + CI publishing**.
4. Noted the one-time prerequisite (npm org + token) that is blocked on a manual step.

## Distribution decision

Decision: publish `@sleepy-studio/site-kit` to **npmjs.com as a public scoped package**,
published by **GitHub Actions on version tags** using an `NPM_TOKEN` org secret.

| Option | Verdict | Why |
| --- | --- | --- |
| GitHub Packages, private | Rejected | npm registry on GH Packages requires a classic PAT with `read:packages` on **every** machine, even for public packages; add SSO authorization on top. Too much friction for a 3-dev org. |
| GitHub Packages, public | Rejected | Same auth requirement — GH Packages npm registry does not allow anonymous pulls. Public/private changes nothing about friction. |
| **Public npmjs (chosen)** | Chosen | Plain `pnpm add @sleepy-studio/site-kit`. No `.npmrc`, no PATs, works on CI and clean clones. `branding` is already a public repo, so no privacy is lost. |
| Git dependency / vendored | Fallback | Cannot cleanly install a subdirectory of a git repo as a package (npm/pnpm git deps target the repo root). No semver, no lockfile, drifts. |

Dev workflow that results:

- Install: `pnpm add @sleepy-studio/site-kit` — nothing else, for any of the 3 devs
  (`drdogeDOTeth`, `HowieDuhzit`, `sleepysdevin`).
- Publish: tag `v0.2.0` on `branding` → GitHub Actions runs `npm publish`. No manual
  registry work.
- Consume: import tokens/styles/components from the package; keep domain code in the
  project.

## Gotcha 1 — npm scope name: `@sleepy-studio` vs `@sleepy`

**npm scopes are not tied to GitHub org names.** A scope is just the npm account/org that
owns the package. `@sleepy` would work if an npm account/org named `sleepy` exists (or is
created) and the name isn't taken. That said:

- `@sleepy-studio` matches the GitHub org `Sleepy-Studio`, is unambiguous, and maps 1:1 to
  the GitHub Packages fallback if we ever need it (GH Packages scopes under the account
  name).
- The `branding` repo already declares `@sleepy-studio/branding`, so `@sleepy-studio` is
  the established de-facto org scope.

**Guidance: use `@sleepy-studio`. Do not condense to `@sleepy`** unless we want a
deliberately separate public brand identity. Confirm availability when creating the npm
org. (As of this writing `@sleepy-studio/site-kit` and `@sleepy-studio/branding` both
return 404 on npmjs — the scope appears unclaimed.)

## Gotcha 2 — "site-kit" is too narrow *and* too broad

The kit as planned is built on the sitesite stack (React 19, Vite, Tailwind CSS 4,
TanStack). Two problems with that framing:

- **Too narrow**: the React components are useless to non-React projects. A Ruby on Rails
  app, a static HTML site, or a Go/Python backend rendering views still wants the brand
  standards but cannot consume React components.
- **Too broad**: the name "site-kit" implies it is *the* standard for all sites, when it
  only covers this one stack.

**Resolution — split into two layers, mirroring what the org already has:**

- **Layer A — Brand standards (stack-agnostic).** Design tokens (CSS custom properties),
  type/color/spacing scales, and the asset manifest. Consumable by any stack:
  - via the existing Cloudflare Worker CDN `branding.sleepystudio.xyz` or
    `raw.githubusercontent.com/Sleepy-Studio/branding` pinned to a tag;
  - via the existing SDK clients — `branding/` already ships TypeScript, Python, and Go
    clients (`src/branding_client.py`, `src/branding.go`, `@sleepy-studio/branding` SDK
    skeleton with `react`/`vue` subpath exports);
  - for Rails/vanilla: a plain `<link>` or `@import` of a pinned token/stylesheet URL.
- **Layer B — Web component kit (stack-specific).** The React primitives (`Header`,
  `Card`, `Button`, `Input`, `FloatingMark`) built on top of Layer A tokens. This is what
  the `@sleepy-studio/site-kit` npm package actually is.

**Guidance:** keep the canonical token source in the repo (not only inside the npm
package), publish the React kit to npm, and document the stack-agnostic consumption paths
for non-React projects. If a Rails app (or similar) asks for "the sleepy look", the answer
is Layer A via CDN/tag + a small token CSS import — never "add React".

## Gotcha 3 — is an npm package premature? Can we reference the public repo instead?

Both. They serve different layers:

- **For tokens/styles (Layer A), npm is premature.** The `branding` repo is public and
  already the canonical source. Non-JS stacks can `@import` or `<link>` a pinned
  `tokens.css`/`styles.css` from the repo/CDN today, and asset consumers already use
  `assets.json` raw URLs or the Worker. No registry involved.
- **For React components (Layer B), npm is not premature.** Importing TSX components
  directly from a git repo into a Vite app is painful: npm/pnpm git deps install the repo
  root, not a subdirectory; there is no semver, no lockfile pinning, and no clean type
  resolution. A package gives versioning, lockfiles, types, and tree-shaking.

**Guidance: phase it.** Ship Layer A via pinned CDN/tag references immediately (works for
Rails, React, and everything else). Introduce the npm package when the React components
are real and a consumer actually imports them. If we never build React components, skip
the npm package entirely.

## Facts discovered that shape this

- `Sleepy-Studio/branding` is **public**; `Sleepy-Studio/sitesite` is **private** (its
  deployed output is public). Publishing the kit publicly loses no privacy.
- `branding/` already has: `assets.json` (canonical manifest), an unpublished
  `@sleepy-studio/branding` SDK (react/vue subpaths, Python + Go clients), and a Cloudflare
  Worker `branding-api` at `branding.sleepystudio.xyz` (D1 + KV cache + R2 + 6-hour cron).
- Inconsistency worth revisiting (not blocking): `sitesite/src/services/branding.ts`
  hardcodes `raw.githubusercontent.com` URLs rather than using the Worker CDN.
- GitHub Packages npm registry requires a PAT even for public packages — the core reason
  it lost to public npmjs.
- Org members today: `drdogeDOTeth`, `HowieDuhzit`, `sleepysdevin`.

## Open items

1. Create npm org `sleepy-studio` (bot account recommended), generate an `automation`
   token, store as `NPM_TOKEN` org secret. Manual step — blocked without npm credentials.
2. Decide where canonical tokens live: `site-kit/` in the repo vs a dedicated root
   concern; keep it importable outside the npm package either way.
3. Optional cleanup: point `sitesite`'s branding service at the Worker CDN.
4. Revisit this record when the first non-React consumer appears.

## Related

- `site-kit/COMPOSABLE_BUILD.md` — package layout, milestones M1–M6, verification.
- `site-kit/AGENTS.md` — "Main sleepy sitesite style" resolution rules.
- `site-kit/BRANDING_INTEGRATION.md` — asset service layer pattern.
