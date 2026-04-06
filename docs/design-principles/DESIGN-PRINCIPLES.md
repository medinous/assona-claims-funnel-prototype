# Assona Design Principles

These principles define the pillars behind every design decision in the Assona claims platform. They are meant to guide the team when making trade-offs, evaluating new features, and scaling the product into new surfaces or user groups.

---

## 1. One thing at a time

**The interface never asks for more than the user needs to decide right now.**

The claims funnel is broken into discrete, purposeful steps — Upload, Confirm, Validate, Review. Each step has exactly one job. This structure is not a limitation; it is the design. Reducing what's visible at any moment lowers the cognitive cost of each action, minimizes input errors, and makes the overall process feel manageable — even when the underlying workflow is complex.

**How to apply when scaling:**
Every new flow, screen, or feature should have a single clear purpose. If a screen requires two separate decisions, split it. Use progressive disclosure to reveal depth only when the user is ready for it. Never front-load complexity in the name of saving clicks.

> Grounded in: Miller's Law (7±2 items in working memory), Hick's Law (fewer choices = faster decisions), Chunking (meaningful grouping over information density).

---

## 2. Consistency is the product

**Familiarity is trust. Every interaction the user has seen before is one they no longer have to learn.**

In a regulated, high-stakes domain like insurance, predictability is not boring — it is reassuring. Shared design tokens, component conventions, and interaction patterns mean that operators who know the claims list also know the dashboard. Side panels, status badges, action buttons, and table rows behave the same way across every page.

Inconsistency creates doubt. If a badge means "Pending" on one screen and "In Review" on another, users stop trusting what they see. The design system enforces coherence at scale: one token for one concept, one component pattern for one behavior.

**How to apply when scaling:**
Before building a new component, check if an existing one solves the problem. Reuse over reinvention. When the system must evolve, update the token or component at the source — not in a one-off override. Document exceptions.

> Grounded in: Jakob's Law (users transfer expectations from other products), Monzo's principle "Let consistency and patterns build trust", the Aesthetic-Usability Effect (polished = perceived as more reliable).

---

## 3. The system always shows its work

**Users should never wonder what the system is doing, what it knows, or what it needs from them.**

The Assona platform involves moments of AI-assisted processing — documents being parsed, damage details extracted, data pre-filled. These moments carry inherent uncertainty. If the system acts silently, operators lose confidence in the output. If it communicates — even simply — operators can verify, correct, and move forward.

This principle extends beyond AI: claim statuses, loading states, validation feedback, and error recovery must always be explicit. A spinner without context, a status that never updates, or an error with no next step all break the operator's ability to do their job.

**How to apply when scaling:**
Whenever the system changes state — processing, waiting, failing, succeeding — surface it. Prefer inline contextual feedback over modals. Use status tokens (warning, error, success) consistently. When AI pre-fills data, make the source legible and the edit path obvious. Never remove user agency in the name of automation.

> Grounded in: Nielsen's Visibility of System Status (heuristic #1), Humane by Design (empowering users, not replacing them), HAX Toolkit AI transparency guidelines.

---

## 4. Accessible by default

**Accessibility is not a layer added at the end — it is the foundation the design system is built on.**

The Assona design token system is engineered to meet WCAG 2.1 AA/AAA contrast standards from the ground up. Semantic HTML, keyboard-navigable flows, visible focus states, and non-color-dependent status signals are baseline requirements — not enhancements.

This matters beyond legal compliance. Back office operators may use the platform across different devices, lighting conditions, and assistive setups. A platform that only works well for a narrow user profile will fail the business as it scales.

**How to apply when scaling:**
When adding new tokens, verify contrast ratios before committing. Never use color as the sole signal for status — pair it with an icon or label. Test new flows with keyboard-only navigation. If a component requires a mouse to operate, it is not finished.

> Grounded in: WCAG 2.1 (AA/AAA), Humane by Design (Inclusive), the Assona token system's built-in contrast compliance.

---

## 5. Calm professionalism

**The visual language signals competence and care — not urgency, alarm, or corporate coldness.**

The Assona color palette is deliberate. Petrol and sage ground the interface in calm authority. The lime accent (`#EAF68F`) draws attention without screaming. Generous white space gives dense data room to breathe. This is not cosmetic — it is how the product communicates that it can be trusted with serious matters.

Insurance intersects with stressful real-life events: a damaged bike, a pending claim, a delayed reimbursement. The platform's visual tone should make operators feel equipped and in control, not anxious. The design should never introduce urgency that doesn't exist in the task itself.

**How to apply when scaling:**
Resist the impulse to add more color to solve hierarchy problems — solve them with spacing, weight, and size instead. Reserve warning and error tokens for genuine system states. When introducing new surfaces, default to the established palette before reaching for new colors. Visual calm is a feature.

> Grounded in: Peak-End Rule (how the final moments of a flow shape the overall memory of it), the Aesthetic-Usability Effect, Humane by Design (finite and purposeful use of attention-capture).

---

## Quick reference

| Principle | Core question to ask |
|---|---|
| One thing at a time | What is the single job of this screen? |
| Consistency is the product | Does this already exist in the system? |
| The system always shows its work | Does the user always know what the system is doing? |
| Accessible by default | Does this work without a mouse and pass contrast checks? |
| Calm professionalism | Does this feel like it belongs — steady, clear, trustworthy? |

---

*Last updated: April 2026 — Assona Design Team*
