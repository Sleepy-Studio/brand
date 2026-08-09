# Repository instructions

Sleepy Studio Brand is the canonical source for organization-wide identity, assets, semantic design tokens, approved icons, motion, sound, voice, naming, public destinations, application identity, and global visual language.

## Foundation ownership

- Contracts owns implementation-neutral schemas, validators, manifests, shared meaning, semantic flows, and compatibility rules.
- Brand owns canonical identity and visual semantics.
- Components consumes Brand + Contracts to provide reusable interface implementation.
- Sleepy owns ecosystem/runtime architecture, capability routing, and cross-surface coordination.
- Products own product composition, state, routing, data, sessions, and orchestration.

Do not create alternate Brand ownership paths in downstream repositories.

## Change requirements

Every Brand change must keep source assets, manifests, token exports, package exports, documentation, and validation aligned.

1. Do not redraw, rename, recolor, relocate, or reinterpret canonical assets in downstream repositories.
2. Record canonical assets in `assets.json` with stable identifiers and correct paths.
3. Keep `tokens/tokens.json` and `tokens/tokens.css` semantically equivalent.
4. Validate manifests and token documents against `@sleepy-studio/contracts`.
5. Treat moving branches as development channels. Production consumers must use immutable compatible releases or tags.
6. Before a release, replace mutable manifest refs and asset URLs with the release tag where applicable.
7. Pin the Contracts validation dependency to a verified immutable revision during coordinated foundation work.
8. Approve trusted git dependencies by repository-level URL in the root `pnpm-workspace.yaml`; never use commit-specific approval entries.
9. Update README and integration guidance when public asset paths, exports, tokens, icon semantics, or release procedures change.
10. Brand and Components must use the same Contracts compatibility checkpoint during coordinated foundation verification.

## Icons

`icons/icons.json` owns the approved Sleepy icon vocabulary.

- Lucide-derived interface icons declare `source: "lucide"` and a glyph, then generate a canonical SVG under `icons/svg/`.
- Checked-in non-Lucide marks declare `source: "static"` and a file.
- Consumers use canonical Sleepy icon IDs; they do not select arbitrary upstream glyph names.
- Components must not maintain a second icon table or re-export Brand icons as Components-owned assets.

## Assets and identity

- Canonical logo assets use `logo-*` naming.
- Vector source artwork is SVG; raster source artwork is WebP.
- PNG is allowed only for generated compatibility output where required by target platforms.
- Package-consumed SVGs must be self-contained; do not rely on nested relative image references.
- Browser consumers should import direct package assets instead of constructing relative URLs through asset runtime helpers.
- LogoMotion, LogoAscii, and AudioReactiveLogo are Brand identity renderers. Generic Spinner and Progress belong to Components.

## Visual policy

Brand owns reusable visual constraints including semantic colors, radii, touch/control sizing, motion, and global scrollbar treatment. Components consumes these semantics rather than inventing local equivalents.

Do not introduce generic gray scrollbar styling or independent component palettes/radius systems downstream.

## pnpm build approvals

Follow the organization standard in [`Sleepy-Studio/.github/docs/pnpm-build-approvals.md`](https://github.com/Sleepy-Studio/.github/blob/main/docs/pnpm-build-approvals.md).

Git-hosted Sleepy Studio packages that require install-time scripts must be approved by repository URL in the root `pnpm-workspace.yaml`. Do not use `dangerouslyAllowAllBuilds`, and do not require users to repeat manual approval workarounds after dependency revisions change.

## Repository boundaries

Brand owns canonical identity and semantic visual defaults. Components owns reusable rendering and interaction. Contracts owns shared schemas and validators. Sleepy owns runtime/ecosystem architecture. Applications own product composition. Luci-specific creative assets belong in `Sleepy-Studio/lucilab`.

## Verification

```bash
cd ~/Sleepy-Studio/brand
pnpm install
pnpm validate
```

Run generation commands when source definitions change, then validate generated outputs. Do not report validation as passing unless it was actually run.
