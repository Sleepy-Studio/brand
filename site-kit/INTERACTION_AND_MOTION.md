# Interaction and Motion

## Motion principles

- Motion should clarify state or guide attention.
- Avoid continuous decorative animation in application views.
- Keep hover movement subtle.
- Respect `prefers-reduced-motion` everywhere.
- Do not block interaction while animation completes.

## Default transitions

Use approximately 180–200ms for:

- background changes
- border changes
- color changes
- small transforms

Use approximately 500–700ms for page-entry fades.

## Standard entry motion

```css
.fade-in {
  animation: fade-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Reduced motion

At minimum:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Project-specific components may apply more selective handling, but no essential function may depend on animation.

## SleepyRadio guidance

For a radio interface:

- animate play-state changes minimally
- avoid pulsing album art or station logos
- use a quiet progress or connection indicator
- fade audio separately from visual motion
- keep the persistent player stable while navigating
