# Stepper — Component Spec

## Metadata
- **Category:** Progress Indicator
- **CSS classes:** `.stepper-wrap`, `.stepper`, `.step-item`, `.step-dot`, `.step-line`, `.step-label`
- **Status:** Stable
- **Files:** `styles/base.css`

## Overview

### When to use
- To show progress through the 4-step claims funnel (Upload → Damage → Validate → Review)

### When not to use
- For sequential navigation in the dashboard — use tabs or a sidebar section

---

## Anatomy

```
[ .stepper-wrap ]
  [ .stepper ]
    [ .step-item ] × 4
      [ .step-inline ]
        [ .step-line (hidden for first item) ]
        [ .step-dot ]
        [ .step-line (hidden for last item) ]
      [ .step-label ]
```

---

## Key Properties

```css
/* Wrap */
.stepper-wrap {
  height:   80px;
  padding:  var(--space-4);     /* 16px */
}

/* Dot */
.step-dot {
  width:         28px;
  height:        28px;
  border-radius: var(--radius-full);   /* 9999px */
  font-size:     var(--text-xs);       /* 12px */
  font-weight:   var(--fw-semibold);
}

/* States */
.step-dot              { background: var(--color-neutral-100); color: var(--text-placeholder); }
.step-dot.active       { background: var(--surface-accent); color: var(--text-on-accent); box-shadow: var(--shadow-xs); }
.step-dot.done         { background: var(--surface-accent); color: var(--text-on-accent); }

/* Connector line */
.step-line             { background: var(--color-neutral-200); }
.step-line.done        { background: var(--surface-accent); }
.step-line.hidden      { background: transparent; }

/* Label */
.step-label            { font-size: var(--text-sm); color: var(--text-placeholder); }
.step-label.active     { color: var(--text-primary); font-weight: var(--fw-medium); }
.step-label.done       { color: var(--color-neutral-700); }
```

---

## Tokens Used

| Property | Token |
|---|---|
| Dot border-radius | `--radius-full` |
| Dot (inactive) bg | `--color-neutral-100` |
| Dot (active/done) bg | `--surface-accent` |
| Dot (active/done) color | `--text-on-accent` |
| Dot active shadow | `--shadow-xs` |
| Connector (inactive) | `--color-neutral-200` |
| Connector (done) | `--surface-accent` |
| Label size | `--text-sm` |
| Label active weight | `--fw-medium` |

---

## States

| State | Class | Dot | Line | Label |
|---|---|---|---|---|
| **Not started** | *(none)* | gray bg | gray | muted |
| **Active** | `.active` | lime bg | — | primary, medium |
| **Completed** | `.done` | lime bg | lime line | neutral-700 |

---

## Code Example

```html
<div class="stepper-wrap">
  <div class="stepper">
    <div class="step-item">
      <div class="step-inline">
        <div class="step-line hidden"></div>
        <div class="step-dot done">
          <i data-lucide="check" class="ti"></i>
        </div>
        <div class="step-line done"></div>
      </div>
      <span class="step-label done">Upload</span>
    </div>

    <div class="step-item">
      <div class="step-inline">
        <div class="step-line done"></div>
        <div class="step-dot active">2</div>
        <div class="step-line"></div>
      </div>
      <span class="step-label active">Damage</span>
    </div>

    <div class="step-item">
      <div class="step-inline">
        <div class="step-line"></div>
        <div class="step-dot">3</div>
        <div class="step-line"></div>
      </div>
      <span class="step-label">Validate</span>
    </div>

    <div class="step-item">
      <div class="step-inline">
        <div class="step-line"></div>
        <div class="step-dot">4</div>
        <div class="step-line hidden"></div>
      </div>
      <span class="step-label">Review</span>
    </div>
  </div>
</div>
```

---

## Cross-references
- [Button](button.md) — step navigation uses continue/back buttons
- [Modal](modal.md) — navigating back from certain steps triggers a confirm modal
