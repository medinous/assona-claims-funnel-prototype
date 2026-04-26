# Token Reference — Master Map

Every CSS custom property available in this project, its resolved value, and when to use it.

Read this file before writing any UI code. If the token you need doesn't exist, add it to `styles/tokens.css` (Layer 2) and document it here.

---

## Layer 1 — Primitives (`assona-design-tokens.css`)

Do not use these directly in component CSS. They are the raw values behind Layer 2 aliases.

### Colors

```
--color-primary-{50–950}     Teal scale. Base: #144F56 (600)
--color-accent-{50–950}      Lime scale. Base: #E4EC84 (400), #EAF68F (300)
--color-neutral-{0–1000}     Green-gray scale. White: #FFF (0). Black: #0D0F0D (1000)
--color-error-{50–950}       Coral-red. Base: #EE735D (500), #E64E2E (600)
--color-success-{50–950}     Green. Base: #22C55E (500)
--color-warning-{50–950}     Orange. Base: #FF9110 (500)
--color-petrol-{50–950}      Cool teal-gray. Base: #C3DDDD (300)
--color-blush-{50–950}       Warm rose-gray. Base: #EFE8E8 (200)
--color-sage-{50–950}        Earthy lime-gray. Base: #D1DCBA (300), #FAFBF7 (50)
```

### Semantic primitives (still Layer 1)

```
--color-base-foreground      = neutral-1000 (light) / neutral-0 (dark)
--color-base-background      = neutral-50 (light) / neutral-900 (dark)
--color-base-stroke          = rgba(13,15,13,0.1) (light) / rgba(255,255,255,0.15) (dark)

--color-text-primary         = neutral-1000
--color-text-secondary       = neutral-800
--color-text-tertiary        = neutral-600
--color-text-placeholder     = neutral-500
--color-text-disabled        = neutral-400
--color-text-on-accent       = neutral-1000
--color-text-on-primary      = neutral-0
--color-text-link            = primary-600
--color-text-link-hover      = primary-700

--color-interactive-primary  = primary-600
--color-interactive-primary-hover   = primary-700
--color-interactive-primary-pressed = primary-800
--color-interactive-accent   = accent-600
--color-interactive-accent-hover    = accent-700
--color-interactive-hover    = neutral-100
--color-interactive-pressed  = neutral-200
--color-interactive-focus    = primary-600
--color-interactive-disabled = neutral-300

--color-surface-primary      = neutral-0   (#FFF)
--color-surface-secondary    = neutral-50  (#FAFBFA)
--color-surface-tertiary     = neutral-100
--color-surface-elevated     = neutral-0
--color-surface-overlay      = rgba(13,15,13,0.5)
--color-surface-petrol       = petrol-100
--color-surface-petrol-subtle = petrol-50
--color-surface-blush        = blush-200
--color-surface-sage         = sage-100
--color-surface-sage-subtle  = sage-50

--color-border-primary       = neutral-200 (#E8EBE8)
--color-border-secondary     = neutral-300
--color-border-focus         = primary-600
--color-border-error         = error-600
--color-border-success       = success-600
--color-border-warning       = warning-600
```

### Spacing

```
--space-0                    0px
--space-1                    4px
--space-2                    8px
--space-3                    12px
--space-4                    16px
--space-6                    24px
--space-8                    32px
--space-9                    36px
--space-10                   40px
--space-12                   48px
--space-14                   56px
--space-16                   64px
--space-20                   80px
--space-24                   96px
--space-28                   112px
--space-32                   128px
--space-40                   160px
--space-48                   192px
--space-56                   224px
--space-64                   256px
--space-80                   320px
--space-96                   384px
```

### Radius

```
--radius-none                0px
--radius-2xs                 2px
--radius-xs                  4px
--radius-sm                  6px
--radius-md                  8px
--radius-lg                  14px
--radius-xl                  20px
--radius-2xl                 24px
--radius-circle              50px
--radius-full                9999px

--radius-interactive         = radius-sm (6px)
--radius-input               = radius-sm (6px)
--radius-surface             = radius-lg (14px)
--radius-overlay             = radius-xl (20px)
--radius-badge               = radius-circle (50px)
```

### Typography

