# Tabs — Component Spec

## Metadata
- **Category:** Navigation
- **CSS classes:** `.tabs`, `.tab`, `.tab--active`, `.claims-tabs`, `.claims-tab`, `.sp-tab-list`, `.sp-tab`
- **Status:** Stable
- **Files:** `styles/dashboard.css`, `styles/sidepanel.css`

## Overview

### When to use
- To switch between filtered views of the same data (e.g. All / In Review / Paid Out)
- To switch between content panels in the side panel (Details / Files / Timeline)

### When not to use
- For page-level navigation — use the sidebar instead
- For step-by-step flows — use the Stepper

---

## Anatomy

```
[ Tab container (pill background) ]
  [ Tab ] [ Tab (active) ] [ Tab ]
```

---

## Variants

### Standard Tab Group (`.tabs` + `.tab`)
Used on the dashboard and claims page.

```css
/* Container */
.tabs {
  background:    var(--color-surface-tertiary);
  border-radius: var(--radius-sm);            /* 6px */
  padding:       3px;
  gap:           var(--space-1);              /* 4px */
}

/* Inactive tab */
.tab {
  height:        29px;
  border-radius: var(--radius-sm);
  background:    transparent;
  color:         var(--text-secondary);
  font-size:     var(--text-sm);              /* 14px */
}

/* Active tab */
.tab--active {
  background:    var(--surface-accent);       /* lime */
  color:         var(--text-on-accent);
  font-weight:   var(--fw-medium);
}
```

### Side Panel Tabs (`.sp-tab-list` + `.sp-tab`)
Used inside the side panel. Tabs are equal-width (flex: 1).

```css
/* Container */
.sp-tab-list {
  background:    var(--color-sage-50);        /* --surface-sidebar */
  border-radius: var(--radius-sm);
  height:        36px;
  padding:       3px;
}

/* Inactive tab */
.sp-tab {
  flex:          1;
  border-radius: var(--radius-chip);          /* 14px */
  color:         var(--text-primary);
  font-size:     var(--text-sm);
}

/* Active tab */
.sp-tab--active {
  background:    var(--surface-accent);
  border-radius: var(--radius-sm);            /* 6px — tighter than inactive */
  font-weight:   var(--fw-medium);
  box-shadow:    var(--shadow-tab-glow);
}
```

---

## Tokens Used

| Property | Token |
|---|---|
| Container background | `--color-surface-tertiary` or `--surface-sidebar` |
| Container border-radius | `--radius-sm` |
| Active background | `--surface-accent` |
| Active text | `--text-on-accent` |
| Active font-weight | `--fw-medium` |
| Active glow | `--shadow-tab-glow` |
| Inactive text | `--text-secondary` |
| Height (standard) | `29px` (off-scale, matches Figma) |
| Height (sp) | `36px` (off-scale, matches Figma) |

---

## States

| State | Visual |
|---|---|
| **Default** | Transparent background |
| **Hover** | *(none currently — matches Figma)* |
| **Active** | Lime background, medium weight |
| **Focus** | *(inherits browser default)* |

---

## Code Example

```html
<!-- Standard tab group -->
<div class="tabs" role="tablist">
  <button class="tab" role="tab">All Claims</button>
  <button class="tab tab--active" role="tab" aria-selected="true">In Review</button>
  <button class="tab" role="tab">Paid Out</button>
</div>

<!-- Side panel tabs -->
<div class="sp-tab-list" role="tablist">
  <button class="sp-tab sp-tab--active" role="tab">Details</button>
  <button class="sp-tab" role="tab">Files</button>
  <button class="sp-tab" role="tab">Timeline</button>
</div>
```

---

## Cross-references
- [Sidepanel](sidepanel.md) — hosts sp-tab-list
- [Button](button.md) — active tab uses same lime surface as primary button
