# Page Sections: Narrative Landing Layout

Reference implementation: `Sleepy-Studio/Sleepy-Studio-landing` (`src/routes/index.tsx`
+ `src/styles.css`). This is the pattern for full-screen, scroll-snapped narrative
pages. Application screens (dashboards, directories, forms) should stay out of it —
see `LAYOUT_AND_RESPONSIVE.md`.

## Section rhythm

A landing page is a vertical stack of viewport-sized sections, each with a clear job:

1. hero
2. showcase / stats
3. cards
4. call to action

Every section except the hero opens with a title and a short muted subtitle that says
what the section is about in one line.

## Scroll snapping

Pure landing pages snap the document scroller:

```css
html {
  scroll-snap-type: y mandatory;
}

.snap-section {
  scroll-snap-align: start;
}
```

For application landing screens, scope snapping to the landing route by toggling a
class on `document.documentElement` (added on mount, removed on unmount), and prefer
`proximity` so dense grids still scroll freely:

```css
html.landing-snap {
  scroll-snap-type: y proximity;
}
```

Use `mandatory` only when every section fits the viewport. Use `proximity` when a
section can exceed one viewport (card grids, long lists).

## Hero

Centered avatar, one strong title, one clear subtitle, one primary action, and a
scroll caret that hints at the section below.

```html
<section class="snap-section hero">
  <div class="hero-inner">
    <div class="glass-avatar hero-avatar">
      <img src="characters/png/sleepyyellow.png" alt="Sleepy Studio" />
    </div>
    <h1 class="hero-title">A clear, specific product line</h1>
    <p class="hero-subtitle">One or two sentences that say exactly what this is and who it is for.</p>
    <a href="#section-id" class="btn btn-accent">Primary action</a>
  </div>
  <div class="scroll-caret" aria-hidden="true"><!-- chevron-down icon --></div>
</section>
```

```css
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem 4rem;
  text-align: center;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 640px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}

.hero-subtitle {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 54ch;
}

.hero-avatar {
  animation: hero-float 5s ease-in-out infinite;
}
```

The avatar floats a warm glow (yellow `rgba(255, 234, 128, …)` ring) rather than
translating; keep it subtle and gate it behind `prefers-reduced-motion`.

## Section titles

```css
.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 0.5rem;
}

.section-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 2rem;
}
```

## Cards

Two supported treatments, both using the glass `card` primitive:

- **Grid** — `repeat(auto-fill, minmax(210px, 1fr))` for app catalogs; used for
  stat tiles and asset/station grids.
- **Showcase rows** — alternating full-width rows (image on one side, title +
  description + tags on the other). On narrow screens they collapse to one column;
  on wide screens every other row flips so images alternate left/right.

Showcase cards:

- `fade-in` with a stagger: `animation-delay: index * 100 + 100ms`
- optional `featured` variant: brighter border and a restrained warm glow
- optional `placeholder` variant: desaturated, no hover lift, "Coming soon" label

```css
.project-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .project-card {
    grid-template-columns: 1fr 1fr;
  }

  .project-card-reversed {
    direction: rtl;
  }

  .project-card-reversed > * {
    direction: ltr;
  }
}
```

## Buttons

- default glass
- `btn-accent` primary black
- `btn-icon` icon-only (must carry an accessible name)
- `btn-github` / `btn-x` — contextual hover shifts toward the service brand color
  (`#2ea043` green, `#1d9bf0` blue) on the border, glyph, and a tinted background

## Entry motion

- `fade-in` 600ms `cubic-bezier(0.16, 1, 0.3, 1)` with a 10px rise for page/section
  entry.
- `scroll-caret` pulses opacity and a small `translateY` on a 1.8s loop.
- CTA attention: brief 2.5s glow pulse on primary buttons, re-triggered when a CTA
  section scrolls into view via `IntersectionObserver`.
- All looping motion is disabled under `prefers-reduced-motion`.

## Mobile-first

- One column until 640px, then split grids.
- Sections use `px-4` horizontal padding and center content vertically.
- Keep primary actions reachable near the center/bottom of the screen on mobile.
- Never assume hover input for anything that matters.