```
--font-family-heading        'Uni-Neue', sans-serif
--font-family-body           'Inter', sans-serif
--font-family-mono           'SF Mono', monospace

--font-weight-light          200
--font-weight-regular        400
--font-weight-medium         500
--font-weight-semibold       600
--font-weight-bold           700

--font-size-xs               12px
--font-size-sm               14px
--font-size-md               16px
--font-size-lg               18px
--font-size-xl               24px
--font-size-2xl              32px
--font-size-3xl              40px

Note: tokens below 12px and above 24px (excluding 2xl/3xl) live in Layer 2 as they have
no Layer 1 primitive — see tokens.css for --text-tiny, --text-micro, --text-crumb, etc.

--line-height-tight          1.25
--line-height-normal         1.5
--line-height-relaxed        1.75
```

### Shadows

```
--shadow-xs                  0 1px 2px rgba(0,0,0,0.05)
--shadow-sm                  0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)
--shadow-md                  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
--shadow-lg                  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
--shadow-xl                  0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
--shadow-2xl                 0 25px 50px rgba(0,0,0,0.15)

--shadow-card                = shadow-md
--shadow-dropdown            = shadow-lg
--shadow-modal               = shadow-xl
--shadow-focus               0 0 0 3px rgba(20,79,86,0.2)
```

---

## Layer 2 — Aliases (`styles/tokens.css`)

Use these in all component CSS. See `styles/tokens.css` for the full list. Key entries:

### Surfaces
```
--surface-page               app/page background
--surface-card               white card bg
--surface-elevated           modals, dropdowns
--surface-sidebar            sidebar, left panels
--surface-field              form input bg
--surface-accent             lime interactive (#EAF68F)
--surface-info               info badge bg (#DBEAFE)
--surface-drag               drag-over overlay
```

### Text
```
--text-primary / --text-secondary / --text-tertiary / --text-placeholder
--text-on-accent             dark text on lime
--text-on-primary            white text on teal
--text-info                  info badge text (#1E40AF)
--text-muted                 timestamps, refs
--text-cancel                destructive text (#DC2626)
--text-on-dark / --text-on-dark-muted / --text-on-dark-secondary
```

### Strokes
```
--stroke-ui                  rgba(5,8,16,0.1)  standard borders
--stroke-ui-medium           rgba(5,8,16,0.2)  button depth
--stroke-ui-subtle           rgba(5,8,16,0.08) section dividers
--stroke-ui-micro            rgba(5,8,16,0.06) row hairlines
```

### Overlays
```
--overlay-page               sidepanel backdrop
--overlay-confirm            confirm modal bg
--overlay-modal              review modal bg
--overlay-dark               proto-nav bg
--overlay-guard              auth guard bg
```

### Status
```
--status-info-bg / --status-info-text
--status-warning-bg / --status-warning-text
--status-success-bg / --status-success-text
--status-error-bg  / --status-error-text
```

### Radius additions
```
--radius-2xs                 2px   (scrollbar thumbs, micro elements)
--radius-card                10px  (dashboard KPI cards)
--radius-dialog              16px  (auth guard modal)
--radius-btn                 6px   (all buttons)
--radius-chip                14px  (badges, pills)
```

### Shadows
```
--shadow-btn-inset           inset 0 -2px 0 rgba(5,8,16,0.2)
--shadow-focus-ring          0 0 0 4px var(--color-accent-100)
--shadow-tab-glow            0 3px 18px 0 rgba(228,236,132,0.4)
--shadow-guard               0 24px 64px rgba(0,0,0,0.18)
```

### Motion
```
--duration-instant / --duration-fast / --duration-normal / --duration-slow
--ease-default / --ease-spring / --ease-decelerate / --ease-bounce
--transition-color / --transition-all-fast / --transition-slide / --transition-fade
```

### Z-index
```
--z-ground                   0     (explicit ground reset)
--z-base                     1     (local stacking — decorative layers)
--z-raised                   2     (slightly elevated within local stack)
--z-topbar                   20
--z-sidepanel-overlay        40
--z-sidepanel                50
--z-review-overlay           100
--z-confirm                  120
--z-proto-nav                999
--z-dropdown                 9999
--z-tooltip / --z-guard      99999
```

---

## Legacy Bridge (`styles/tokens-bridge.css`)

These are backward-compat aliases used in older component CSS. Prefer Layer 2 canonical names in new code.

```
--p{50–700}   → --color-primary-*
--a{200–700}  → --color-accent-*
--n{0–1000}   → --color-neutral-*
--e{50–700}   → --color-error-*
--w{50–700}   → --color-warning-*
--s{50–700}   → --color-success-*
--petrol{100,200} → --color-petrol-*
--pastelY{50,100,200} → --color-sage-*
--ff-heading / --ff-body  → --font-family-*
--r-xs through --r-xl     → --radius-*
--shadow-overlay          → --shadow-modal
```
