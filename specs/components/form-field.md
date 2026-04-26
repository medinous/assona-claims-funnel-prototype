# Form Field — Component Spec

## Metadata
- **Category:** Input
- **CSS classes:** `.field-input`, `.field-input-sm`, `.val-dropdown-trigger`, `.val-qty-wrap`, `.val-amount-wrap`, `.field-textarea`
- **Status:** Stable
- **Files:** `styles/login.css`, `styles/validation.css`

## Overview

### When to use
- Any user-editable value in the funnel: text, email, date, number, dropdown
- In the validation step for editable invoice amounts and quantities

### When not to use
- Read-only data display — use a data row (`.sp-data-row`) instead

---

## Anatomy

```
[ .field-group ]
  [ .field-label ]
  [ .field-wrap ]
    [ .field-input ]
    [ icon button (optional, e.g. eye toggle) ]
  [ .err-msg (hidden by default) ]
```

---

## Variants

### Text Input (`.field-input`)
Standard login/funnel text input.

```css
height:        36px;
background:    var(--surface-field);      /* sage-50 */
border:        1px solid transparent;
border-radius: var(--radius-input);       /* 6px */
font-size:     var(--text-sm);            /* 14px */
color:         var(--text-primary);
padding:       var(--space-2) 40px var(--space-2) 12px;

/* Hover */
background:    var(--surface-field);
border-color:  var(--stroke-ui);

/* Focus */
border:        2px solid var(--color-accent-400);
box-shadow:    var(--shadow-focus-ring);
background:    var(--surface-card);

/* Error */
border-color:  var(--border-error);
background:    var(--status-error-bg);
```

### Small Input (`.field-input-sm`)
Used in validation table panel for date, dealer, etc.

```css
height:        32px;
background:    var(--surface-field);
font-size:     var(--text-xs);            /* 12px */
```

### Dropdown Trigger (`.val-dropdown-trigger`)
Used in Cause and Component columns of the validation table.

```css
height:        32px;
background:    var(--surface-field);
border:        1px solid transparent;
border-radius: var(--radius-input);

/* Open state */
border:        2px solid var(--color-accent-400);
box-shadow:    var(--shadow-focus-ring);
background:    var(--surface-card);

/* Warning state (needs validation) */
background:    var(--color-warning-100);
border-color:  rgba(230, 119, 0, 0.3);
```

### Quantity Spinner (`.val-qty-wrap`)
Stepper for item quantity.

```css
height:        32px;
background:    var(--surface-field);
border-radius: var(--radius-input);

/* Focus-within */
border:        2px solid var(--color-accent-400);
box-shadow:    var(--shadow-focus-ring);
```

### Amount Input (`.val-amount-wrap`)
Net / gross amount with currency suffix.

Same focus ring pattern as Quantity Spinner.

### Textarea (`.field-textarea`)
Multi-line description field.

```css
min-height:    80px;
background:    var(--surface-field);
border-radius: var(--radius-input);
resize:        none;
```

---

## Tokens Used

| Property | Token |
|---|---|
| Background (default) | `--surface-field` |
| Background (hover) | `--surface-field` |
| Background (focus) | `--surface-card` |
| Background (error) | `--status-error-bg` |
| Border (default) | `transparent` |
| Border (hover) | `var(--stroke-ui)` |
| Border (focus) | `2px solid var(--color-accent-400)` |
| Border (error) | `var(--border-error)` |
| Focus ring | `--shadow-focus-ring` |
| Border-radius | `--radius-input` (6px) |
| Font-size | `--text-sm` (full) or `--text-xs` (compact) |
| Color | `--text-primary` |
| Placeholder color | `--text-placeholder` |

---

## States

| State | Background | Border | Shadow |
|---|---|---|---|
| **Default** | `--surface-field` | transparent | none |
| **Hover** | `--surface-field` | `--stroke-ui` | none |
| **Focus** | `--surface-card` | 2px accent-400 | `--shadow-focus-ring` |
| **Error** | `--status-error-bg` | `--border-error` | none |
| **Disabled** | `--surface-field-hover` | none | none |

---

## Code Example

```html
<!-- Standard login field -->
<div class="field-group">
  <label class="field-label">Email</label>
  <div class="field-wrap">
    <input class="field-input" type="email" placeholder="you@company.com">
  </div>
  <span class="err-msg">Please enter a valid email address.</span>
</div>
```

---

## Cross-references
- [Button](button.md) — submit buttons are placed after form groups
- [Modal](modal.md) — form fields appear inside the review modal
