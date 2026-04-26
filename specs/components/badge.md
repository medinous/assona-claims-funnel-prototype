# Badge & Pill — Component Spec

## Metadata
- **Category:** Status Indicator
- **CSS classes:** `.ds-badge`, `.ds-pill`, `.sp-badge`, `.badge`
- **Status:** Stable
- **Files:** , `styles/claims.css`, `styles/sidepanel.css`

## Overview

### When to use
- To show the status of a claim (`Pending`, `In Process`, `Paid Out`, `Denied`)
- To display a categorical label (bike type, contract type)
- As a count indicator on a sidebar item

### When not to use
- As an action button (use Button instead)
- For decorative color blocks

---

## Anatomy

```
[ label ]
```

No icon by default. Badges are non-interactive.

---

## Variants

### `.ds-badge` (Design System table badge)
Inline status badge in table cells.

```css
display: inline-flex;
align-items: center;
justify-content: center;
padding: 2px 8px;
border-radius: var(--radius-chip);   /* 14px */
font-size: var(--text-xs);           /* 12px */
font-weight: var(--fw-medium);
```

| Modifier | Background | Text | Status |
|---|---|---|---|
| `.ds-badge--warn` | `--color-accent-200` (lime) | `--text-primary` | Pending review |
| `.ds-badge--muted` | `--color-surface-sage` | `--text-primary` | Neutral / draft |
| `.ds-badge--good` | `--status-success-bg` | `--text-primary` | Approved / ok |
| `.ds-badge--danger` | `--status-error-bg` | `--status-error-text` | Denied |
| `.ds-badge--paid` | `--status-success-bg` | `--status-success-text` | Paid out |
| `.ds-badge--info` | `--status-info-bg` | `--text-info` | In process |

### `.sp-badge` (Side Panel header badge)
Slightly larger badge shown next to the panel title.

| Modifier | Background | Text |
|---|---|---|
| `.sp-badge--pending` | `--color-warning-200` | `--text-primary` |
| `.sp-badge--process` | `--status-info-bg` | `--text-info` |
| `.sp-badge--draft` | `--color-neutral-200` | `--text-secondary` |
| `.sp-badge--paid` | `--status-success-bg` | `--status-success-text` |
| `.sp-badge--denied` | `--status-error-bg` | `--status-error-text` |

### `.badge` (Dashboard compact badge)
Height 20px, used inside `.claims-table` rows.

Same status color logic as `.ds-badge`. Modifier classes: `--warn`, `--muted`, `--good`, `--review`.

### `.ds-pill` / `.pill`
A petrol-tinted pill for contract/category labels.

```css
background: var(--surface-petrol);
color:      var(--text-primary);
border-radius: var(--radius-chip);  /* 14px */
```

---

## Tokens Used

| Property | Token |
|---|---|
| border-radius | `--radius-chip` (14px) |
| font-size | `--text-xs` (12px) |
| font-weight | `--fw-medium` |
| padding | `2px 8px` (intentional off-scale) |
| Info bg | `--status-info-bg` |
| Info text | `--text-info` |
| Warning bg | `--status-warning-bg` |
| Success bg | `--status-success-bg` |
| Error bg | `--status-error-bg` |

---

## States

Badges are display-only (no interactive states). Status is always data-driven via a class modifier.

---

## Code Example

```html
<!-- Table row status badge -->
<span class="ds-badge ds-badge--warn">Pending</span>
<span class="ds-badge ds-badge--info">In Process</span>
<span class="ds-badge ds-badge--paid">Paid Out</span>
<span class="ds-badge ds-badge--danger">Denied</span>

<!-- Side panel header badge -->
<span class="sp-badge sp-badge--pending">Pending</span>

<!-- Category pill -->
<span class="ds-pill">Liability</span>
```

---

## Cross-references
- [Table](table.md) — badges appear in table cells
- [Sidepanel](sidepanel.md) — `sp-badge` in panel header
