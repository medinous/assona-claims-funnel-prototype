# Assona Claims Funnel — AI Instructions

## Project overview

Vanilla HTML + CSS + JS prototype for the insurance **claims submission funnel** (bike insurance). No build step. No framework. No npm.

**Scope:** `index.html` only — login, welcome screen, and the 4-step claim funnel (Upload → Confirm Damage → Validate → Review & Submit). The backoffice (dashboard, claims list) has moved to a separate project.

**Stack:** Vanilla ES modules, Lucide icons (CDN), Tabler icons (CDN)

---

## Design Principles — mandatory gate

**Source of truth:** `../assona-design-system/docs/design-principles/design-principles.md` — read this file before making any design or code decision. The table below is excerpted directly from it; if the two ever differ, the docs file wins.

Every design decision — new component, new layout, new interaction, new copy — must pass all five principles before it is considered complete. After finishing any design task, run the checklist below and raise an alert for every violation found.

### The five principles

| # | Principle | Core question |
|---|-----------|--------------|
| 1 | **One thing at a time** | What is the single job of this screen? |
| 2 | **Consistency is the product** | Does this already exist in the system? |
| 3 | **The system always shows its work** | Does the user always know what the system is doing? |
| 4 | **Accessible by default** | Does this work without a mouse and pass contrast checks? |
| 5 | **Calm professionalism** | Does this feel like it belongs — steady, clear, trustworthy? |

### Enforcement checklist

Run this after every design or code task. Raise an alert for each item that fails.

**P1 — One thing at a time**
- [ ] The screen or step has exactly one job
- [ ] No two unrelated decisions are required simultaneously
- [ ] Progressive disclosure is used — depth is revealed only when needed
- [ ] No content was added solely to save clicks

**P2 — Consistency is the product**
- [ ] No new component was built when an existing one could be reused
- [ ] No token value is hardcoded — every value uses a `styles/tokens.css` Layer 2 alias
- [ ] New interaction patterns match existing ones, or deviation is explicitly documented
- [ ] No one-off CSS override — changes go to the component source

**P3 — The system always shows its work**
- [ ] Every async action (submit, upload, AI processing) has a visible loading state
- [ ] Every error state has a recovery path
- [ ] Every status change is surfaced visually
- [ ] AI-prefilled data shows its source and offers an edit path

**P4 — Accessible by default**
- [ ] All new text/background pairs have verified contrast (≥4.5:1 normal, ≥3:1 large text)
- [ ] Status is never communicated by color alone — icon or label always accompanies it
- [ ] All interactive elements have a visible `:focus-visible` style
- [ ] All interactive elements are keyboard-operable (Tab, Enter, Space, arrows)
- [ ] Touch targets are ≥36×36px
- [ ] Icon-only buttons have an `aria-label`

**P5 — Calm professionalism**
- [ ] No new color introduced outside the established `--surface-*` / `--text-*` / `--status-*` token set
- [ ] Warning/error tokens are used only for genuine error or warning system states
- [ ] Hierarchy is solved with spacing, weight, or size — not by adding color
- [ ] No animation introduces urgency for a routine action

### Alert format

When a violation is found, output it **before** completing the task response:

```
⚠ DESIGN PRINCIPLE ALERT — [Principle Name]
[What the violation is, with specific reference to the component or decision]
[Why it breaks the principle]
[Suggested fix]
```

Multiple violations get multiple alerts, each on its own block.

### Quiz mode — triggered automatically

When the user asks any of the following, **do not analyse silently — run the quiz instead**:
- "Are the design principles being respected?"
- "Does this follow / respect the design principles?"
- "Review this against the design principles"
- "Test me on the design principles"
- Any question about whether a page, screen, or flow is aligned with the principles

**How to run the quiz:**

Present all five core questions simultaneously, framed around the specific page or flow being discussed. Ask the user to answer each one before you give your own assessment:

```
Let's run the design principles check. Answer each question for [page / flow name]:

1. ONE THING AT A TIME — What is the single job of this screen?
2. CONSISTENCY IS THE PRODUCT — Does this already exist in the system?
3. THE SYSTEM ALWAYS SHOWS ITS WORK — Does the user always know what the system is doing?
4. ACCESSIBLE BY DEFAULT — Does this work without a mouse and pass contrast checks?
5. CALM PROFESSIONALISM — Does this feel like it belongs — steady, clear, trustworthy?
```

After the user answers, evaluate each response against the full principle definition in `../assona-design-system/docs/design-principles/design-principles.md` and give specific pass / flag / fail feedback per principle. If the user has not provided enough context to answer a question, ask a follow-up for that specific principle before concluding.

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
| `.val-*` | Validation step (Step 3) |
| `.pdf-*` | PDF viewer/toolbar |
| `.review-*` | Review step (Step 4) |
| `.upload-*` | Upload step (Step 1) |
| `.damage-*` | Confirm Damage step (Step 2) |

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
| Button | `specs/components/button.md` | `base.css`, `login.css`, `upload.css`, `damage.css`, `validation.css`, `review.css` |
| Badge / Pill | `specs/components/badge.md` | `validation.css` |
| Tabs | `specs/components/tabs.md` | `validation.css` |
| Table | `specs/components/table.md` | `validation.css` |
| Card | `specs/components/card.md` | `upload.css`, `review.css` |
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
