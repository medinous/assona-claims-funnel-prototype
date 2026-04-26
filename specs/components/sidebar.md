# Sidebar — Component Spec

## Metadata
- **Category:** Navigation
- **CSS prefix:** `.sb-*`
- **Status:** Stable
- **Files:** `styles/dashboard.css`

## Overview

### When to use
- Primary navigation for the backoffice/dashboard view
- Collapsible at mobile breakpoint (<1023px), toggled by `.sidebar-toggle`

### When not to use
- In the claims funnel (index.html) — funnel uses `.nav-header` + stepper instead

---

## Anatomy

```
[ .sb (sidebar column) ]
  [ .sb-header ]
    [ .sb-brand ] (logo + name + subtitle)
  [ .sb-actions ]
    [ .sb-search ] (search input mock)
  [ .sb-content ]
    [ .sb-group ] × N
      [ .sb-group-label ]
      [ .sb-item ] × N (nav links)
  [ .sb-footer ]
    [ .sb-user ] (avatar + name + email)
```

---

## Key Properties

```css
/* Sidebar column */
.sb {
  background: var(--surface-sidebar);   /* sage-50 */
  width:      256px;
  position:   sticky;
  top:        var(--space-3);           /* 12px */
  height:     calc(100vh - var(--space-6)); /* 24px */
}

/* Nav item */
.sb-item {
  height:        36px;
  border-radius: var(--radius-sm);      /* 6px */
  font-size:     var(--text-sm);        /* 14px */
  color:         var(--text-secondary);
}
.sb-item:hover {
  background: var(--color-interactive-hover);
}
.sb-item--active {
  background: var(--surface-accent);    /* lime */
  color:      var(--text-primary);
}
```

---

## Tokens Used

| Property | Token |
|---|---|
| Sidebar background | `--surface-sidebar` |
| Item border-radius | `--radius-sm` (6px) |
| Item font-size | `--text-sm` (14px) |
| Item color (inactive) | `--text-secondary` |
| Item hover bg | `--color-interactive-hover` |
| Item active bg | `--surface-accent` |
| Brand title font | `--font-heading` |
| Brand title size | `--text-sm` |
| Group label size | `--text-xs` |
| User name size | `--text-xs` |

---

## Collapse Behavior

`.figma-app.is-sidebar-collapsed` sets:
```css
grid-template-columns: 0 minmax(0, 1fr);
```
And `.sb { display: none }`. Toggle via `sidebar-toggle` button.

---

## States

| State | Class | Visual |
|---|---|---|
| **Expanded** | default | 256px wide |
| **Collapsed** | `.is-sidebar-collapsed` | Hidden (0px) |
| **Item active** | `.sb-item--active` | Lime background |
| **Item hover** | `:hover` | `--color-interactive-hover` |

---

## Code Example

```html
<aside class="sb">
  <div class="sb-header">
    <div class="sb-brand">
      <div class="sb-brand-avatar"><img src="..." alt="Assona logo"></div>
      <div>
        <div class="sb-brand-title">Assona</div>
        <div class="sb-brand-sub">Insurance Management</div>
      </div>
    </div>
  </div>

  <nav class="sb-content">
    <div class="sb-group">
      <div class="sb-group-label">Claims</div>
      <a class="sb-item sb-item--active" href="/claims">
        <span class="sb-item-icon"><i data-lucide="file-text"></i></span>
        <span class="sb-item-text">All Claims</span>
        <span class="sb-item-count">48</span>
      </a>
    </div>
  </nav>
</aside>
```

---

## Cross-references
- [Tabs](tabs.md) — topbar can show tabs at certain breakpoints
- [Card](card.md) — main content area sits adjacent to sidebar
