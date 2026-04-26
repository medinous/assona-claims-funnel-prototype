# Elevation & Shadows — Foundation

## Scale

| Token | Value | Use case |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Step dot active state |
| `--shadow-sm` | `0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)` | Cards resting, login card |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Hovered dashboard cards |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Proto-nav, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Modals |
| `--shadow-2xl` | `0 25px 50px rgba(0,0,0,0.15)` | Dark-mode modals |
| `--shadow-focus` | `0 0 0 3px rgba(20,79,86,0.2)` | Primary focus ring |

## Semantic Aliases (Layer 2)

```css
--shadow-card           /* var(--shadow-md) — resting card */
--shadow-panel          /* var(--shadow-sm) — main panel */
--shadow-popover        /* var(--shadow-xl) — modal / popover */
--shadow-elevated       /* var(--shadow-lg) — hover lifted card */
--shadow-btn-inset      /* inset 0 -2px 0 rgba(5,8,16,0.2) — lime CTA depth */
--shadow-focus-ring     /* 0 0 0 4px var(--color-accent-100) — input focus */
--shadow-tab-glow       /* 0 3px 18px 0 rgba(228,236,132,0.4) — active tab */
--shadow-guard          /* 0 24px 64px rgba(0,0,0,0.18) — auth guard modal */
--shadow-pdf            /* 0 10px 24px rgba(0,0,0,0.08) — PDF card */
```

## Elevation Layers

| Layer | z-index token | Shadow token | Elements |
|---|---|---|---|
| Base | — | none | Sidebar, tables |
| Card | — | `--shadow-panel` | Main content panel |
| Topbar | `--z-topbar` | none | Sticky topbar |
| Sidepanel overlay | `--z-sidepanel-overlay` | — | Backdrop |
| Sidepanel | `--z-sidepanel` | — | Detail side panel |
| Confirm | `--z-confirm` | `--shadow-popover` | Confirm modals |
| Review overlay | `--z-review-overlay` | `--shadow-popover` | Review modal |
| Proto-nav | `--z-proto-nav` | `--shadow-lg` | Bottom nav bar |
| Dropdown | `--z-dropdown` | `--shadow-lg` | Bauteil dropdown |
| Guard | `--z-guard` | `--shadow-guard` | Auth gate |

## Rules

- All `box-shadow` must reference a `--shadow-*` token
- Never write raw `rgba()` shadow values in component CSS
- The `--shadow-btn-inset` token is the canonical way to add visual depth to lime CTA buttons
- Focus rings use `--shadow-focus-ring`, not a raw `box-shadow`
