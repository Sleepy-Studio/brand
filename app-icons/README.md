# Sleepy Studio App Icons

This directory is generated from `logos/png/sleepyyellow.png` by `pnpm icons:generate`.

The canonical treatment is the yellow Sleepy Studio logo centered on a dark rounded application tile. The normal icon set uses a 13% edge safe area. Maskable PWA icons use a 22% safe area.

## Consumers

| Platform | Asset |
|---|---|
| Browser favicon | `favicon/favicon.ico` or `favicon/favicon-32.png` |
| PWA | `pwa/icon-192.png` and `pwa/icon-512.png` |
| Maskable PWA | `pwa/icon-maskable-192.png` and `pwa/icon-maskable-512.png` |
| Apple touch | `apple/apple-touch-icon.png` |
| Windows executable, taskbar, installer | `windows/sleepy-studio.ico` |
| macOS application | `macos/sleepy-studio.icns` |
| Linux desktop and launcher | `linux/<size>x<size>/sleepy-studio.png` |
| Canonical generated source | `source/app-icon-1024.png` |

Do not substitute React, Vite, Tauri, Electron, browser, or operating-system default icons.

## Regeneration

```bash
pnpm install
pnpm icons:generate
pnpm validate
```

Generated files must be committed whenever the canonical yellow logo or icon treatment changes.
