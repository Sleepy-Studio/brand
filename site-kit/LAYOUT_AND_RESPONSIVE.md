# Layout and Responsive Rules

## Page width

Use a centered content wrapper:

```css
.page-wrap {
  width: min(1100px, calc(100% - 3rem));
  margin-inline: auto;
}

@media (min-width: 640px) {
  .page-wrap {
    width: min(1100px, calc(100% - 4rem));
  }
}
```

## Mobile-first behavior

- Begin with one-column layouts.
- Promote to split layouts at approximately 640px.
- Do not assume hover input.
- Keep primary controls reachable near the bottom or center of the screen on mobile.
- Avoid fixed-width panels.

## Full-screen sections

The landing site uses optional viewport-height sections and scroll snapping. This is appropriate for narrative landing pages, but not mandatory for application interfaces.

Use full-screen sections for:

- hero moments
- focused product showcases
- major calls to action

Do not use scroll snapping for:

- dense dashboards
- station directories
- search results
- long settings forms
- content that users need to scan rapidly

## Sticky header

The standard header is sticky, translucent, and separated by a subtle border. It should remain shallow and avoid dominating the viewport.

## Cards

Cards should:

- use 16px radius
- use glass background and blur
- use a subtle one-pixel border
- move no more than 2px on hover
- stack vertically on narrow screens

## Density guidance

Landing pages may use generous space. Product interfaces such as SleepyRadio should preserve the same tokens while increasing information density.
