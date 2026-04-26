# Side Panel — Component Spec

## Metadata
- **Category:** Overlay / Detail View
- **CSS prefix:** `.sp-*`
- **Status:** Stable
- **Files:** `styles/sidepanel.css`

## Overview

### When to use
- To show claim detail without navigating away from the claims list
- Triggered by clicking a table row

### When not to use
- For primary navigation — use the sidebar
- For confirmation dialogs — use `.confirm-modal`

---

## Anatomy

```
[ .sp-overlay (backdrop) ]
[ .sp (panel container) ]
  [ .sp-header ]
    [ .sp-header-left ]
      [ .sp-title ] + [ .sp-badge ]
      [ .sp-subtitle ]
    [ .sp-header-actions ]
      [ .sp-icon-btn ] × N
  [ .sp-tabs-bar ]
    [ .sp-tab-list ]
      [ .sp-tab ] × 3
  [ .sp-notifs ]
    [ .sp-card-row ] × N
  [ .sp-main ]
    [ .sp-panel (Details | Files | Timeline) ]
  [ .sp-footer ]
    [ .sp-btn-primary ]
    [ .sp-btn-cancel ]
```

---

## Open / Close

Toggle `.is-open` on both `.sp-overlay` and `.sp#claims-sidepanel`.

```js
overlay.classList.toggle('is-open');
panel.classList.toggle('is-open');
```

- **Open:** panel slides from right (transform: translateX(0))
- **Close:** panel slides out (transform: translateX(calc(100% + 24px)))
- **Transition:** `transform var(--duration-normal) var(--ease-decelerate)` (0.3s)

---

## Tokens Used

| Property | Token |
|---|---|
| Overlay background | `--overlay-page` |
| Panel background | `--surface-card` |
| Panel border | `var(--stroke-ui)` |
| Panel border-radius | `--radius-md` (8px, via `--radius-md`) |
| Header border | `var(--stroke-ui)` |
| Tab list background | `--surface-sidebar` |
| Active tab background | `--surface-accent` |
| Active tab shadow | `--shadow-tab-glow` |
| Primary button bg | `--surface-accent` |
| Card row background | `--surface-sidebar` |
| Thumbnail bg | `--color-petrol-300` |
| Status dot | `--color-error-600` |
| Z-index (overlay) | `--z-sidepanel-overlay` (40) |
| Z-index (panel) | `--z-sidepanel` (50) |
| Slide transition | `var(--duration-normal) var(--ease-decelerate)` |
| Overlay fade | `opacity var(--duration-fast) var(--ease-default)` |

---

## Badge Variants (Status)

| Class | State |
|---|---|
| `.sp-badge--pending` | Pending review |
| `.sp-badge--process` | In process |
| `.sp-badge--draft` | Draft |
| `.sp-badge--paid` | Paid out |
| `.sp-badge--denied` | Denied |

---

## States

| State | Visual |
|---|---|
| **Closed** | Panel off-screen (transform), overlay invisible (opacity 0) |
| **Open** | Panel at translateX(0), overlay at opacity 1 |
| **Tab: Details** | `.sp-panel#sp-details.is-active` visible |
| **Tab: Files** | `.sp-panel#sp-files.is-active` visible |
| **Tab: Timeline** | `.sp-panel#sp-timeline.is-active` visible |

---

## Code Example

```html
<!-- Backdrop -->
<div class="sp-overlay" id="sp-overlay"></div>

<!-- Panel -->
<aside class="sp" id="claims-sidepanel" role="dialog" aria-modal="true">
  <div class="sp-header">
    <div class="sp-header-left">
      <div class="sp-heading-row">
        <h2 class="sp-title">CLM-2024-001</h2>
        <span class="sp-badge sp-badge--pending">Pending</span>
      </div>
      <p class="sp-subtitle">Submitted 12 Jan 2025</p>
    </div>
    <div class="sp-header-actions">
      <button class="sp-icon-btn" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
    </div>
  </div>

  <div class="sp-tabs-bar">
    <div class="sp-tab-list" role="tablist">
      <button class="sp-tab sp-tab--active" role="tab">Details</button>
      <button class="sp-tab" role="tab">Files</button>
      <button class="sp-tab" role="tab">Timeline</button>
    </div>
  </div>

  <div class="sp-main">
    <div class="sp-panel is-active" id="sp-details">…</div>
    <div class="sp-panel" id="sp-files">…</div>
    <div class="sp-panel" id="sp-timeline">…</div>
  </div>

  <div class="sp-footer">
    <button class="sp-btn-primary sp-btn--full">Approve Claim</button>
    <button class="sp-btn-cancel">Cancel Claim</button>
  </div>
</aside>
```

---

## Cross-references
- [Tabs](tabs.md) — sp-tab-list uses the tab component pattern
- [Button](button.md) — sp-btn-primary / sp-btn-cancel
- [Table](table.md) — row click triggers panel open
