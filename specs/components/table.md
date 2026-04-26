# Table — Component Spec

## Metadata
- **Category:** Data Display
- **CSS prefix:** `.ds-table`, `.ds-tr`, `.ds-td`, `.ds-th`; `.val-table`, `.claims-table`
- **Status:** Stable
- **Files:** `styles/dashboard.css`, `styles/claims.css`, `styles/validation.css`

## Overview

### When to use
- Displaying lists of claims with multiple sortable columns
- Displaying contracts or invoice line items

### When not to use
- Simple key-value data — use a definition list or data card instead
- Charts or metric grids — use the KPI card pattern

---

## Anatomy

```
[ Table scroll wrapper ]
  [ Table header row ] → [ th ] [ th ] [ th ] ...
  [ Table body ]
    [ tr ] → [ td ] [ td (badge) ] [ td (menu btn) ]
    [ tr ]
    ...
```

---

## Variants

### `.ds-table` (Dashboard/Claims grid-based table)
Uses CSS Grid instead of HTML `<table>`. Columns defined per variant.

```css
/* Scroll wrapper */
.ds-table-scroll {
  border-radius: var(--radius-md);          /* 8px */
  scrollbar-color: var(--border-default) transparent;
}

/* Header row */
.ds-table-head-row {
  background:    var(--color-neutral-50);
  border-bottom: 1px solid var(--border-default);
}

/* Header cell */
.ds-th {
  font-size:   var(--text-xs);             /* 12px */
  font-weight: var(--fw-medium);
  color:       var(--text-primary);
  padding:     6px 12px;
}

/* Body row */
.ds-tr {
  border-bottom: 1px solid var(--border-default);
  transition:    background var(--duration-fast) var(--ease-default);
}
.ds-tr:hover { background: var(--color-interactive-hover); }

/* Body cell */
.ds-td {
  font-size: var(--text-xs);
  color:     var(--text-primary);
  padding:   10px 8px;
}
```

**Column variants:**
- `.ds-table--claims-compact` — 7 columns, no description column, used on dashboard
- `.ds-table--claims-full` — 8 columns, all fields visible, used on claims page
- `.ds-table--contracts-real` — auto-width columns for contracts

### `.val-table` (Validation step — HTML table)
Used in Step 3 for editable invoice line items.

```css
.val-thead-row { background: var(--surface-sidebar); }
.val-th        { font-size: var(--text-xs); color: var(--text-secondary); }
.val-tr        { border-bottom: 1px solid var(--stroke-ui-micro); }
.val-tr--warn  { background: var(--color-warning-50); }
.val-td        { font-size: var(--text-sm); color: var(--text-primary); }
```

---

## Tokens Used

| Property | Token |
|---|---|
| Header background | `--color-neutral-50` or `--surface-sidebar` |
| Row dividers | `--border-default` or `--stroke-ui-micro` |
| Row hover | `--color-interactive-hover` |
| Header font-size | `--text-xs` (12px) |
| Body font-size | `--text-xs` or `--text-sm` |
| Scroll border-radius | `--radius-md` (8px) |
| Row transition | `var(--duration-fast) var(--ease-default)` |

---

## States

| State | Visual |
|---|---|
| **Default** | Transparent row background |
| **Hover** | `--color-interactive-hover` (#F4F6F4) |
| **Selected / open** | Row triggers side panel open (claims page) |
| **Warn row** | `--color-warning-50` background (validation table) |

---

## Code Example

```html
<!-- Grid-based ds-table -->
<div class="ds-table-scroll">
  <div class="ds-table ds-table--claims-compact">
    <div class="ds-table-head-row">
      <div class="ds-th">Claim ID</div>
      <div class="ds-th">Status</div>
    </div>
    <div class="ds-table-body">
      <div class="ds-tr">
        <div class="ds-td ds-td--claim">CLM-001</div>
        <div class="ds-td">
          <span class="ds-badge ds-badge--warn">Pending</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Cross-references
- [Badge](badge.md) — status badges appear in table cells
- [Sidepanel](sidepanel.md) — clicking a row opens the side panel
- [Form Field](form-field.md) — editable cells in `val-table` are form field components
