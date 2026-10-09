# DESIGN.md: maxlareau.com

Full brand spec: Max's vault, `brain/3 Resources/personal-brand-system.md`.
This file wins over generic UI rules.

## Product
Personal site. Three pages: Home, About, Experience.
Home is the QR landing page for the business card (`/c` → `/?hi`). Main job: connect online.
Visitor: met Max minutes ago, holds a phone, one thumb.

## Color (dark default, see `assets/css/main.css` `:root`)
- Night `#161513` background
- Chalk `#f0ede6` text, mark (15.6:1)
- Soft `#cdc9c1` secondary text
- Muted `#9e9a92` labels (6.5:1)
- Rule `#464440` row lines
- Orange `#ff4f00` accent: link underline (rises to a fill on hover/focus/tap), focus ring. Never a fill behind white text.
- Ink `#141414` text on orange (5.6:1)

## Type
Barlow only (OFL, subset woff2 in `static/fonts/`).
SemiBold: name, headings. Medium: body, values.
Barlow Condensed SemiBold, uppercase, 0.1em tracking: labels, nav. Uppercase labels are brand grammar (data plates).
Text is upright. Only the mark slants (15°).

## Shape
Square corners everywhere. Plates: 2px Chalk box, label head, 1px Rule between rows.
Home uses a plain line of links (`.links`), not a plate: name, one line, three links.
No textures, rivets, gradients, shadows.

## Space
4px base: 4, 8, 12, 16, 24, 32, 48. Wrap 760px. Text measure 560px.
Touch targets 44px min. Link rows 56px.

## Mark
`assets/img/mark-{m,ml,max}.svg`, fill = currentColor. Built from the Air America font.
Rebuild from the vault: `personal-brand-system-assets/build-marks.py`. Do not edit paths by hand.

## Background
ASCII field on a canvas behind everything (`assets/js/site.js`), Chalk at 14% max, plus an Orange glow blended with `overlay` at the bottom.
Modes: topo (default, first visit) → cumulus → radar → snow → scope → off. The footer button (ASCII icon of the current mode, animated in step with the field: radar arm follows the sweep, cumulus drifts right, topo rolls, snow twinkles, scope wave scrolls) cycles them; long-press jumps to off; the choice is kept in `localStorage`.
"Off" is the pause control for motion (WCAG 2.2.2). Reduced motion: one still frame. No JS: no field, no button.
Plates and the nameplate are solid Night. Footer text is Soft (7.6:1 worst case over the field).
