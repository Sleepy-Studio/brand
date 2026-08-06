# Sleepy Studio Brand

Canonical source of truth for Sleepy Studio identity, assets, visual language, voice, motion, sound, naming, manifests, semantic design tokens, and application icons.

## Production consumption

Pin an immutable Brand release:

```html
<img src="https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/logos/svg/LogoBlack.svg" alt="Sleepy Studio" />
```

`main` is the development channel. Production applications should record and consume an immutable release tag.

## Canonical app icons

All Sleepy Studio browser, PWA, Windows, macOS, Linux, taskbar, launcher, installer, and shortcut icons come from `app-icons/`.

The canonical treatment is the yellow Sleepy Studio logo on a dark rounded tile. Framework defaults such as React, Vite, Tauri, and Electron icons are not permitted in ecosystem applications.

```bash
pnpm install
pnpm icons:generate
pnpm validate
```

See [`app-icons/README.md`](app-icons/README.md) for the platform mapping.

## Semantic tokens

JSON tokens are published from `tokens/tokens.json`. CSS variables are published from `tokens/tokens.css`.

```css
@import url('https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/tokens/tokens.css');

.product-surface {
  color: var(--sleepy-color-text-primary);
  background: var(--sleepy-color-bg-surface);
  border-radius: var(--sleepy-radius-lg);
}
```

Components may expose component-specific variables, but their defaults should resolve through these semantic Brand variables.

## Contracts and validation

`assets.json` and `tokens/tokens.json` conform to schemas owned by [`Sleepy-Studio/contracts`](https://github.com/Sleepy-Studio/contracts).

```bash
cd ~/Sleepy-Studio/brand

rm -rf node_modules
pnpm install
pnpm icons:generate
pnpm validate
```

Validation checks the asset manifest, semantic-token document, and required app icon outputs. The Contracts dependency is pinned to a verified commit. When that pin changes, update the exact matching git locator under `allowBuilds` in `pnpm-workspace.yaml`, reinstall, and validate again.

The development asset manifest declares `ref: "main"`. Release preparation must rewrite `ref` and every asset URL to the immutable release tag before publishing.

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

Not every area is implemented yet, but Brand is the canonical owner as those systems are added.

## Ownership rules

- Consume Brand assets rather than redrawing or independently modifying them.
- Generated mirrors must identify their source version and remain reproducible.
- Luci-specific creative assets belong to [`Sleepy-Studio/lucilab`](https://github.com/Sleepy-Studio/lucilab).
- Reusable component behavior belongs to [`Sleepy-Studio/components`](https://github.com/Sleepy-Studio/components).
- Implementation-neutral schemas and shared data contracts belong to [`Sleepy-Studio/contracts`](https://github.com/Sleepy-Studio/contracts).
- Application repositories should document their pinned Brand release.

## Documentation

- [INTEGRATION.md](INTEGRATION.md)
- [app-icons/README.md](app-icons/README.md)
- [AGENTS.md](AGENTS.md)
- [assets.json](assets.json)
- [tokens/tokens.json](tokens/tokens.json)
- [tokens/tokens.css](tokens/tokens.css)
