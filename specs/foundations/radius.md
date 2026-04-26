# Border Radius — Foundation

## Scale

| Token | px | Use case |
|---|---|---|
| `--radius-none` | 0 | Hard corners (tables, raw containers) |
| `--radius-2xs` | 2px | Scrollbar thumbs, micro elements |
| `--radius-xs` | 4px | Tiny icons, close buttons, kbd chips |
| `--radius-sm` | 6px | Buttons, inputs, tabs, chips |
| `--radius-md` | 8px | Menus, table scroll wrappers |
| `--radius-card` | 10px | KPI cards, activity, claims panels |
| `--radius-lg` | 14px | Badges, pills, sidepanel, modal shell |
| `--radius-dialog` | 16px | Auth guard modal |
| `--radius-xl` | 20px | Popovers, success modal |
| `--radius-2xl` | 24px | Large overlays |
| `--radius-full` | 9999px | Pill tags, progress dots |
| `--radius-circle` | 50px | Avatar circles |

## Semantic Aliases (Layer 2)

```css
--radius-btn       /* 6px — all buttons */
--radius-input     /* 6px — all form inputs */
--radius-chip      /* 14px — badges and pills */
--radius-card      /* 10px — dashboard card surfaces */
--radius-dialog    /* 16px — auth guard modal */
--radius-tag       /* 9999px — pill tags */
--radius-thumb     /* 4px — icon thumbnails */
```

## Rules

- All `border-radius` values must reference a `--radius-*` token
- Never write `border-radius: 999px` — use `var(--radius-full)`
- Never write `border-radius: 50%` for circles — use `var(--radius-circle)` or `50%` only for square elements
- The `--radius-card` (10px) is intentionally between `--radius-md` (8px) and `--radius-lg` (14px) to match Figma KPI card specs

## Quick Reference

```css
/* Buttons */
border-radius: var(--radius-btn);         /* 6px */

/* Inputs, dropdowns */
border-radius: var(--radius-input);       /* 6px */

/* Badges, pills */
border-radius: var(--radius-chip);        /* 14px */

/* KPI cards, dashboard panels */
border-radius: var(--radius-card);        /* 10px */

/* Main modal / sidepanel shell */
border-radius: var(--radius-lg);          /* 14px */

/* Proto-nav pill */
border-radius: var(--radius-full);        /* 9999px */
```
