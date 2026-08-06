# Repository instructions

Sleepy Studio Brand is the canonical source for organization-wide identity, assets, semantic design tokens, motion, sound, voice, naming, and visual language.

## Change requirements

Every Brand change must keep source assets, manifests, token exports, documentation, and validation aligned.

1. Do not redraw, rename, recolor, relocate, or reinterpret canonical assets in downstream repositories.
2. Record canonical assets in `assets.json` with stable identifiers and correct paths.
3. Keep `tokens/tokens.json` and `tokens/tokens.css` semantically equivalent.
4. Validate manifests and token documents against `@sleepy-studio/contracts`.
5. Treat `main` as a development channel. Production consumers must use immutable release tags.
6. Before a release, replace manifest `ref: "main"` and all mutable asset URLs with the release tag.
7. Pin the Contracts validation dependency to a verified revision. Approve its repository-level git locator in the root `pnpm-workspace.yaml`; never use a commit-specific `#<sha>` approval.
8. Update README and integration guidance when public asset paths, exports, tokens, or release procedures change.

## pnpm build approvals

Follow the organization standard in [`Sleepy-Studio/.github/docs/pnpm-build-approvals.md`](https://github.com/Sleepy-Studio/.github/blob/main/docs/pnpm-build-approvals.md).

Git-hosted Sleepy Studio packages that require install-time scripts must be approved by repository URL in the root `pnpm-workspace.yaml`. Do not use `dangerouslyAllowAllBuilds`, and do not require users to repeat manual approval workarounds after dependency revisions change.

## Repository boundaries

Brand owns canonical identity and semantic defaults. Components owns reusable rendering and interaction. Contracts owns schemas and validators. Applications own product composition. Luci-specific creative assets belong in `Sleepy-Studio/lucilab`.

## Verification

```bash
cd ~/Sleepy-Studio/brand

pnpm install
pnpm validate
```

Do not report validation as passing unless it was actually run.
