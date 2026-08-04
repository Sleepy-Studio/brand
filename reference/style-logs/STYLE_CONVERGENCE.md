# Style Convergence — Sitesite vs Storefront (snapshot alignment)

Companion to `STOREFRONT_STYLE_LOG.md` and `SITESITE_STYLE_LOG.md`. This is an
alignment record, not a spec rewrite. It maps the two builds field-by-field against
the shared Sleepy Studio site kit (`site-kit/DESIGN_TOKENS.md`), states where they are
not in alignment, and proposes an **emergent style** the organization can converge onto
with the fewest, most sensical changes.

All three sources as of 2026-08-04.

---

## Three-way reality check

| Surface | Typeface | Interactive accent | Surface model | Button radius | Breakpoints | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| **Site kit (canonical)** | Inter | `--accent` = `#ffffff` | Glass (rgba + 16px blur) | 12px | 640 + 900 | Required |
| **Sitesite** | Inter | `#ffffff` | Glass (rgba + blur) | 12px | 640 | Respected on key motion |
| **Storefront** | Arial / Helvetica / sans-serif | `#f4e900` (yellow, primary) | Flat opaque (`#050505`, `#090909`, `#333`), no blur | 0 (sharp) | 900 / 720 / 380 | **None authored** |
| **LuciLab (current)** | Inter | `--accent` = `#ffffff` | Glass (uses kit tokens) | 12px | — | Respected |

**Headline:** sitesite and the kit agree with each other. Storefront is the divergent
implementation. LuciLab (this repo) is already aligned to the kit system. The emergent
style is essentially "make storefront match sitesite/kit", with yellow demoted from
*interactive accent* to *brand punctuation*.

---

## Misalignment matrix (highest leverage)

| Dimension | Sitesite / Kit | Storefront | Delta / risk |
| --- | --- | --- | --- |
| **Typeface** | Inter (Google Font), weights 400/500/600/700/800 | Arial/Helvetica system stack, only 400/800 | Font identity; easy fix (import Inter). |
| **Interactive accent** | White `#ffffff` everywhere buttons/links/focus | Yellow `#f4e900` as primary button bg, borders, links, accent borders, price | Largest visual signature difference. Storefront's "yellow everything" vs kit's "white accents, yellow as punctuation". |
| **Brand punctuation** | Yellow `#f4e900` used only as glow/ring (e.g. `.kng-glow`, avatar ring) | Yellow is simultaneously the brand and the interactive color — no separation | Opportunity: split `--accent` (interactive) from `--brand-yellow` (punctuation). |
| **Surface model** | Translucent glass: `rgba(…, .6/.7)` panels, `backdrop-filter: blur(16px)`, `glass-border` rules | Flat opaque solids, `#333` rules, zero blur | Biggest texture/feel gap. Storefront reads "flat material", sitesite reads "frosted glass". |
| **Button geometry** | 12px radius, `1px` glass border, `gap:0.5rem`, `0.625rem 1rem` padding | `border-radius:0` (square), `1px #fff` border, `12px 18px` padding, square corners | Storefront buttons are deliberately sharp/square-cornered; kit wants 12px rounded. |
| **Scroll rhythm** | Mandatory full-viewport snap sections (`min-h:100dvh`) | Free scroll, dense catalog grid, no snap | Intentional: kit PAGE_SECTIONS.md explicitly says *don't snap dense product grids*. Storefront is currently correct; sitesite is a narrative showcase. |
| **Breakpoints** | One: 640 (promote 1→2 col) | Three: 900 / 720 / 380 | Granular is fine; kit doesn't mandate. Minor. |
| **Motion** | `fade-in` entry, hero avatar float, caret pulse, CTA glow; `@media (prefers-reduced-motion)` resets key motion | `scroll-behavior:smooth` + `.2s` hover lifts only; **no reduced-motion guard** | Storefront has a concrete accessibility gap (violates kit INTERACTION_AND_MOTION.md). |
| **Micro-typography** | Title-case buttons ("Book Us", "Sponsor on GitHub"); uppercase micro labels `.08–.14em` tracking | Uppercase buttons are *not* uppercase (e.g. "Shop the drop"); uppercase micro labels `.08–.14em` | Minor voice difference. |

---

## Options for the emergent style

### Option A — Converge Storefront onto the sitesite/kit system (recommended)
Keep **one** canonical interactive language across the org; the storefront adapts to it.
Yellow is preserved as *brand punctuation* (not erased), which keeps storefront's identity
while gaining cross-product consistency.

