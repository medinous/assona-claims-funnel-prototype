# Claims Page — Design Value Proposition

> **For use in:** design process documentation, Jira tickets, stakeholder reviews
> **Page:** Claims (`claims.html`) — the claims management back-office view

---

## One-line summary

The Claims page gives back-office operators a fast, triageable view of every claim in one place — with the filtering depth and detail access they need, without ever leaving the list.

---

## Who uses this page and why

**Primary user:** Back-office operators — bike shop admins and CSMs — who manage insurance claims on behalf of multiple customers.

**Their job on this page:**
- Know which claims need attention right now
- Understand the current status across the full portfolio
- Take action (review, follow up, create new claims) without switching context

Operators typically return to this page several times per day. It is not a one-time flow — it is a recurring operational tool. Every design decision was made with that daily rhythm in mind.

---

## Design decisions & rationale

### 1. Table as the primary layout

A data table is the correct structure when the user's mental model is a **portfolio to manage**, not a workflow to complete.

Operators handle 15–21+ claims simultaneously and need to scan multiple attributes in parallel — claim ID, customer, IMEI/frame, submission date, payout date, amount, and status — to prioritize work. Cards or list items would require more vertical space per row and fewer visible claims without adding useful information per item.

The table lets operators read across rows (one claim at a time) and down columns (all pending claims, all amounts), supporting both triage and audit modes.

---

### 2. Two-layer filter system: tabs + expandable filters

The tab bar — **All claims** / **Open** — covers the 80% case. Operators most often want to see all active claims or filter to open ones only. These are zero-effort, one-click filters.

The expanded filter panel — status tag pills, submission date picker, payout date picker — serves power users doing targeted searches: a date-range audit, a status-specific export, or a search for a specific customer.

By keeping the detailed filters collapsed by default, the page stays clean and uncluttered for daily use and reveals complexity only when the operator deliberately requests it.

> **UX law applied:** Hick's Law — fewer visible choices at the default state means faster orientation. Progressive disclosure controls when depth appears.

---

### 3. Status badges as the primary scan signal

Status is the most decision-critical attribute on this page. Color-coded badges — **Pending** (amber), **In Progress** (teal), **Paid** (green), **Draft** (neutral), **Cancelled** (plain text) — allow operators to identify rows that need attention before reading a single word.

Status is never communicated by color alone: the label is always present alongside the color. This satisfies WCAG requirements and keeps the table usable in low-contrast conditions or for color-impaired users.

The color palette for badges maps directly to the Assona semantic token system (`--color-warning-*`, `--color-success-*`, `--color-neutral-*`), ensuring visual consistency if status states are added or modified in the future.

---

### 4. Sortable columns for operator-driven prioritization

Key columns — Claim ID, Submitted, Payout, Amount, Status — are sortable. This gives operators the ability to prioritize by oldest pending submission, largest unpaid amount, or most recently updated claim, without a separate filter step.

Sorting is a power feature that requires no additional UI — it lives inside the existing column headers and is triggered on demand.

---

### 5. "+ Create Claim" as the only lime-accented action

The primary action on this page is initiating a new claim. It is the **only element** using the accent color (`--color-accent-300`, `#EAF68F`) in the top action bar.

All secondary controls — search input, filter tabs, filter toggle, row menus — use neutral or muted tones. The visual hierarchy is unambiguous even without reading labels: one action is primary, everything else supports it.

This also means the accent is available as an attention signal for future high-priority states (e.g. an urgent claim badge), without creating visual conflict with the CTA.

---

### 6. Full-screen claim detail — not a side panel

Clicking a table row navigates to a **dedicated full-screen detail view**, not a side panel overlay.

Earlier iterations used a side panel, but that pattern constrains the amount of information that can be displayed at once. Claim detail is information-dense by nature: it includes contract data, bike information, customer details, uploaded documents, extracted invoice/cost estimate data, and a comments thread for follow-up communication. Fitting all of that into a panel either hides content behind additional clicks or forces the operator to scroll through a narrow column — both outcomes that work against efficiency.

The full-screen view solves this by dedicating the entire viewport to the claim. A **fixed sidebar** within the detail page acts as persistent navigation, giving operators direct access to every section — contract, bike, customer, documents, extracted data — without expanding, scrolling, or toggling anything. Information that previously required multiple interactions is now always one click away.

The trade-off is that the operator leaves the list. This is an intentional design choice: claim detail is a focused task, distinct from the list-triage mode. Returning to the list after reviewing a claim is a deliberate transition, not an interruption — consistent with how operators already experience the rest of the platform (sidebar navigation between sections).

---

## UX principles applied

| Decision | Principle |
|---|---|
| Table as default layout | **One thing at a time** — the list is the single job of this screen; the create funnel begins only on demand |
| Tabs + expandable filters | **One thing at a time** + progressive disclosure |
| Status badges | **The system always shows its work** — state is always visible, never implicit |
| Pagination counter ("Showing 15 of 21 claims") | **The system always shows its work** — operators always know the full scope of the dataset |
| Consistent badge tokens | **Consistency is the product** — same semantic tokens as every other status surface in the product |
| Lime CTA + neutral secondaries | **Calm professionalism** — visual hierarchy through restraint, not through adding noise |
| Full-screen detail + fixed sidebar | **One thing at a time** — detail is a focused task, separate from list triage. Fixed sidebar eliminates clicks to access all claim information |

---

## What this enables at scale

- **New claim types** can be added to the create flow without changing the list layout.
- **New status states** can be added using existing semantic color tokens without redesigning badges.
- **New filter dimensions** (e.g. contract type, bike category) slot into the expanded filter panel without affecting the default view.
- **Bulk actions** (export, batch status update) can be introduced via row selection, a column the table structure already accommodates.

The layout is a scaffold, not a fixed screen — its constraints are intentional and extensible.

---

*April 2026 — Assona Design Team*
