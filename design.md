---
parent: https://github.com/harry-j-poole/Design-system/blob/main/design.md
name: Colour Contrast Checker
description: A single-page WCAG 2.2 accessibility tool. All the styling is taken from the parent Design.md file accessible via the parent link above. The styles documented here are to exprerss the extended styles available for use on a local project level only. This essentially accts as a child file of the main Harry Poole portfolio design system.
extends:
  colors:
    badge-pass-bg: "#e6f0e7"
    badge-pass-text: "#2d5e35"
    badge-pass-border: "#b8d4bb"
    badge-partial-bg: "#fff7ed"
    badge-partial-text: "#c2410c"
    badge-partial-border: "#fed7aa"
    badge-fail-bg: "#fef2f2"
    badge-fail-text: "#991b1b"
    badge-fail-border: "#fecaca"
    scale-fail: "#fca5a5"
    scale-warn: "#fcd34d"
    scale-aa: "#6ee7b7"
    scale-aaa: "#3f8348"
  typography:
    ratio-value:
      fontFamily: Space Grotesk
      fontSize: 48px
      fontWeight: 700
      lineHeight: 1
      letterSpacing: -0.03em
      fontVariantNumeric: tabular-nums
  components:
    color-input-wrap:
      backgroundColor: "{colors.surface-subtle}"
      border: "{borders.subtle}"
      padding: "10px 12px"
      focusBorderColor: "{colors.accent}"
    hex-input:
      fontFamily: Space Grotesk
      fontSize: 16px
      fontWeight: 700
      color: "{colors.on-surface}"
      textTransform: uppercase
      fontVariantNumeric: tabular-nums
      background: transparent
      border: none
    lightness-slider:
      height: 8px
      rounded: "{rounded.none}"
      thumbSize: 18px
      thumbBackground: "#ffffff"
      thumbBorder: "2px solid rgba(0,0,0,0.2)"
    badge-pass:
      backgroundColor: "{colors.badge-pass-bg}"
      textColor: "{colors.badge-pass-text}"
      border: "1px solid {colors.badge-pass-border}"
      padding: "4px 10px"
      fontWeight: 700
    badge-partial:
      backgroundColor: "{colors.badge-partial-bg}"
      textColor: "{colors.badge-partial-text}"
      border: "1px solid {colors.badge-partial-border}"
      padding: "4px 10px"
      fontWeight: 700
    badge-fail:
      backgroundColor: "{colors.badge-fail-bg}"
      textColor: "{colors.badge-fail-text}"
      border: "1px solid {colors.badge-fail-border}"
      padding: "4px 10px"
      fontWeight: 700
    level-card:
      backgroundColor: "{colors.surface-subtle}"
      border: "{borders.subtle}"
      padding: "14px 20px"
      textAlign: center
    scale-bar:
      height: 10px
      background: "{colors.surface-subtle}"
      rounded: "{rounded.none}"
    scale-dot:
      size: 16px
      background: "{colors.on-surface}"
      border: "2px solid #ffffff"
      transition: "left 0.2s ease"
    ratio-pill:
      backgroundColor: "{colors.surface-subtle}"
      color: "{colors.on-surface}"
      padding: "4px 8px"
      fontFamily: Space Grotesk
      fontSize: 12px
      fontWeight: 700
      fontVariantNumeric: tabular-nums
---

# Colour Contrast Checker — Design

