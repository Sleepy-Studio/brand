source = Sleepy-Studio/sitesite (reference: styles.css + src/routes/index.tsx + components)
primary files = src/styles.css (tokens + base + components) + src/routes/index.tsx + src/components/ProjectCard.tsx + src/components/Header.tsx + src/components/Footer.tsx + src/components/FloatingLogo.tsx
css mechanism = plain CSS, Tailwind v4 imported (`@import "tailwindcss"`) but utility usage is light (the app is hand-written CSS)
framework = React 19 + Vite (TanStack Router)
icons = inline SVG (hand-authored paths for GitHub/X logos ; lucide-react in LuciLab, but sitesite itself uses raw SVGs)
NOTE this is a faithful snapshot of what sitesite builds today, recorded as reference for convergence with the storefront. It is NOT a spec of the sleepy site kit; it IS effectively where much of the kit was distilled from.

---

PALETTE
:root { --bg:#0a0a0a --bg-card:rgba(20,20,20,.6) --bg-elevated:rgba(26,26,26,.7) --bg-hover:rgba(34,34,34,.8) --border:rgba(255,255,255,.08) --border-hover:rgba(255,255,255,.14) --text:#fafafa --text-muted:#a1a1a1 --text-dim:#737373 --accent:#ffffff --accent-hover:#e5e5e5 --header-bg:rgba(10,10,10,.6) --glass-blur:16px --glass-border:rgba(255,255,255,.06) --glass-highlight:rgba(255,255,255,.04) }
html{scroll-behavior:smooth} body{margin:0 color:var(--text) font-family:var(--font-sans) background:var(--bg) overflow-x:hidden}
color model: TRANSLUCENT glass layer cake.
  --bg #0a0a0a (page)
  --bg-card rgba(20,20,20,.6) (card surface)
  --bg-elevated rgba(26,26,26,.7) (button/input bg)
  --bg-hover rgba(34,34,34,.8) (button hover)
  borders: --border rgba(255,255,255,.08) , --border-hover .14 , --glass-border .06
  --glass-* are rgba white with tiny alphas used as inset highlights / glow
INTERACTIVE ACCENT = --accent = #ffffff (white)
BRAND PUNCTUATION YELLOW = #f4e900 (used only as a glow/tint, e.g. .kng-glow drop-shadow, hero avatar warm ring) — NOT the interactive accent. (Storefront, by contrast, makes yellow the PRIMARY interactive color.)
glass surfaces: card, button, input all use backdrop-filter:blur(16px) on semi-opaque rgba() panels.

TYPEFACES
family: Inter (Google Font) via `:root{font-family:...}` and tokens.css `@import "...Inter..."` + `:root{--font-sans:"Inter",...}`. Tailwind @theme sets --font-sans. Inter is loaded.
weights present: 400 (body), 500 (some labels), 600 (section titles, section-kicker-ish), 700 (strong), 800 (hero h1? sitesite hero has no text — avatar only; 800 used on buttons like .btn weight 600 actually). Concretely in CSS: .btn font-weight 600 ; .btn-accent 600 ; section heading uses font-weight 600 ; micro labels uppercase.
typography system:
  micro labels UPPPERCASE with tracking .08em-.14em at 9-11px: .hero__label, .section-kicker-style (trust small), .catalog-labels, .product-tags style
  body: muted white #fafafa/#c8c8c8-ish, line-height 1.4-1.6
  section titles: font-size 1.05rem? No — sitesite sections are minimal; titles use ~font-medium 600. (e.g. .catalog-heading h2 style not present; sitesite has no catalog — it has PROJECTS showcase)
  sitesite has essentially NO long-form body text in its CSS beyond the hero aside paragraph in the LuciLab adaptation. Sitesite proper hero = avatar + Book Us button only (no title/subtitle in CSS; the .hero h1 styles exist for the LuciLab adaptation). So sitesite sitesite-hero is avatar-only.
type scale (rem/px):
  body default ~1rem (16px)
  section micro labels 0.625rem-0.75rem (10-12px) uppercase
  .hero h1 (LuciLab) clamp(72px,12vw,180px) weight default? sitesite .hero h1 uses font-size but sitesite hero has no h1; this was added by LuciLab adaptation. Keep noted.
  headings in LuciLab: h1 2rem(32px? clamp) weight 800 ; h2 1.5rem 600 ; p muted 0.95rem line 1.6
buttons: .btn font-size .875rem(14px) weight 600 ; uppercase? sitesite buttons are title-case ("Book Us", "Sponsor on GitHub"). NOT uppercase. sitesite buttons are NOT pill/rounded-sharp — radius 12px.

buttons
.btn (base) inline-flex center gap .5rem border 1px var(--glass-border) radius 12px bg var(--bg-elevated) color var(--text) padding .625rem 1rem font .875rem weight 600 line 1 cursor pointer backdrop-blur 8px ; transition bg .18s border .18s transform .18s color .18s
  .btn:hover { bg var(--bg-hover) border var(--border-hover) }
  .btn-icon { padding .5rem radius 10px }  (icon-only, 18px lucide in LuciLab header)
  .btn-accent black: bg #000 border #333 color var(--text) box-shadow 0 0 28px rgba(255,255,255,.06) ; hover bg #1a1a1a border #444 box-shadow 0 0 36px rgba(255,255,255,.12)
  .btn-github hover { bg #161b22 border #2ea043 color #2ea043 }   (GitHub-green hover tint)
  .btn-x hover     { bg #1d2836 border #1d9bf0 color #1d9bf0 }    (X-blue hover tint)
  note: buttons are BORDERED with 1px white/glass border, radius 12px. Storefront buttons are border-1px-#fff, radius 0 (sharp). Diverges.

layout / grid
  page-wrap { width:min(1100px,calc(100% - 3rem)); margin-inline auto } ; @640px width calc(100% - 4rem)
  section rhythm = VERTICAL FULL-VIEWPORT SCROLL SNAP.
    html { scroll-snap-type: y mandatory }   (document scroller, mandatory)
    .snap-section { scroll-snap-align: start }
    <main className="snap-container"><section ref heroRef className="snap-section relative flex min-h-[100dvh] items-center justify-center px-4">  ...  </section>
      hero / projects / cta / book  — each a full 100dvh centered snap section. px-4.
  hero: centered. .hero-inner flex col items-center text-center. avatar .glass-avatar.hero-avatar (float animation). CTA buttons .flex flex-col gap-3 sm:flex-row sm:gap-4
  trust strip: .trust-strip display grid repeat(3,1fr)...  (LuciLab adaptation added .trust-strip via sitesite? Actually sitesite has no trust strip; LuciLab index had different.) Wait — sitesite index.tsx sections: hero, projects, cta, book. NO trust strip, NO catalog. The "trust-strip", "catalog", "commerce-grid" are STOREFRONT-only. sitesite is a SHOWCASE of projects (ProjectCard list), not a shop.
  projects: .mx-auto flex h-full max-w-[1100px] flex-col justify-center gap-5 py-20 sm:gap-6 sm:py-24  then  ProjectCard[] mapped.
  book/section: centered card .card p-6 sm:p-8 (glass card) inside .mx-auto max-w-[600px]

cards (projects)
.project-card { display:grid; grid-template-columns:1fr; gap:0; border 1px var(--glass-border) bg var(--bg-card) radius 16px overflow hidden backdrop-blur(16px) box-shadow 0 1px 0 var(--glass-highlight) inset, 0 16px 40px rgba(0,0,0,0.2); transition border .2s transform .2s }
  @640 grid-template-columns 1fr 1fr
  hover: border var(--border-hover) ; transform translateY(-2px)
  .project-card-placeholder  opacity .45 grayscale .6 ; hover transform none border glass-border
  .project-card-featured  border rgba(255,255,255,.35) ; box-shadow 0 1px 0 glass-highlight inset, 0 16px 40px rgba(0,0,0,.2), 0 0 24px rgba(255,234,128,.08)  (warm yellow glow)
  @640 .project-card-reversed { direction:rtl } reversed > * { direction:ltr }   (alternating image side)
  .project-card-image { bg transparent flex center min-height 180px padding 1.5rem } @640 min-height 240px padding 2rem
  img { max-width 100% max-height 100% object-fit contain }
  .kng-glow { filter:drop-shadow(0 0 18px rgba(255,255,0,.35)) }  (yellow glow on featured image)
  .project-card-content { padding 1.25rem flex col justify-center gap .75rem } @640 padding 2rem gap 1rem
  title h3 1.125rem 700 text-white sm 1.25rem ; description p .8125rem text var(--text-muted)
  tags: .flex flex-wrap gap .5rem ; span inline-flex items-center rounded-lg border var(--border) bg var(--bg-elevated) px-2.5 py-1 text-xs 600 text var(--text-muted)
  stagger: each card has style animationDelay `${index*100+100}ms` with global .fade-in
  .fade-in { animation fade-in 600ms cubic-bezier(.16,1,.3,1) both }  @keyframes fade-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

hero avatar (LuciLab adaptation of sitesite hero)
.glass-avatar { position relative border-radius 50% overflow hidden border 2px solid rgba(255,255,255,.6) box-shadow 0 0 0 1px rgba(255,255,255,.25), 0 0 24px rgba(255,234,128,.1) }
.hero-avatar { animation hero-float 5s ease-in-out infinite }
.hero-float @keyframes: 0/100 ring+soft glow ; 50% brighter ring + 0 18px 48px rgba(255,234,128,.22)
.cta-avatar { transform scale .15 opacity 0 }
.cta-logo-in { animation cta-logo-in 2400ms ease both ; from scale .15 opacity 0 ; to scale 1 opacity 1 }
prefers-reduced-motion: .hero-avatar animation none ; .cta-avatar transform none opacity 1 ; .cta-logo-in animation none ; .scroll-caret animation none ; .fade-in animation none

scroll caret
.scroll-caret position absolute bottom 28px left 50% transform translateX(-50%) color rgba(255,255,255,.45) animation caret-pulse 1.8s ease-in-out infinite pointer-events none
  chevron-down svg 22x22 stroke currentColor strokeWidth 2 strokeLinecap round
  @keyframes caret-pulse: 0/100 opacity .25 translateY(0) ; 50% opacity .7 translateY(6px)

header (sitesite)
.site-header position sticky top z-index 50 border-bottom 1px var(--glass-border) bg var(--header-bg) backdrop-blur(16px) box-shadow 0 1px 0 var(--glass-highlight) inset
  .header-nav { ... grid items-center ; padding }  (LuciLab header-nav is a LuciLab adaptation: grid-template-columns auto 1fr auto, centered .header-actions absolute)
  brand mark left (sleepyYellow logo 42x42), action group right (GitHub + X icon buttons), no text nav
  .header-actions centered absolute (LuciLab) — sitesite sitesite-header centers actions
  github/x buttons: btn btn-icon btn-github / btn-x with raw SVG 18x18

footer
.site-footer border-top 1px var(--border) bg var(--bg-card)
  .page-wrap flex justify-between items-center gap 30px text-left sm:flex-row  ; left: sleepyYellow img 40x40 + "© year Sleepy Studio. All rights reserved." ; centered small

BREAKPOINTS
  640px   the main promote-up breakpoint:
            .project-card 1fr 1fr
            .project-card-image min-height 240px
            .project-card-content padding 2rem gap 1rem
            .page-wrap width calc(100% - 4rem)
            floating-logo 56x56 bottom/right 24px
            page-wrap flex row (footer)
            .hero__label gap? (LuciLab) 
  (no 720/900 breakpoints in core sitesite; LuciLab added none beyond 640 + 860 viewer). sitesite is 1-breakpoint: 640.
  trusts? none — sitesite is minimal, no trust-strip.

MOTION & EFFECTS
  html scroll-behavior: smooth
  .fade-in 600ms ease both (entry)
  .hero-float 5s infinite (avatar glow bob)
  .cta-logo-in 2400ms (logo pop)
  .caret-pulse 1.8s infinite (down-chevron breath)
  .pulse-github / .pulse-x 2.5s x3 with delay (CTA button glow pulses via IntersectionObserver on viewport) — keyframes glow-pulse-github (green #2ea043) / glow-pulse-x (blue #1d9bf0)
  .kng-glow drop-shadow yellow on featured card image
  transitions: button/card .18s ; image .28s ; card action .2s ; search border .2s
  prefers-reduced-motion respected on: fade-in, hero-avatar, cta-avatar, cta-logo-in, scroll-caret, (pulse-target classes). No reduced-motion on the hover scales.
  backdrop-filter blur 8px (buttons/inputs), 14px (header), 16px (cards/glass surfaces)

TYPOGRAPHY — micro-label / copy reality (from index.tsx)
  hero: NO title/subtitle in raw sitesite (LuciLab added .hero h1). sitesite hero = avatar + "Book Us" btn + scroll caret.
  projects section: no section title in core sitesite index — just the grid. (LuciLab added section titles)
  cta section: avatar + <CtaButtons> (Sponsor on GitHub / Follow on X / Buy us a coffee) + caret
  book section: card with h2 "Book a Project", p "Tell us...", form inputs, disabled submit "Currently booked"
  micro: "Drop 001 / Live catalog" style kickers are STOREFRONT. sitesite kickers: "Store / Live catalog"? no. sitesite has "section-kicker"? Not in core sitesite. The uppercase micro labels exist in catalog categories (storefront). sitesite's micro text: "SLEEPY / ###" appears only as SVG art in product data. So sitesite text is MINIMAL: hero (none), one line per CTA button ("Book Us").

STRUCTURE (copy map, sitesite)
  main.snap-container
    section.snap-section.hero        heroRef ; centered glass-avatar + .fade-in ; scroll-caret
    section.snap-section#projects    min-h 100dvh ; .page-wrap max-w 1100 ; ProjectCard[] (alternating reversed, featured glow, fade-in stagger)
    section.snap-section#cta         ctaRef ; centered .cta-avatar glass-avatar + <CtaButtons> + caret ; IntersectionObserver re-triggers pulse + cta-logo-in
    section.snap-section#book       bookRef ; .page-wrap max-w 600 ; card p-8 ; h2 "Book a Project" ; form (name/email/xHandle/message) ; disabled "Currently booked" ; p "We're currently booked. Check back soon."
  (floating-logo fixed bottom-right sleepyYellow — optional cross-project signature)
  header.site-header (sticky, brand left + github/x right)
  footer.site-footer

NOTABLE ABSENCE vs storefront
  - NO catalogue / product listing. sitesite is a showcase of Sleepy Studio projects (3rd-party github links), not an e-commerce shop.
  - NO prices, NO cart, NO checkout, NO Stripe, NO Printify, NO product options, NO inventory.
  - hero is character/avatar-centered, not editorial-title-centered.
  - one breakpoint (640) vs storefront's three (900/720/380).
  - typeface Inter vs storefront Arial.
  - interactive accent white vs storefront yellow.
  - glass surfaces everywhere vs storefront flat opaque.
  - scroll-snap mandatory full-viewport sections vs storefront free-scroll.
  - explicit prefers-reduced-motion guards vs storefront none.
