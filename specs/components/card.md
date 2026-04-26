# Card — Component Spec

## Metadata
- **Category:** Container
- **CSS classes:** `.dash-kpi`, `.metric`, `.claims-panel`, `.dash-feedback`, `.activity`, `.upload-card`, `.review-card`
- **Status:** Stable
- **Files:** , `styles/upload.css`, `styles/review.css`

## Overview

### When to use
- Grouping related KPI metrics in the dashboard hero
- Displaying the active claim count / payout total
- Wrapping form content (upload card, review card)

### When not to use
- Wrapping navigation items — use sidebar list items
- Wrapping table content — table has its own border/scroll pattern

---

## Anatomy

```
[ .dash-kpi ]
  [ .dash-kpi-kicker ]   (label, 12px muted)
  [ .dash-kpi-value ]    (metric, 18px bold heading)
  [ .dash-kpi-sub ]      (context, 12px muted)
  [ .dash-kpi-icon ]     (optional top-right icon)
  [ .dash-kpi-tag ]      (optional bottom-right trend tag)
  [ .dash-kpi-chart ]    (optional sparkline SVG)
```

---

## Variants

### KPI Card (`.dash-kpi`)
Six-column grid on dashboard. Span 2 or 3 columns.

```css
border-radius: var(--radius-card);     /* 10px */
padding:       var(--space-6);         /* 24px */
min-height:    179px;
transition:    box-shadow var(--duration-normal) var(--ease-default),
               transform  var(--duration-normal) var(--ease-default);

/* Hover */
box-shadow: var(--shadow-elevated);    /* shadow-lg */
transform:  translateY(-1px);
```

| Modifier | Surface |
|---|---|
| `.dash-kpi--lime` | `--color-accent-200` |
| `.dash-kpi--petrol` | `--surface-petrol` |
| `.dash-kpi--sage` | `--color-sage-200` |
| `.dash-kpi--sage-subtle` | `--color-sage-50` |
| `.dash-kpi--neutral` | `--color-neutral-50` |

### Metric Card (`.metric`)
Compact 3-up hero metrics, min-height 120px.

| Modifier | Surface |
|---|---|
| `.metric--blue` | `--surface-petrol` |
| `.metric--red` | `--status-error-bg` |
| `.metric--lime` | `--color-surface-sage` |

### Claims Panel (`.claims-panel`)
White container with border for the dashboard claims work panel.

```css
background:    var(--surface-card);
border-radius: var(--radius-card);    /* 10px */
border:        1px solid var(--border-default);
padding:       var(--space-4);        /* 16px */
```

### Feedback Card (`.dash-feedback`)
Full-width teal CTA card in the right column.

```css
background:    var(--color-primary-600);
border-radius: var(--radius-card);    /* 10px */
color:         var(--text-on-primary);
```

### Upload Card (`.upload-card`)
Centered white card for the upload step.

```css
background:    var(--surface-card);
border-radius: var(--radius-lg);      /* 14px */
box-shadow:    var(--shadow-panel);
```

### Review Card (`.review-card`)
Left-column detail card for the review step.

```css
border-radius: var(--radius-lg);      /* 14px */
border:        1px solid var(--stroke-ui);
box-shadow:    var(--shadow-panel);
```

---

## Tokens Used

| Property | Token |
|---|---|
| border-radius (KPI/panel) | `--radius-card` (10px) |
| border-radius (modal/upload) | `--radius-lg` (14px) |
| padding | `--space-6` (24px) |
| box-shadow (resting) | `--shadow-panel` |
| box-shadow (hover) | `--shadow-elevated` |
| transition | `var(--duration-normal) var(--ease-default)` |
| hover transform | `translateY(-1px)` |

---

## States

| State | Visual |
|---|---|
| **Default** | Flat / shadow-sm |
| **Hover** | shadow-lg, lifted 1px |

---

## Cross-references
- [Badge](badge.md) — trend tags inside KPI cards
- [Button](button.md) — CTA buttons inside feedback card / upload card