> **Parent design system:** [Harry Poole — Portfolio Design System](https://github.com/harry-j-poole/Design-system/blob/main/design.md)
>
> This file is a child of the portfolio design system. All base tokens — colours, typography, spacing, borders, border-radius — are inherited without modification and defined only in the parent. This document records only the extensions specific to this tool: additional functional colour tokens, one additional type scale, and tool-specific component definitions.

---

## Overview

A single-page WCAG 2.2 accessibility tool that evaluates up to three user-defined palette colours (Primary, Secondary, Surface) against contrast ratio requirements. The tool is built entirely within the portfolio design system aesthetic: Space Grotesk, near-monochrome palette, 0px border radius, no shadows, flat surfaces. It extends the base system only where functional necessity demands it — specifically for semantic pass/partial/fail badge states and the contrast scale bar colour zones.

The interface is divided into three cards: (1) colour input and live ratio output, (2) live text and UI preview, and (3) a detailed WCAG 2.2 compliance table. On desktop, cards 1 and 2 sit in a two-column grid; card 3 spans the full width beneath them. On mobile, all cards stack to a single column.

---

## Extended colours — functional states only

The base system palette has no semantic state colours (the portfolio has no form validation, error states, or status indicators). This tool introduces three badge colour sets — pass, partial, and fail — used exclusively within the WCAG result badges and nowhere else. These are functional, not decorative.

### Pass state
- **Badge background (`#e6f0e7`):** Very light desaturated green — clearly positive without competing with the accent green used for interactions.
- **Badge text (`#2d5e35`):** Darker shade of the accent green family. Passes AA on its own badge background.
- **Badge border (`#b8d4bb`):** Mid-tone green separator.

### Partial state
- **Badge background (`#fff7ed`):** Very light amber.
- **Badge text (`#c2410c`):** Deep amber-orange — clearly caution, not error.
- **Badge border (`#fed7aa`):** Light amber outline.

### Fail state
- **Badge background (`#fef2f2`):** Very light red.
- **Badge text (`#991b1b`):** Deep red.
- **Badge border (`#fecaca`):** Light red outline.

These colours exist only within badge components. They must not be used as background colours for cards, sections, or text outside of the badge system.

---

## Extended colours — contrast scale bar zones

The scale bar visualises the 1:1–21:1 contrast ratio range across four colour-coded zones. These zone colours exist solely to communicate accessible contrast thresholds at a glance.

| Zone | Colour | Range | Meaning |
|------|--------|-------|---------|
| Fail | `#fca5a5` (red) | 1:1 – 3:1 | Fails all criteria |
| Warn | `#fcd34d` (amber) | 3:1 – 4.5:1 | Passes large text AA only |
| AA | `#6ee7b7` (mint green) | 4.5:1 – 7:1 | Passes AA for normal text |
| AAA | `#3f8348` (accent green) | 7:1 – 21:1 | Passes AAA |

The AAA zone reuses the portfolio accent green intentionally — it is the only interaction-adjacent green in the base system and carries a positive connotation that maps cleanly onto the highest accessibility standard.

Zone widths are proportional across the bar (0–100% = 1:1 to 21:1 = 20 units):
- Fail: `0–10%`
- Warn: `10–17.5%`
- AA: `17.5–30%`
- AAA: `30–100%`

---

## Extended typography — ratio value

The `ratio-value` type scale is added for displaying live contrast ratios. It uses Space Grotesk Bold at 48px with tight letter-spacing (`-0.03em`) and tabular numerals — chosen to display large numerical values clearly without the monospaced jitter of proportional numerals. This scale steps down responsively: `40px` at ≤ 1024px, `36px` at ≤ 768px, `30px` at ≤ 480px.

---

## Layout

The page uses a centred max-width container (`1100px`) with `1.5rem` horizontal padding, inherited from the base system. The main content area is a CSS grid with two equal columns (`1fr 1fr`) and a `1.25rem` gap. The third card (compliance table) always spans both columns.

Responsive breakpoints:
- **≥ 1024px:** Two-column grid; colour inputs display as a horizontal row.
- **768–1023px:** Two-column grid retained, but card widths are narrow — colour inputs stack vertically within each card.
- **≤ 767px:** Grid collapses to a single column. Colour inputs restore to a horizontal row.
- **≤ 639px:** Colour inputs stack again on narrow single-column cards.
- **≤ 479px:** Reduced padding, smaller ratio value scale, smaller header text.

---

## Components

### Page header

The page title uses `{typography.h1}` in `{colors.on-surface}`. The subtitle uses `{typography.body-md}`. The attribution link ("Harry Poole") uses `{colors.accent}` with underline at rest — an exception to the base system's rule that links underline only on hover, justified here because it is inline prose, not a UI affordance. Hover darkens to `#2d5e35`.

### Card

All tool cards use the base system's `card` component tokens: `{colors.surface}` background, `{borders.strong}` outline, `{rounded.none}`, no shadow. Internal padding lives in `card-body` children at `24px`.

### Colour input field

Each colour input field contains:
- A `{typography.label}` all-caps label.
- A `color-input-wrap` container: `{colors.surface-subtle}` background, `{borders.subtle}` outline. On `focus-within`, the border shifts to `{colors.accent}`.
- A native `<input type="color">` colour picker — no border radius, transparent background.
- A `hex-input`: Space Grotesk Bold, 16px, uppercased, tabular numerals, no border, transparent background.
- A lightness range slider with a `black → mid-grey → white` gradient track. Thumb is `18px` square (`{rounded.none}`), white with a translucent dark border. Thumb scales up on hover (`scale(1.15)`) — content-level interaction feedback, consistent with the base system's approach.

### Contrast ratio display

The live ratio uses `ratio-value` tokens (see extended typography above). The label above it uses `{typography.label}` all-caps. Below the ratio, two `level-card` components display the AA and AAA badge results side-by-side.

### WCAG level cards

Each WCAG level card uses `level-card` tokens: `{colors.surface-subtle}` background, `{borders.subtle}` outline, centred content. The level title uses `{typography.label}` all-caps. The result badge sits below it.

### Badges (pass / partial / fail)

All three badge variants share the same shape: `{rounded.none}`, `4px 10px` padding, `{typography.label}` at weight 700. They carry a symbolic prefix (✓, ~, ✗) and a text label ("Pass", "Partial", "Fail"). The only difference between variants is their colour set (see extended colours above).

### Contrast scale bar

A horizontal bar (`10px` tall, `{rounded.none}`, `{colors.surface-subtle}` base) with four absolutely-positioned colour zones. A square dot (`16px`, `{colors.on-surface}`, `2px white border`) animates to the position corresponding to the current ratio using `left 0.2s ease`. Scale labels below use `{typography.label}` at 10px.

### Live preview — text section

A card section whose `background-color` and `color` are driven by CSS custom properties (`--preview-bg`, `--preview-fg`) set dynamically by JavaScript. Contains two paragraphs: one at large text scale and one at normal body scale, showing the chosen colour pair in real conditions.

### Live preview — UI section

Below the text preview, separated by `{borders.subtle}`, this section renders example interactive components (input field, checkbox, button, label) styled using the same dynamic CSS custom properties. The preview button uses `--preview-bg` as its fill and `--preview-fg` as its text colour.

### WCAG 2.2 compliance table

A full-width card spanning both grid columns. The table header uses `{typography.h2}` for the title and `{typography.body-md}` for the subtitle. Column headers use `{typography.label}` all-caps on `{colors.surface-subtle}` background. Row cells use `ratio-pill` tokens to display the required ratio and the relevant badge for each result. The table footer uses `{colors.surface-subtle}` background and `{typography.label}`.

---

## Do's and Don'ts

- **Do** use `{colors.accent}` as the focus ring colour for all interactive inputs — consistent with the base system.
- **Do** keep badge semantic colours strictly within badge components. Do not use them as section backgrounds, headline colours, or decorative elements.
- **Do** use `{borders.strong}` on card containers and `{borders.subtle}` on all inner elements — consistent with the base system's two-tier border rule.
- **Do** keep all corners at `0px` without exception. Slider thumbs, checkboxes, swatches, and containers are all square.
- **Don't** introduce shadows. Cards sit flat on the surface at all states.
- **Don't** use scale bar zone colours outside of the scale bar itself — they are visualisation colours, not palette colours.
- **Don't** introduce a second typeface. Space Grotesk with tabular numerals handles all numeric display.
- **Don't** reduce padding to fit more content — edit the content instead.
