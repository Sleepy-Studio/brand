# Sleepy Studio Brand

Canonical source of truth for Sleepy Studio identity, assets, visual language, voice, motion, sound, naming, and brand manifests.

## Use assets

```html
<img src="https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/logos/svg/LogoBlack.svg" />
```

## Get the manifest

```bash
curl https://raw.githubusercontent.com/Sleepy-Studio/brand/v1.0.0/assets.json
```

Production consumers should pin immutable release tags rather than `main`.

## Repository scope

```text
logos/
characters/
3d-models/
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

## Consumption rules

- Consume Brand assets rather than redrawing or locally modifying them.
- Generated mirrors must identify their source version and remain reproducible.
- Luci-specific creative assets belong to [`Sleepy-Studio/lucilab`](https://github.com/Sleepy-Studio/lucilab).
- Reusable component behavior belongs to [`Sleepy-Studio/components`](https://github.com/Sleepy-Studio/components).
- Application repositories should document their pinned Brand release.

## Documentation

- [INTEGRATION.md](INTEGRATION.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CHANGELOG.md](CHANGELOG.md)
- [assets.json](assets.json)
