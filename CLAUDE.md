# Assona Claims Funnel — AI Instructions

## Project overview

Vanilla HTML + CSS + JS prototype for an insurance claims management platform (bike insurance). No build step. No framework. No npm.

**Pages:** `index.html` (funnel), `dashboard.html`, `claims.html`

**Stack:** Vanilla ES modules, Lucide icons (CDN), Tabler icons (CDN)

---

## Before writing or modifying any UI code

1. **Read the relevant spec file in `specs/`.**
   - Foundations: `specs/foundations/` — color, spacing, typography, radius, elevation, motion
   - Token map: `specs/tokens/token-reference.md`
   - Components: `specs/components/` — one file per major component

2. **Use only tokens from `styles/tokens.css`** (Layer 2 aliases) or `resources/Tailwind config/assona-design-tokens.css` (Layer 1 primitives via the Layer 2 aliases).

3. **Run the token audit script before committing:**
   ```bash
   node scripts/token-audit.js
   ```
   **Zero errors required.** Warnings are acceptable but should be documented.

---

## Token architecture

```
Layer 1 (Primitives)   resources/Tailwind config/assona-design-tokens.css
      ↓
Layer 2 (Aliases)      styles/tokens.css        ← WRITE CSS AGAINST THIS LAYER
      ↓
Layer 3 (Components)   styles/*.css             ← Use var(--alias) only
```

### Rules

- **Never** write a raw hex color (`#EAF68F`, `#ffffff`) in a component CSS file
- **Never** write a raw rgba value in a component CSS file
- **Never** write a raw z-index number — use `var(--z-*)` tokens
- **Never** write a raw `border-radius` px value — use `var(--radius-*)`
- **Always** use `var(--font-heading)` or `var(--font-body)`, never raw font names
- **Always** use `var(--text-*)` for font-size, `var(--fw-*)` for font-weight
- Standard spacing values (4, 8, 12, 16, 20, 24, 32, 40px) must use `var(--space-*)`
- If a token doesn't exist for a value you need, **add it to `styles/tokens.css`** first, then use it

---

## CSS naming conventions

Component CSS uses BEM-ish prefixes:

| Prefix | Scope |
|---|---|
| `.ds-*` | Shared design system components (table, badge, pill) |
| `.cl-*` | Claims page specific |
| `.sb-*` | Sidebar |
| `.sp-*` | Side panel |
| `.dash-*` | Dashboard |
| `.val-*` | Validation step (Step 3) |
| `.pdf-*` | PDF viewer/toolbar |

---

## Key design tokens (quick reference)

```css
/* Main action color */
--surface-accent         /* #EAF68F lime — selected tabs, primary CTAs */
--text-on-accent         /* dark text on lime */

/* App surface */
--surface-page           /* page background */
--surface-card           /* white card/panel */
--surface-sidebar        /* sage-50 sidebar bg */
--surface-field          /* sage-50 form input bg */

/* Borders */
--stroke-ui              /* rgba(5,8,16,0.1) — standard borders */
--stroke-ui-medium       /* rgba(5,8,16,0.2) — button inset shadow */
--shadow-btn-inset       /* inset 0 -2px 0 ... — lime CTA depth */
--shadow-focus-ring      /* 0 0 0 4px accent-100 — input focus */

/* Status badges */
--status-info-bg / --text-info    /* blue — in process */
--border-cancel / --text-cancel   /* red — destructive */
```

---

## Component quick lookup

| Component | Spec | CSS file |
|---|---|---|
| Button | `specs/components/button.md` | Multiple |
| Badge / Pill | `specs/components/badge.md` | `dashboard.css`, `claims.css` |
| Tabs | `specs/components/tabs.md` | `dashboard.css`, `sidepanel.css` |
| Sidebar | `specs/components/sidebar.md` | `dashboard.css` |
| Side Panel | `specs/components/sidepanel.md` | `sidepanel.css` |
| Table | `specs/components/table.md` | `dashboard.css`, `validation.css` |
| Card / KPI | `specs/components/card.md` | `dashboard.css` |
| Modal | `specs/components/modal.md` | `base.css`, `review.css` |
| Form Field | `specs/components/form-field.md` | `login.css`, `validation.css` |
| Stepper | `specs/components/stepper.md` | `base.css` |

---

## Legacy bridge aliases

`styles/tokens-bridge.css` maps `--p*`, `--n*`, `--a*`, `--e*`, `--w*`, `--s*` etc. to canonical tokens. Prefer canonical names in new code. These exist only for backward compat with existing component CSS.

---

## Accessibility

- All interactive elements must be keyboard-operable
- Buttons must have visible focus styles (use `--shadow-focus-ring`)
- Don't rely on color alone to convey meaning — pair with an icon or text
- Minimum touch target: 36×36px
- WCAG AA contrast required for all text on background combinations
