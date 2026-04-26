# Typography — Foundation

## Font Families

| Token | Value | Use |
|---|---|---|
| `--font-heading` | `'Uni Neue', sans-serif` | All h1–h4, display text, KPI values |
| `--font-body` | `'Inter', sans-serif` | All body, labels, inputs, buttons |
| `--font-mono` | `'SF Mono', monospace` | Code, IDs, reference strings |

Fonts are loaded in `styles/base.css` via `@font-face`. Always reference the CSS variable, not the raw font name.

```css
/* ✅ correct */
font-family: var(--font-heading);

/* ❌ wrong */
font-family: 'Uni Neue', sans-serif;
```

---

## Font Sizes

| Token | px | Use case |
|---|---|---|
| `--text-tiny` | 8px | Icon captions, badge micro text |
| `--text-micro` | 10px | Proto-nav / fixture bar uppercase labels |
| `--text-2xs` | 11px | Micro labels, keyboard hints |
| `--text-xs` | 12px | Table cells, captions, badges |
| `--text-crumb` | 13px | Breadcrumb separators, filter toggles |
| `--text-sm` | 14px | Body text, form labels, nav items |
| `--text-md` | 16px | Sub-headings, input values |
| `--text-lg` | 18px | Card titles, panel headings |
| `--text-xl-compact` | 22px | Compact display heading (between lg and xl) |
| `--text-xl` | 24px | Page titles, welcome headings |
| `--text-display-sm` | 26px | Responsive title override (mobile breakpoint) |
| `--text-2xl` | 32px | Display / login headings |
| `--text-3xl` | 40px | Hero / marketing text |

```css
/* ✅ correct */
font-size: var(--text-sm);

/* ❌ wrong */
font-size: 14px;
```

---

## Font Weights

| Token | Value | Use case |
|---|---|---|
| `--fw-light` | 200 | Rarely used; very thin captions |
| `--fw-regular` | 400 | Default body text |
| `--fw-medium` | 500 | Labels, active nav, table headers |
| `--fw-semibold` | 600 | Subheadings, badge text |
| `--fw-bold` | 700 | Card titles, section headings |
| `--fw-extrabold` | 800 | Display headings (login, upload) |

---

## Line Heights

| Token | Value | Use case |
|---|---|---|
| `--lh-tight` | 1.25 | Headings, KPI values |
| `--lh-normal` | 1.5 | Body text default |
| `--lh-relaxed` | 1.75 | Long-form content |

---

## Letter Spacing

| Token | Value | Use case |
|---|---|---|
| `--ls-heading` | -0.108px | 18px headings (`--text-lg`) |
| `--ls-heading-lg` | -0.144px | 24px headings (`--text-xl`) |
| `--ls-heading-display` | -0.19px | 32px display text (`--text-2xl`) |
| `--ls-body` | -0.1px | General body tightening |
| `--ls-label` | 0.8px | Uppercase proto-nav labels |

---

## Type Hierarchy (component usage)

| Level | font | size | weight | token combination |
|---|---|---|---|---|
| Display | heading | 32px | 800 | `--text-2xl` + `--fw-extrabold` |
| Page title | heading | 24px | 700 | `--text-xl` + `--fw-bold` |
| Card title | heading | 18px | 700 | `--text-lg` + `--fw-bold` |
| Section label | body | 12px | 500 | `--text-xs` + `--fw-medium` |
| Body | body | 14px | 400 | `--text-sm` + `--fw-regular` |
| Caption | body | 12px | 400 | `--text-xs` + `--fw-regular` |
| Micro label | body | 11px | 500–600 | `--text-2xs` + `--fw-medium` |

---

## Rules

- All `font-family` must reference `--font-heading` or `--font-body`
- All `font-size` must reference a `--text-*` token
- All `font-weight` must reference a `--fw-*` token
- `--text-2xs` (11px) is the minimum font size used in this project
- Letter spacing is optional; apply only when matching a Figma spec exactly
