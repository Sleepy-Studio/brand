source = Sleepy-Studio/storefront branch `feat/commerce-platform`
primary files = app/globals.css + app/desktop-cards.css + app/components/CommerceStorefront.tsx
css mechanism = plain CSS (Tailwind v4 imported but only the `sr-only` utility is used)
framework = Next.js 16.2.6 + React 19 + vinext dev server
icons = lucide-react
NOTE this is a faithful snapshot of what the branch builds today, recorded as reference. It is NOT reconciled against the sleepy site kit; see STYLE_CONVERGENCE.md for misalignments.

---

PALETTE
:root { color-scheme: dark; background: #050505; color: #fff; font-family: Arial, Helvetica, sans-serif }
token variables (all declared on :root):
  --accent = #f4e900     (signature yellow, the PRIMARY interactive color)
  --panel  = #090909     (card / modal / cart surfaces)
  --line   = #292929     (grid gutters, borders, rules)
  --muted  = #999        (secondary text)
flat grays used inline as hardcoded values (no tokens):
  #050505  page/body bg, primary button hover bg
  #080808  header search field bg
  #0d0d0d  modal gallery bg
  #151515  thumbnail bg
  #1a1a1a  category count badge bg
  #292929  rules / gridlines (same as --line)
  #333     borders (inputs, search, modal, thumbnails, selects)
  #383838  modal frame border
  #444     select border
  #555     scrollbar thumb hover
  #777     catalog results / footer muted
  #888     trust-strip small, placeholder
  #8a8a8a  card meta text
  #8b8b8b  assurances text
  #999     muted (-same- as --muted token)
  #aaa     hero aside copy, empty text, result body
  #bbb     hero aside strong, card/category text
  #c8c8c8  hero aside paragraph
  #ffffff  white type / borders
  #ff8c8c  danger / error / cart-remove:hover / commerce-error
yellow application: yellow is PRIMARY. bg of announcement bar, hover color of primary buttons, hover color of category pills, primary button text on hover is black, price color, all accent borders.
white application: page bg is #050505 not #000; white used for type + borders + header search.
surfaces: NO glass. flat opaque backgrounds, no backdrop-filter anywhere.

TYPEFACES
family: Arial, Helvetica, sans-serif (system stack). No web fonts, no @font-face, no next/font.
weights present:
  800  announcement bar, .primary-button, .secondary-button, primary-button-text, variant count badge strong, product-add disabled label, cart total, .product-price, hero__aside strong (Wear the), empty h3
  700  only inside the SVG product title art (hardcoded font-weight="700" in the generated image)
  400  body
typography system:
  buttons are uppercase in places (announcement, category pills, sort, eyebrow, tags) but the main product/button labels are sentence case (Shop the drop, View product, Add to cart, Open registry).
  micro labels: text-transform:uppercase, tight tracking .08em-.14em, 9px-12px.
  body: ~16px, line-height 1.5-1.6, color #bbb/#c8c8c8/#aaa graded.
type scale (px):
  hero h1        clamp(72,12vw,180)  weight default  line .82  ls -.07em   (accent word span = var(--accent) yellow)
  hero h1 sm     clamp(56,20vw,86) ; @380 h1 = 54px
  hero aside p   20px  / 1.5        color #c8c8c8
  catalog h2     48px  ls -.03em
  catalog p      14px  / 1.5        color #aaa
  card h3        20px  / 1.25       min-height 2.5em     (desktop compact @901: 15px)
  card footer strong  14px          (compact: 12px)
  modal h2       42px  / 1.02  ls -.035em  (sm 31px)
  price          25px  weight 800   color var(--accent) yellow
  cart h2        32px
  cart total     22px
  empty h3       24px
  result h1      72px
  footer p       12px
  assurances     12px
  labels         9px-11px uppercase
button text      14px  weight 800

buttons
primary/secondary share base: inline-flex align-center justify-center gap:9px  border:1px solid #fff  padding:12px 18px  font-weight:800  cursor:pointer  no radius (inherits button{border-radius:0} reset)
  .primary-button   bg #fff text #050505     hover: bg var(--accent) border var(--accent) (text stays black)
  .primary-button:disabled { opacity:.45; cursor:not-allowed }
  .secondary-button bg #050505 text #fff     hover: border var(--accent) text var(--accent) (bg stays dark)
  square corners everywhere (button{border-radius:0}).
  .cart-trigger secondary button: the <b> count = grid place-items/center  min-width:24px height:24px  bg var(--accent) yellow  color #050505  font-size 11px  (pill).

header
.site-header sticky top z20 grid  1fr minmax(280px,600px) auto  gap 20px  align center  padding 16px 28px  bg rgba(5,5,5,.94)  backdrop-blur(14px)  border-bottom 1px var(--line)
  (note: header uses backdrop-filter blur 14px even though card/modal surfaces do NOT blur — minor inconsistency)
.announcement-bar flex center gap 48px padding 8px 20px bg var(--accent) yellow color #050505 font 10px weight 800 ls .14em uppercase ; "/" separators via span+span:before content:"/" margin-right 48px opacity .4
.brand-lockup flex align center gap 12px  img 42x42 (36x36 @720)  text stack strong+small ; small = color var(--muted) uppercase ls .12em 11px
.header-search flex align center gap 10px border 1px #333 padding 11px 14px bg #080808 ; :focus-within border-color var(--accent) ; input border 0 outline 0 bg transparent color #fff

hero
.hero padding 70px 5vw 54px border-bottom 1px var(--line) bg radial-gradient(circle at 78% 18% rgba(244,233,0,.07) transparent 27%)   (one yellow halo)
.hero__content grid 1.5fr 1fr gap 8vw align end
.hero h1 font-size clamp(72px,12vw,180px) line .82 ls -.07em margin 76px 0 0 ; the accent word <span> = var(--accent) yellow
.hero__aside padding-bottom 18px ; p 20px/1.5 color #c8c8c8 margin 0 0 28px
.hero__label flex justify-between color var(--muted) uppercase ls .14em 11px
primary cta .primary-button full white block   label "Shop the drop"  -> #catalog

trust strip
.trust-strip grid repeat(3,1fr) border-bottom 1px var(--line)
  each cell flex align center gap 14px padding 22px 5vw border-right 1px var(--line) (last removes border) ; icon svg color var(--accent) yellow ; strong / small label stack ; small = color #888

catalog
.catalog-section padding 70px 5vw 90px
.catalog-heading flex justify-between gap 40px align end margin-bottom 36px ; kicker .section-kicker muted uppercase ls .12em 11px ; h2 48px ls -.03em ; p max-width 520px #aaa
.catalog-toolbar flex justify-between align end gap 24px padding-top 18px border-top 1px var(--line) margin-bottom 16px
.catalog-categories flex gap 8px flex-wrap ; pills: inline-flex align-center gap 8px bg var(--panel) #bbb border 1px #333 padding 10px 12px cursor text-transform uppercase ls .08em 10px ; count span = grid place-items/center min-width 20px height 20px padding 0 5px bg #1a1a1a color #888 10px ; hover/active: border var(--accent) text #050505 bg var(--accent) ; count span bg rgba(5,5,5,.16) color #050505
.catalog-sort flex align center gap 10px white-space nowrap color #999 uppercase ls .1em 10px ; select min-width 185px bg var(--panel) color #fff border 1px #333 padding 11px 34px 11px 12px
.catalog-results flex justify-between align center margin 0 0 14px color #777 10px uppercase ls .12em ; "clear filters" link = bg none border 0 color var(--accent) padding 0 cursor uppercase ls .1em 10px

grid
.commerce-grid grid repeat(3,1fr) gap 1px bg var(--line) border 1px var(--line)   (hairline grid gutter)
.commerce-card position relative bg var(--panel) color #fff border 0 text-left padding 0 cursor pointer overflow hidden
  image: .commerce-card__image position relative aspect-ratio 1/1 bg var(--accent) display grid place-items center overflow hidden ; img width 92% height 92% object-fit contain object-position center transition transform .28s ; hover transform scale(1.025)
  count badge: position absolute right 12px top 12px padding 6px 8px bg rgba(5,5,5,.82) border 1px #333 color #bbb 10px uppercase ls .08em
  action: position absolute left 12px bottom 12px flex align center gap 7px padding 8px 10px bg #050505 color #fff 10px weight 800 uppercase ls .09em opacity 0 translateY(6px) transition .2s ; hover opacity 1 transform none
  body: padding 18px 18px 20px
  meta+footer: flex justify-between align-center gap 14px
  meta text: color #8a8a8a uppercase ls .1em 10px
  h3: 20px/1.25 margin 11px 0 22px min-height 2.5em
  footer strong: 14px
.empty-state/.empty-cart flex col center text-center padding 70px 20px border 1px var(--line) color #aaa ; icon svg color var(--accent) 38x38 ; h3 color #fff 24px margin 18px 0 6px ; p margin 0 0 22px

desktop compact (app/desktop-cards.css min-width:901px)
  grid -> repeat(6,minmax(0,1fr))   (six across)
  card body padding 12px 12px 14px
  h3 min-height 2.5em margin 8px 0 14px font-size 15px line 1.25
  meta/small/footer spans font-size 8px
  footer strong font-size 12px
  image count top 8px right 8px padding 5px 6px font-size 8px
  action left 8px bottom 8px padding 6px 8px font-size 8px

modal
.commerce-overlay fixed inset z50 bg rgba(0,0,0,.82) flex center padding 24px backdrop-filter blur(8px)
.commerce-modal relative grid 1.12fr 1fr max-width 1160px width 100% max-height 92vh overflow auto bg var(--panel) border 1px #383838 box-shadow 0 30px 100px rgba(0,0,0,.55)
  gallery: min-width 0 bg #0d0d0d border-right 1px var(--line) flex col
  .commerce-modal__image min-height 540px max-height 68vh bg var(--accent) grid place-items center padding 24px overflow hidden ; img width 100% height 100% max-height 62vh object-fit contain
  .commerce-thumbnails flex gap 9px padding 13px overflow-x auto border-top 1px var(--line) scrollbar-width thin
  .commerce-thumbnail flex:0 0 76px width 76 height 76 padding 5px border 1px #333 bg #151515 cursor ; .is-active border var(--accent) ; img 100%/100% contain
  .commerce-close (top-right x): bg none color #fff border 0 cursor padding 8px border 1px #333 bg rgba(5,5,5,.82)
  details: padding 44px flex col gap 17px
  .product-eyebrow flex justify-between gap 20px color #777 10px uppercase ls .1em
  details h2 42px/1.02 ls -.035em ; .product-price 25px weight 800 color var(--accent) yellow ; p.product-description color #bbb line 1.6 margin 0 max-height 190px overflow auto
  tags: flex row wrap gap 7px ; span padding 6px 8px border 1px #333 color #888 9px uppercase ls .1em
  label: flex col gap 8px color #aaa 11px uppercase ls .1em ; select bg #050505 color #fff border 1px #444 padding 13px
  .product-add width 100% min-height 50px (a primary button)
  .product-assurances grid gap 8px padding-top 14px border-top 1px var(--line) color #8b8b8b 12px ; span flex align center gap 8px ; icon svg 14x14 color var(--accent) yellow

cart
.commerce-cart margin-left auto height 100% width min(520px,100%) bg var(--panel) border-left 1px #333 padding 28px overflow auto
  header: flex justify-between align-start padding-bottom 20px border-bottom 1px var(--line) ; h2 32px margin 5px 0 0
  item: grid 76px minmax(0,1fr) auto align center gap 15px padding 18px 0 border-bottom 1px var(--line)
    img/placeholder slot 76x76 object-fit contain bg var(--accent)
    copy: flex col gap 5px min-width 0 ; strong = title ; span/small = variant/amount color #999
  remove: flex align center gap 5px width max-content margin-top 5px padding 0 bg none border 0 color #777 11px cursor ; hover color #ff8c8c
  qty: flex align center gap 9px ; buttons 31x31 border 1px #444 bg #050505 color #fff cursor grid place-items center
  summary: padding 20px 0 6px ; rows flex justify-between padding 7px 0 ; total 22px
  note: 12px/1.5
  primary checkout button full width min-height 50px
  security: flex center align center gap 7px padding-top 14px color #777 11px ; shield 14x14 color var(--accent)
  empty cart reuses empty-state geometry, ShoppingBag icon, "Continue shopping" secondary button

footer
.site-footer flex justify-between align center gap 30px padding 34px 5vw border-top 1px var(--line) color #777
  left cell: flex align center gap 12px ; logo img 40x40 ; strong/small stack ; small margin-top 4px (no size shown, uses brand-lockup small = muted uppercase 11px)
  right: p 12px

BREAKPOINTS
  900px   header grid 1fr auto ; search own row (grid-col 1/-1 row 2) ; modal/hero_content single column ; trust strip single col ; image min-height 340px max-height 50vh
  720px   header grid minmax(0,1fr) auto gap 10px padding 12px 14px ; brand img 36px ; secondary-button padding 10px 11px ; cart span display none ; search own row padding 10px 12px ; hero padding 34px 18px 38px ; hero label gap 16px size 9px ; hero content block ; h1 clamp(56px,20vw,86px) line .86 margin 42px 0 28px ; aside p 17px ; primary button width 100% ; trust cell padding 17px 18px ; catalog-section padding 40px 14px 58px ; heading margin-bottom 24px ; h2 36px line 1.05 ; h2 p 14px ; toolbar gap 12px ; categories = horizontal snap rail width calc(100%+28px) margin-left -14px padding 0 14px flex-wrap nowrap overflow-x auto scrollbar-width none + ::-webkit-scrollbar none ; pills flex:0 0 auto scroll-snap-align start ; sort width 100% justify-content space-between select min-width 0 flex 1 ; grid 1col, no border left/right ; h3 min-height 0 ; action opacity 1 transform none (always visible, touch) ; overlay flex-end padding 0 ; modal block width 100% max-width none max-height 94dvh radius 16 16 0 0 (bottom sheet) ; image min-height 0 height min(50dvh,440px) max-height none padding 12px ; img max-height 100% ; thumbnails padding 10px ; thumbnail flex-basis 62px 62x62 ; details padding 24px 18px calc(24px + env(safe-area-inset-bottom)) ; h2 31px padding-right 25px ; eyebrow padding-right 36px ; description max-height none ; close -> fixed bottom sheet FAB 44x44 rounded 50% ; cart width 100% height min(92dvh,780px) padding 22px 16px calc(22px+inset-bottom) border-left none border-top 1px #333 radius 16 16 0 0 ; item grid 62px minmax(0,1fr) align-start ; img 62x62 ; qty grid-col 2 justify-end
  380px  brand-lockup span max-width 125px ; strong overflow hidden text-overflow ellipsis ; h1 54px ; modal image height 42dvh ; product-eyebrow span:last-child display none

MOTION & EFFECTS
  html scroll-behavior: smooth (only motion affordance; NO prefers-reduced-motion guard authored)
  button/input/select font inherit ; button border-radius 0
  card image zoom transform .28s scale 1.025
  card action fade+up opacity/transform .2s
  buttons bg/color/border .2s
  header search border .2s
  category rail horizontal scroll-snap-type x proximity hidden scrollbar (only motion feature with any care)
  backdrop blur 8px (overlay) ; 14px (header)
  no entry animations, no caret, no hero avatar float, no glow pulses

STRUCTURE (copy map, top to bottom)
  main.site-shell
    div.announcement-bar   "Small-batch developer goods / Secure checkout / Made on demand"
    header.site-header     [brand-lockup "Sleepy Studio / Developer goods / EST. 2026"] [header-search] [cart-trigger "Cart" pill]
    section.hero           label "Drop 001 / Live catalog" "49 products online" ; h1 "Wear the work." (the "." is yellow) ; aside paragraph ; primary-button "Shop the drop" -> #catalog
    section.trust-strip    Made on demand / Tracked fulfillment / Secure checkout
    section.catalog-section#catalog
      div.catalog-heading   kicker "Store / Live catalog" ; h2 "Current products" ; p "Printed on demand..."
      div.catalog-toolbar   [categories pills] [sort selects]
      div.catalog-results   "49 products" or filtered "n products / category" + clear-filters
      div.commerce-grid     [commerce-card x n]
    footer.site-footer      logo "Sleepy Studio / Developer goods for people who build things." + "Made on demand..."
  overlays (rendered as portals, do not push flow): commerce-overlay[commerce-modal], commerce-overlay[commerce-cart]
  (Storefront.tsx / ProductCard.tsx / ProductModal.tsx also exist with classes product-card, modal-backdrop, product-modal, icon-button — these are NOT referenced by CommerceStorefront and have NO matching CSS; legacy/dead.)
