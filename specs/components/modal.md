# Modal — Component Spec

## Metadata
- **Category:** Overlay
- **CSS classes:** `.confirm-modal`, `.review-modal-popover`, `.review-modal-success`, `.pdf-error-dialog`
- **Status:** Stable
- **Files:** `styles/base.css`, `styles/review.css`, `styles/upload.css`

## Overview

### When to use
- To confirm a destructive or irreversible action (confirm-modal)
- To collect final submission info before submitting a claim (review-modal)
- To celebrate a successful submission (success-modal)
- To report a PDF processing error (pdf-error-dialog)

### When not to use
- For inline content that doesn't require focus lock — use a panel or card
- For navigation — use the sidebar

---

## Anatomy

### Confirm Modal

```
[ .confirm-overlay (backdrop) ]
  [ .confirm-modal ]
    [ .confirm-modal-header ]
      [ .confirm-modal-title ]
    [ .confirm-modal-body ]
    [ .confirm-modal-footer ]
      [ .confirm-btn-secondary ] [ .confirm-btn-primary ]
```

### Review Modal

```
[ .review-overlay (backdrop) ]
  [ .review-modal-popover ]
    [ .review-modal-header ]
      [ .review-modal-title ] [ .review-modal-close-btn ]
    [ .review-modal-body ]
      [ media upload section ]
      [ textarea field ]
      [ checkbox row ]
    [ .review-modal-footer ]
      [ .btn-not-yet ] [ .btn-submit-final ]
```

### Success Modal

```
[ .review-overlay ]
  [ .review-modal-success ]
    [ .review-success-body ]
      [ icon wrap ]
      [ title ]
      [ subtitle ]
      [ id chip ]
      [ .review-success-actions ]
        [ .btn-success-primary ] [ .btn-success-secondary ]
```

---

## Key Properties

```css
/* Backdrop */
.confirm-overlay, .review-overlay {
  position:        fixed;
  inset:           0;
  background:      var(--overlay-modal);  /* rgba(63,63,70,0.2) */
  display:         flex;
  align-items:     center;
  justify-content: center;
}

/* Confirm dialog */
.confirm-modal {
  width:         400px;
  background:    var(--surface-card);
  border-radius: var(--radius-lg);       /* 14px */
  box-shadow:    var(--shadow-popover);
}

/* Review popover */
.review-modal-popover {
  width:         512px;
  background:    var(--surface-card);
  border-radius: var(--radius-xl);       /* 20px */
  box-shadow:    var(--shadow-popover);
  border:        1px solid var(--stroke-ui);
  animation:     reviewPopIn var(--duration-normal) var(--ease-bounce);
}

/* Success modal */
.review-modal-success {
  width:         480px;
  background:    var(--surface-card);
  border-radius: var(--radius-xl);
  box-shadow:    0 20px 60px rgba(20, 79, 86, 0.16);
  animation:     reviewPopIn 0.3s var(--ease-bounce);
}
```

---

## Tokens Used

| Property | Token |
|---|---|
| Backdrop | `--overlay-modal` |
| Modal background | `--surface-card` |
| Border | `var(--stroke-ui)` |
| Border-radius (confirm) | `--radius-lg` (14px) |
| Border-radius (review) | `--radius-xl` (20px) |
| Box-shadow | `--shadow-popover` |
| Title font | `--font-heading` |
| Title size | `--text-lg` (18px) |
| Title weight | `--fw-bold` |
| Body font-size | `--text-sm` (14px) |
| Close btn border-radius | `--radius-xs` (4px) or `--radius-sm` |
| Dividers | `var(--stroke-ui)` |
| Z-index | `--z-confirm` (120) or `--z-review-overlay` (100) |
| Animation | `var(--ease-bounce)` |

---

## States

| State | Trigger |
|---|---|
| **Hidden** | `.confirm-overlay` without `.visible` |
| **Visible** | `.confirm-overlay.visible` → `display: flex` |
| **Submit active** | `.btn-submit-final.active` — checkbox checked |

---

## Code Example

```html
<!-- Confirm modal -->
<div class="confirm-overlay" id="confirm-overlay">
  <div class="confirm-modal" role="dialog" aria-modal="true">
    <div class="confirm-modal-header">
      <h2 class="confirm-modal-title">Go back to upload?</h2>
    </div>
    <div class="confirm-modal-body">
      Your current progress will be lost.
    </div>
    <div class="confirm-modal-footer">
      <button class="confirm-btn-secondary">Cancel</button>
      <button class="confirm-btn-primary">Yes, go back</button>
    </div>
  </div>
</div>
```

---

## Cross-references
- [Button](button.md) — primary/secondary buttons in modal footer
- [Form Field](form-field.md) — review modal contains textarea and checkbox
