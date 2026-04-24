# Colour Contrast Checker — Design Rationale

> **Parent rationale:** [Harry Poole — Portfolio Design System Rationale](https://github.com/harry-j-poole/Design-system/blob/main/rationale.md)
>
> This document is a child of the portfolio design system rationale. It does not re-argue decisions already recorded in the parent — typeface choice, near-monochrome palette, flat surfaces, square geometry, and two-tier borders are inherited and their justification lives upstream. This document captures only the reasoning behind decisions specific to this tool.

This document records what was decided, why, and what constraints each decision places on the interface. Token values and component rules live in the local [design.md](design.md) which is also a child of the system design file. This document exists to prevent those rules from being eroded when decisions are revisited without context.

---

## Decision log

### 1. Three-colour input model — Primary / Secondary / Surface

**What was decided:** The tool accepts three named colours — Primary, Secondary, and Surface — rather than the more conventional two-colour foreground/background pair. Every meaningful combination between the three is evaluated automatically.

**Why:** A two-colour checker answers a limited question: does this text colour pass on this background? In real product work, colour decisions are made at the palette level — a designer picks three or four colours and needs to understand how they all relate before assigning roles. A three-colour model reflects how that decision is actually made. It also catches combinations that are easy to overlook: the Primary colour placed on the Surface, the Secondary on the Primary, and so on. The naming (Primary / Secondary / Surface) is intentionally role-agnostic — it describes palette position, not hierarchy or meaning, so the checker works for any product's colour system.

**Constraint:** The tool evaluates a fixed set of pairings derived from the three inputs. It does not allow arbitrary pair selection or a fourth colour input. Expanding inputs beyond three would increase pairing complexity non-linearly without proportional benefit for the tool's intended use case.

---

### 2. Scale bar as the primary ratio visualisation

**What was decided:** The contrast ratio is shown both numerically (the large `ratio-value` display) and visually via a segmented colour-coded scale bar with an animated dot positioned at the current ratio.

**Why:** A ratio like `5.23:1` requires interpretation — a user must know that 4.5:1 is the AA threshold for normal text before the number carries meaning. The scale bar makes the threshold boundaries spatial and immediate: the user can see at a glance not just whether they pass, but how far into the passing zone they are, and how much margin they have before failing. The colour coding (red → amber → mint → dark green) reinforces the fail/warn/pass/AAA gradient without requiring the user to read anything. The animated dot transition (`left 0.2s ease`) communicates that the value is live and reactive, not static.

**Constraint:** The scale bar zone widths are proportional to the ratio range (1–21), not logarithmic. This means the AAA zone (7–21) appears much wider than the fail zone (1–3), which accurately reflects the ratio arithmetic but means small differences at the low end of the scale are hard to distinguish visually. This is acceptable: the critical threshold region (3–7) is wide enough to read clearly, and precision at the extreme ends is handled by the numeric display.

---

### 3. Semantic badge colours as the only palette extension

**What was decided:** Three sets of semantic colours (pass, partial, fail) were added beyond the base design system palette. Every other colour used in the tool is inherited from the parent system without modification.

**Why:** The portfolio design system has no concept of state colour — everything is either on-surface (`#1A1A1A`) or accent (`#3f8348`). A WCAG checker fundamentally requires a failure state that reads as clearly negative, a warning state, and a clearly positive state. These cannot be expressed through the base palette without ambiguity: using the accent green for "pass" would blur its interactive meaning; using on-surface for "fail" would make it invisible as a status signal. The extension is minimal — six colours across three states, each used only within the badge component — and does not disturb the base system's restraint in any other context.

**Constraint:** The semantic colours are badge-scoped. They must not migrate to card backgrounds, body text, section headers, or any context outside the badge component. The failure state red, in particular, must not appear as a background colour on a card or section — it would break the base system's rule that backgrounds are `surface` or `surface-subtle` only.

---

### 4. Two-column grid — calculator left, preview right

**What was decided:** The colour input / ratio output card and the live preview card sit side-by-side in a two-column grid on desktop. The compliance table spans full width below them.

**Why:** The core workflow is: set colours → see result. Placing the input and output in the left column and the live visual consequence in the right column makes this cause-and-effect relationship spatially legible. The user's eye travels left-to-right from control to result. The full-width compliance table below is secondary content — reference material consulted after an initial colour is set, not the primary interaction surface. Placing it below reinforces its supporting role. A single-column layout would require scrolling to see any preview while editing colours, breaking the live feedback loop that is the tool's primary value.

**Constraint:** Below 768px, the two-column layout is abandoned entirely. Stacking cards in a single column on mobile is preferable to compressing them — the ratio values and input controls must remain readable, and the minimum usable card width for the input card is roughly 300px. No attempt is made to preserve the two-column layout below 768px.

---

### 5. Live preview split into text and UI sections

**What was decided:** The preview card contains two distinct sections: an upper section showing the chosen colours applied as text-on-background at large and normal text sizes, and a lower section showing the same colours applied to example UI components (input field, checkbox, button) on a neutral white background.

**Why:** WCAG distinguishes between text contrast (criteria 1.4.3 and 1.4.6) and non-text / UI component contrast (criterion 1.4.11). A designer needs to see both in context, not just pass/fail numbers. The text preview demonstrates whether the colour combination is readable for prose — the most common use case. The UI preview demonstrates whether the Primary colour is distinctive enough when used as a border, button fill, or interactive affordance against a white surface — a different visual question that the text preview cannot answer. Together, they give a richer sense of real-world legibility than numbers alone.

**Constraint:** The preview sections are intentionally simplified. They show archetypal patterns (headline, body, input, checkbox, button) rather than pixel-perfect representations of any specific component. Adding more component types would increase complexity without meaningfully improving the tool's ability to inform a colour decision.

---

### 6. Lightness slider per colour input

**What was decided:** Each colour input field includes a range slider that adjusts the lightness of the current colour while preserving its hue and saturation.

**Why:** Colour pickers (both native `<input type="color">` and most web-based alternatives) make lightness adjustment awkward — the user must navigate a 2D hue/saturation picker before reaching the lightness axis. The dedicated slider offers a single-axis control for the most common adjustment a designer makes when trying to hit a contrast threshold: "this colour is almost passing — how much lighter or darker does it need to be?" The slider answers that question directly, without requiring the user to open a full colour picker UI.

**Constraint:** The slider adjusts lightness only within the HSL model. It does not adjust hue or saturation. The track gradient (black → mid-grey → white) represents the full lightness range, but the mid-point of the gradient is a neutral grey rather than the current colour at 50% saturation. This is a simplification: representing the actual colour at each lightness step would require a dynamically rendered gradient, which adds significant complexity for marginal visual benefit.

---

### 7. Partial pass badge state

**What was decided:** A third badge state — "Partial" — is shown when a colour pair passes the large text AA threshold (3:1) but fails the normal text AA threshold (4.5:1).

**Why:** A binary pass/fail result is misleading for this combination. A ratio of 3.8:1 is not a failure for all text — it is genuinely passing for text at 18pt or above, and only failing for smaller text. Collapsing this into a single "Fail" badge would cause a designer to reject a colour combination that is usable for headlines. The "Partial" state carries an amber visual weight (caution rather than failure) and communicates that the combination is context-dependent — acceptable in some uses, not in others. This is the most honest representation of the WCAG criteria.

**Constraint:** "Partial" is only used when large text passes and normal text does not. It is not used for the UI component criterion (1.4.11), which has a single threshold (3:1) and therefore only has pass or fail states.

---

## What this means in practice

These decisions collectively produce a tool with a small number of firm constraints:

- Three colours in, fixed set of pairings evaluated automatically — no arbitrary pair selection.
- Scale bar zone colours are visualisation-only — they do not extend into the UI palette.
- Badge semantic colours are badge-scoped — they do not appear as backgrounds, section fills, or body text colours.
- Two-column layout on desktop, single-column on mobile — no hybrid states between 640px and 768px.
- Lightness slider adjusts HSL lightness only — hue and saturation require the native colour picker.
- Partial pass is a distinct state — a 3.8:1 ratio is not the same as a 2.1:1 ratio.

[design.md](design.md) contains the token values and component rules that implement these decisions. Changes to extended tokens or component structure should be traced back to a decision recorded here.

---

## Open questions & validation backlog

| Question | Priority | Method |
|----------|----------|--------|
| Does the three-colour model cover enough real-world use cases, or do designers regularly need a fourth input (e.g., a state/error colour)? | Medium | Usage observation — note any patterns in how the tool is used in practice |
| Does the "Partial" badge state communicate its meaning immediately without supporting copy? | Medium | Hallway testing with 3–5 designers unfamiliar with WCAG thresholds |
| Is the lightness slider useful as a discovery tool (finding the minimum lightness to pass), or does it cause confusion by diverging from the hex input? | Medium | Usage observation — if users consistently ignore the slider, consider removing it |
| Does the scale bar add meaningful information beyond the numeric ratio display, or does it duplicate it? | Low | Qualitative feedback — check whether users reference the scale bar or the number when evaluating a result |
| Should the compliance table be collapsed or hidden by default and revealed on demand? | Low | Analytics or observation — if most users do not scroll to the table, consider a toggle |
