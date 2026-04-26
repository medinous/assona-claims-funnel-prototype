# Color — Foundation

## Overview

The Assona color system has three tiers. When writing CSS, always use the tier closest to the component's intent (tier 3 or 2), never raw primitives from tier 1.

| Tier | File | Purpose |
|---|---|---|
| 1 — Primitives | `resources/Tailwind config/assona-design-tokens.css` | Raw palette scales (50–950) |
| 2 — Aliases | `styles/tokens.css` | Semantic names (surface, text, border, stroke, status) |
| 3 — Components | `styles/*.css` | Consume tier 2 only |

---

## Palette Summary

| Palette | Hue | Key tokens | Purpose |
|---|---|---|---|
| Primary (Teal) | 186° | `--color-primary-600` `#144F56` | Navigation, teal CTAs, interactive primary |
| Accent (Lime) | 65° | `--color-accent-300` `#EAF68F` | Selected tabs, primary buttons, active states |
| Neutral (Green-gray) | 135° | `--color-neutral-*` | Text, surfaces, borders (70–80% of UI) |
| Error (Coral-red) | 10° | `--color-error-600` `#E64E2E` | Error states, destructive actions |
| Success (Green) | 140° | `--color-success-500` `#22C55E` | Confirmations, paid badges |
| Warning (Orange) | 35° | `--color-warning-500` `#FF9110` | In-review, pending badges |
| Petrol (Cool teal) | 180° | `--color-petrol-300` `#C3DDDD` | Thumbnails, info surfaces |
| Sage (Earthy) | 75° | `--color-sage-50` `#FAFBF7` | Sidebar, form field bg, card surfaces |
| Blush (Warm) | 0° | `--color-blush-200` `#EFE8E8` | Warm accent surfaces |
| Info (Blue) | N/A | `--status-info-bg` `#DBEAFE` | In-process badge only — no full palette |

---

## Semantic Color Tokens (Layer 2)

Use these in all component CSS. Never write a hex or rgba directly.

### Surfaces

```css
--surface-page           /* page / app background */
--surface-card           /* white card, panel, modal */
--surface-elevated       /* dropdowns, popovers */
--surface-sidebar        /* sidebar and left panels */
--surface-field          /* form input background */
--surface-field-hover    /* input hover state */
--surface-accent         /* lime interactive surface */
--surface-accent-hover   /* lime hover */
--surface-petrol         /* petrol-tinted surfaces */
--surface-info           /* info/blue badge background */
--surface-drag           /* drag-over overlay on upload */
```

### Text

```css
--text-primary           /* body copy */
--text-secondary         /* labels, supporting copy */
--text-tertiary          /* captions, disabled-adjacent */
--text-placeholder       /* input placeholders */
--text-disabled          /* disabled element text */
--text-link              /* hyperlinks */
--text-on-accent         /* dark text on lime buttons */
--text-on-primary        /* white text on teal bg */
--text-info              /* info badge text */
--text-muted             /* timestamps, file refs */
--text-cancel            /* destructive action text */

/* On-dark surfaces (proto-nav, fixture bar) */
--text-on-dark
--text-on-dark-muted
--text-on-dark-secondary
--text-on-dark-bright
```

### Borders

```css
--border-default         /* standard dividers */
--border-strong          /* emphasized separators */
--border-focus           /* keyboard-focus ring color */
--border-error           /* error input borders */
--border-success
--border-cancel          /* destructive button border */
```

### Strokes (alpha-based)

Use when a border must sit transparently over a colored surface.

```css
--stroke-ui              /* rgba(5,8,16,0.1)  — standard */
--stroke-ui-medium       /* rgba(5,8,16,0.2)  — button depth cue */
--stroke-ui-subtle       /* rgba(5,8,16,0.08) — section dividers */
--stroke-ui-micro        /* rgba(5,8,16,0.06) — row hairlines */
--stroke-ui-ghost        /* rgba(5,8,16,0.03) — barely-there */
```

### Overlays

```css
--overlay-page           /* sidepanel backdrop (50% dark) */
--overlay-confirm        /* confirm dialog backdrop */
--overlay-modal          /* review/upload modal backdrop */
--overlay-dark           /* proto-nav background */
--overlay-guard          /* auth guard full-screen */
--on-dark-hover          /* hover bg on dark surface */
--on-dark-border         /* border on dark surface */
```

### Status

```css
--status-info-bg / --status-info-text
--status-warning-bg / --status-warning-text
--status-success-bg / --status-success-text
--status-error-bg / --status-error-text
```

### Decorative Gradients

Only for background blob / depth effects. Never for functional color.

```css
--grad-lime              /* rgba(234,246,143,0.65) */
--grad-petrol            /* rgba(144,214,218,0.55) */
--grad-lime-soft         /* 0.35 opacity variant */
--grad-petrol-soft       /* 0.25 opacity variant */
```

---

## Rules

- **DO** use semantic tier-2 tokens for all component CSS
- **DO** add a new token to `tokens.css` if a value doesn't exist yet
- **DON'T** write raw hex or rgba in component CSS
- **DON'T** use accent colors (`--color-accent-300`) for more than ~15% of a page's area
- **DON'T** rely on color alone to convey state — pair with an icon or label
- **DON'T** use tier-1 primitives (`--color-neutral-700`) in component files; use the tier-2 alias (`--text-muted`)

---

## Dark Mode

Dark mode is toggled by `.dark` or `[data-theme="dark"]` on the root element. The `assona-design-tokens.css` automatically inverts all color scales inside this selector. Tier-2 aliases and component classes do not need dark-mode overrides since they reference tier-1 tokens.
