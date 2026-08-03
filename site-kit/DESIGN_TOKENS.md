# Design Tokens

## Theme

Sleepy Studio web surfaces are always dark by default.

```css
:root {
  --bg: #0a0a0a;
  --bg-card: rgba(20, 20, 20, 0.6);
  --bg-elevated: rgba(26, 26, 26, 0.7);
  --bg-hover: rgba(34, 34, 34, 0.8);
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.14);
  --text: #fafafa;
  --text-muted: #a1a1a1;
  --text-dim: #737373;
  --accent: #ffffff;
  --accent-hover: #e5e5e5;
  --header-bg: rgba(10, 10, 10, 0.6);
  --glass-blur: 16px;
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-highlight: rgba(255, 255, 255, 0.04);
}
```

## Typography

Primary font stack:

```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
```

Guidelines:

- Use compact type scales.
- Prefer strong weight contrast over many font sizes.
- Keep body text readable and muted rather than bright white.
- Reserve full white for primary headings, active controls, and key values.

## Radius scale

- small controls: 8px
- icon buttons: 10px
- buttons and inputs: 12px
- cards and panels: 16px
- avatars and floating marks: circular

## Borders and shadows

Use low-contrast borders and restrained depth:

```css
box-shadow:
  0 1px 0 var(--glass-highlight) inset,
  0 24px 48px rgba(0, 0, 0, 0.25);
```

Avoid bright outlines, heavy gradients, and large colored glows as defaults.

## Glass surface primitive

```css
.surface {
  border: 1px solid var(--glass-border);
  background: var(--bg-card);
  border-radius: 16px;
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}
```

## Button primitive

Buttons should be dark, compact, rounded, and bordered. Primary buttons remain black rather than adopting a bright brand fill.
