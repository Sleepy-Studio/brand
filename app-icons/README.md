# Sleepy Studio App Icons

Canonical application icons for the Sleepy Studio ecosystem.

## Visual standard

- Yellow Sleepy Studio logo
- Rounded dark app tile
- Consistent padding and safe area
- No framework-default icons

## Usage

- Browser favicon: `app-icons/favicon/favicon.ico`
- PNG favicons: `app-icons/favicon/favicon-{16,32,48,64}.png`
- PWA icons: `app-icons/pwa/icon-{192,512}.png`
- Maskable PWA icons: `app-icons/pwa/icon-maskable-{192,512}.png`
- Apple touch icon: `app-icons/apple/apple-touch-icon.png`
- Windows executable/taskbar/installer: `app-icons/windows/sleepy-studio.ico`
- macOS app bundle: `app-icons/macos/sleepy-studio.icns`
- Linux launchers: `app-icons/linux/<size>x<size>/sleepy-studio.png`
- Canonical generated source: `app-icons/source/app-icon-1024.png`

## Generation

```bash
pnpm icons:generate
pnpm validate
```

The generator rebuilds only generated platform directories and preserves this documentation file.
