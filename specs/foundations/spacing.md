# Spacing — Foundation

## Scale

The spacing scale is 4px-based. Use `--space-*` tokens from `assona-design-tokens.css`.

| Token | rem | px | Typical use |
|---|---|---|---|
| `--space-1` | 0.25rem | 4px | Tight gaps, micro padding |
| `--space-2` | 0.5rem | 8px | Standard gap between elements |
| `--space-3` | 0.75rem | 12px | Section gaps, list item padding |
| `--space-4` | 1rem | 16px | Card padding (compact), grid gaps |
| `--space-5` | 1.25rem | 20px | Medium padding, responsive gutters |
| `--space-6` | 1.5rem | 24px | Primary card padding, section margin |
| `--space-7` | 1.75rem | 28px | Large gap, stepper width-related |
| `--space-8` | 2rem | 32px | Page section padding |
| `--space-10` | 2.5rem | 40px | Full-width vertical padding |
| `--space-12` | 3rem | 48px | Section top/bottom margins |
| `--space-14` | 3.5rem | 56px | Tall panel heights |
| `--space-16` | 4rem | 64px | Upload card top padding |
| `--space-20` | 5rem | 80px | Stepper max-width related |

### Semantic aliases (component-level)

```css
--spacing-component-xs   /* 8px  — tight intra-component gap */
--spacing-component-sm   /* 12px — standard intra-component gap */
--spacing-component-md   /* 16px — default component padding */
--spacing-component-lg   /* 24px — relaxed component padding */
--spacing-component-xl   /* 32px — wide component padding */

--spacing-layout-xs      /* 16px — tight layout gap */
--spacing-layout-sm      /* 24px — standard layout column gap */
--spacing-layout-md      /* 32px — layout section gap */
--spacing-layout-lg      /* 48px — large layout gap */
--spacing-layout-xl      /* 64px — page max-width-related spacing */
--spacing-layout-2xl     /* 96px — hero/display spacing */
```

---

## Rules

- Standard values (4, 8, 12, 16, 20, 24, 32, 40px) **must** use tokens
- Off-scale values (6, 10, 29px) produce an audit WARNING — document the reason as a comment
- Never use `em` for spacing; always `rem` or the token
- The audit script treats standard px values as **ERRORS** and off-scale as **WARNINGS**

---

## Common patterns

```css
/* Card padding */
padding: var(--space-6);           /* 24px all sides */
padding: var(--space-4) var(--space-6); /* 16px top/bottom, 24px left/right */

/* Gap between items */
gap: var(--space-2);               /* 8px — list items */
gap: var(--space-6);               /* 24px — section columns */

/* Sidebar item padding */
padding: var(--space-2);           /* 8px */

/* Nav header height: 40px (off-scale) */
height: 40px; /* intentional off-scale — Figma spec */
```