- **A1 Typeface:** import `Inter` (via the kit `tokens.css` Google-Font import already used
  by sitesite/LuciLab). One edit.
- **A2 Accent split:** `--accent: #ffffff` for interactive (buttons/links/focus/focus rings),
  introduce `--brand-yellow: #f4e900` for punctuation only (price, hover tint on hover
  states, icon glows, the announcement bar stays yellow as brand punctuation). This is the
  biggest change but directly matches kit DESIGN_TOKENS ("Avoid bright… large colored glows
  as defaults; yellow = punctuation"). Storefront's current yellow-everywhere rule shrinks
  to a token.
- **A3 Surfaces:** switch flat solids to the kit glass palette (`--panel`→`--bg-card`,
  rules→`--glass-border`, add `backdrop-filter: blur(16px)` to card/modal/cart surfaces like
  sitesite does).
- **A4 Buttons:** `border-radius: 12px`, padding `11px 14px`→ align to kit `.btn` (`0.625rem 1rem`), keep `gap:0.5rem`.
- **A5 Motion:** add `prefers-reduced-motion` reset block + `.fade-in` entry animation; keep storefront's `.28s` image zoom and `.2s` action reveal.
- **A6 Scroll rhythm:** keep storefront's free-scroll catalog (kit says dense grids should NOT snap) — this is *correct as-is*, not a misalignment. Only narrative sections (hero, CTA confirmation) can opt into snap later.

Net: storefront visually joins the family; ~5 CSS/asset edits; no JS changes.

### Option B — Make yellow the org-wide interactive accent instead
Flip it: storefront stays yellow-primary; sitesite + LuciLab switch their white `--accent`
to `#f4e900`. Pros: one color. Cons: it fights the kit token (white accent) and the sitesite
glass aesthetic (white is the light, yellow is the spark). **Not recommended** — moves the
most work to the already-conforming surfaces and erases the kit's "yellow = punctuation"
distinction.

### Option C — Leave them separate
Both are "valid Sleepy Studios". Pros: zero work. Cons: the two surfaces no longer read as
one brand (Inter vs Arial, glass vs flat, white-accent vs yellow-accent, snap vs free).
Defeats the purpose of the site kit. The gap is large enough that users perceive them as
different companies.

---

## Smallest sensical convergence plan (the recommendation)

Adopt **Option A** but stage it so each step is independently shippable:

1. **Typeface** — switch storefront body to Inter (import via kit tokens.css). [1 file]
2. **Motion** — add a `prefers-reduced-motion` guard + a page entry `.fade-in`. [1 file]
   *Accessibility win, no visual risk.*
3. **Accent split** — rename storefront `--accent` to `--brand-yellow`, set `--accent: #ffffff`
   for interactive, remap hover/active states to use `--accent-white`/`--accent-yellow`.
4. **Glass surfaces** — convert flat solids to kit glass tokens + `backdrop-filter`.
5. **Buttons** — 12px radius + kit padding.

After this, storefront and sitesite share: typeface, glass surface model, white interactive
accent, yellow brand punctuation, radius scale, motion guardrails, and entry motion.
Breakpoints stay storefront-specific (900/720/380 is a superset of kit's 640 — harmless).

Sitesite should *not* become e-commercey: its showcase-hero / snap / minimal copy is
intentional and kit-blessed (PAGE_SECTIONS.md). The convergence is **visual language**, not
**content model**.

---

## Current state of record

- **Sitesite** is the reference implementation of the glass + Inter + white-accent +
  yellow-punctuation + snap-sections system. It is also the reason the kit tokens/css exist.
- **LuciLab** (this repo) already consumes the kit `tokens.css`/`styles.css` at a pinned
  tag and follows PAGE_SECTIONS.md (snap landing, glass avatar) and COMPONENT_PATTERNS.md
  (icon-only sticky header). It is the already-converged example.
- **Storefront** is the outlier to converge.

---

## Migration quick refs

- Kit token source of truth: `site-kit/DESIGN_TOKENS.md` + `site-kit/tokens.css`.
- Kit radius: 8 / 10 / 12 / 16 / circular.
- Kit motion: 180–200ms controls, 500–700ms entry fades, `prefers-reduced-motion` mandatory.
- Kit scroll rule: snap for narrative; never snap dense dashboards/cards grids.
