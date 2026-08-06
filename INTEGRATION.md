# Brand integration

Use `Sleepy-Studio/brand` as the canonical source for Sleepy Studio assets and semantic visual tokens.

## Choose a release

Production consumers must pin an immutable tag:

```ts
const BRAND_REF = 'v1.0.0'
const BRAND_BASE = `https://raw.githubusercontent.com/Sleepy-Studio/brand/${BRAND_REF}`
```

Use `main` only for local development or deliberate preview environments.

## Asset manifest

```ts
const manifest = await fetch(`${BRAND_BASE}/assets.json`).then((response) => {
  if (!response.ok) throw new Error(`Brand manifest request failed: ${response.status}`)
  return response.json()
})

const asset = manifest.assets.find((item: { id: string }) => item.id === 'sleepy-yellow')
const url = asset?.variants[0]?.url
```

The manifest is validated against the asset-manifest schema from `Sleepy-Studio/contracts`.

## Direct asset usage

```html
<img
  src="https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/logos/svg/LogoBlack.svg"
  alt="Sleepy Studio"
/>
```

```html
<link
  rel="icon"
  href="https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/favicon.ico"
/>
```

## Semantic tokens

Use the canonical CSS token export before component styles:

```css
@import url('https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/tokens/tokens.css');
@import url('./application.css');
```

```css
.application-card {
  color: var(--sleepy-color-text-primary);
  background: var(--sleepy-color-bg-surface);
  border: 1px solid var(--sleepy-color-border-default);
  border-radius: var(--sleepy-radius-lg);
  box-shadow: var(--sleepy-shadow-surface);
  transition: border-color var(--sleepy-motion-standard) ease;
}
```

Machine-readable tokens are available from `tokens/tokens.json` and validate against the design-token schema in `Sleepy-Studio/contracts`.

## Package consumption

When the Brand package is installed from GitHub Packages:

```css
@import '@sleepy-studio/brand/tokens.css';
```

```ts
import manifest from '@sleepy-studio/brand/assets' with { type: 'json' }
import tokens from '@sleepy-studio/brand/tokens' with { type: 'json' }
```

## Component integration

`Sleepy-Studio/components` owns reusable rendering and interaction. Component-specific variables should use Brand semantic variables as their defaults:

```css
.s-action-button {
  --s-action-button-color: var(--sleepy-color-text-primary);
  --s-action-button-bg: var(--sleepy-glass-background);
  --s-action-button-radius: var(--sleepy-radius-lg);
  --s-action-button-duration: var(--sleepy-motion-standard);
}
```

Applications may override component variables without redefining canonical Brand values.

## Validation

```bash
cd ~/Sleepy-Studio/brand

rm -rf node_modules
pnpm install
pnpm validate
```

Validation checks:

- `assets.json` against the shared asset-manifest contract
- `tokens/tokens.json` against the shared design-token contract

Brand pins Contracts validation to a verified commit. When updating that pin, update the exact matching git locator under `allowBuilds` in `pnpm-workspace.yaml`, remove stale install state, reinstall, and validate.

## Release rule

Before creating a Brand release tag:

1. Set the manifest `ref` to the release tag.
2. Rewrite every manifest asset URL to that tag.
3. Run validation.
4. Confirm all referenced files exist at that commit.
5. Tag the validated commit.

A manifest whose `ref` is `main` is a development manifest and must not be treated as immutable.

## Repository ownership

- Brand: canonical assets, semantic tokens, motion, sound, voice, and visual language.
- Contracts: schemas, types, validators, and compatibility rules.
- Components: reusable visual implementation and interaction.
- Applications: product composition, data fetching, routing, and orchestration.

Questions and changes belong in the issue tracker for `Sleepy-Studio/brand`.
