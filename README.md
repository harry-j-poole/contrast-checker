# Colour Contrast Checker

A simple tool for evaluating colour combinations across a design palette against WCAG 2.2 accessibility standards. Inspired by the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

## What it does

Define your three core palette colours — **Primary**, **Secondary**, and **Surface** — and the tool evaluates every meaningful combination between them. This reflects how colours are potentially used in a product: a primary action colour placed on a surface, secondary content against a background, or layered colour pairings throughout a UI.

Each combination is checked against two levels of the WCAG standard:

- **Level AA** — the minimum required for most public-facing products
- **Level AAA** — the enhanced standard for products with stricter accessibility requirements

## What gets checked

For each colour pair, results are shown across three criteria:

| Criterion | Description | Required ratio (AA) | Required ratio (AAA) |
|---|---|---|---|
| Normal Text | Text under 18pt / 14pt bold | 4.5:1 | 7:1 |
| Large Text | Text 18pt+ / 14pt bold+ | 3:1 | 4.5:1 |
| UI Components | Icons, borders, and interactive states | 3:1 | — |

## How to use it

1. Use the colour pickers or type a hex value to set your **Primary**, **Secondary**, and **Surface** colours
2. The tool automatically evaluates the contrast ratio for each colour pairing
3. Read the pass/fail result for each combination across all WCAG criteria

The live preview updates as you adjust colours, so you can see how each pairing looks at both normal and large text sizes in real time.
