# Button — Component Spec

## Metadata
- **Category:** Action
- **CSS prefix:** various (no unified prefix; see variants)
- **Status:** Stable
- **Files:** `styles/base.css`, , `styles/login.css`, `styles/damage.css`, `styles/review.css`, `styles/upload.css`, `styles/validation.css`

## Overview

### When to use
- To trigger the primary action on a page or step (lime/accent variant)
- To trigger a secondary or destructive action
- To navigate between funnel steps

### When not to use
- For navigation links — use an anchor tag styled as a link
- For pure icon actions — use `.sp-icon-btn` or `.ds-menu-btn`

---

## Anatomy

```
[ icon? ] [ label ] [ icon? ]
```

All buttons share:
- `height` fixed (36–44px depending on size)
- `border-radius: var(--radius-btn)` (6px)
- `font-family: var(--font-body)`
- `font-size: var(--text-sm)` (14px)
- `font-weight: var(--fw-medium)` (500)
- `cursor: pointer`

---

## Variants

### Primary (Lime CTA)
The main action button. Lime accent background with inset depth shadow.

```css
/* Used by: .btn-primary, .btn-cta-primary, .dash-btn--primary,
            .btn-continue, .btn-submit-main, .sp-btn-primary,
            .btn-success-primary, .btn-upload, .btn-continue-lg */
background:    var(--surface-accent);        /* --color-accent-300, #EAF68F */
color:         var(--text-on-accent);
border:        none;
border-bottom: 2px solid var(--stroke-ui-medium); /* --shadow-btn-inset */
box-shadow:    var(--shadow-btn-inset);

/* Hover */
background: var(--surface-accent-hover);     /* --color-accent-400 */
transform: translateY(-1px);
```

### Primary (Teal)
Teal variant for admin/import actions on the claims page.

```css
/* .dash-btn--teal */
background: var(--color-primary-600);
color:      var(--text-on-primary);
border-bottom-color: var(--stroke-ui-medium);
```

### Secondary (Outline)
Secondary actions, back buttons.

```css
/* .dash-btn--secondary, .btn-back, .pager-btn, .confirm-btn-secondary */
background:   var(--surface-card);
border:       1px solid var(--border-default);
color:        var(--text-secondary);
```

### Ghost
No background until hover. Used for soft contextual actions.

```css
/* .btn-not-yet, .btn-logout */
background: transparent;
border:     none;
color:      var(--text-primary);

/* Hover */
background: var(--color-interactive-hover);
```

### Destructive (Cancel)
Outline in error red. Used for cancelling a claim.

```css
/* .sp-btn-cancel */
border:     1px solid var(--border-cancel);    /* #FECACA */
background: transparent;
color:      var(--text-cancel);                /* #DC2626 */

/* Hover */
background: var(--status-error-bg);
```

### Upload (Accent Large)
Same as Primary but height 44px, font-size md.

```css
/* .btn-upload */
height:    44px;
font-size: var(--text-md);
```

### Icon-only
Square buttons for table row menus, close, etc.

```css
/* .ds-menu-btn, .sp-icon-btn */
width:         28–32px;
height:        28–32px;
border-radius: var(--radius-thumb);  /* or --radius-sm */
background:    transparent;
border:        none;
```

---

## Tokens Used

| Property | Token |
|---|---|
| background (default) | `--surface-card` |
| background (lime CTA) | `--surface-accent` |
| background (lime hover) | `--surface-accent-hover` |
| background (teal) | `--color-primary-600` |
| color (on lime) | `--text-on-accent` |
| color (on teal) | `--text-on-primary` |
| color (secondary) | `--text-secondary` |
| border | `--border-default` |
| border-bottom (depth) | `2px solid var(--stroke-ui-medium)` |
| box-shadow (depth) | `--shadow-btn-inset` |
| border-radius | `--radius-btn` |
| font-family | `--font-body` |
| font-size | `--text-sm` |
| font-weight | `--fw-medium` |
| transition | `--transition-all-fast` |

---

## States

| State | Visual change |
|---|---|
| **Default** | Base styles |
| **Hover** | Background shifts one step; lime CTAs lift `translateY(-1px)` |
| **Active/Pressed** | `transform: none`, depth shadow removed |
| **Disabled** | `background: var(--color-neutral-200)`, `color: var(--text-placeholder)`, `cursor: not-allowed`, `pointer-events: none` |
| **Focus-visible** | *(inherits browser default; add `--shadow-focus-ring` in next pass)* |

---

## Code Example

```html
<!-- Primary lime CTA -->
<button class="btn-continue on">
  Continue <i data-lucide="arrow-right"></i>
</button>

<!-- Secondary / back -->
<button class="btn-back">
  <i data-lucide="arrow-left"></i> Back
</button>

<!-- Destructive -->
<button class="sp-btn-cancel">Cancel Claim</button>
```

---

## Cross-references
- [Badge](badge.md) — badge variant uses similar lime fill
- [Tabs](tabs.md) — active tab uses same lime surface
- [Form Field](form-field.md) — some submit buttons live inside form cards
