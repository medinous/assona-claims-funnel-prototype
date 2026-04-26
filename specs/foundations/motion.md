# Motion — Foundation

## Duration Tokens

| Token | Value | Use case |
|---|---|---|
| `--duration-instant` | 0.1s | Immediate feedback (spinner, highlight) |
| `--duration-fast` | 0.15s | Hover states, color changes, icon swap |
| `--duration-normal` | 0.2s | Accordion, toggle, appear/disappear |
| `--duration-slow` | 0.35s | Full-screen transitions, view slides |

## Easing Tokens

| Token | Value | Personality |
|---|---|---|
| `--ease-default` | `ease` | Gentle, subtle |
| `--ease-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | Snappy with soft landing — navigation, view transitions |
| `--ease-decelerate` | `cubic-bezier(0.4, 0, 0.2, 1)` | Panel slide-in from off-screen |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Modal pop-in (bouncy overshoot) |

## Composed Transition Tokens

Ready-to-use shorthand values for common cases.

| Token | Value | Use case |
|---|---|---|
| `--transition-color` | `color 0.15s ease, background 0.15s ease` | Button/link hover |
| `--transition-all-fast` | `all 0.15s ease` | Simple interactive elements |
| `--transition-all-normal` | `all 0.2s ease` | Toggles, accordions |
| `--transition-slide` | `transform 0.2s cubic-bezier(0.4,0,0.2,1)` | Panels sliding in/out |
| `--transition-fade` | `opacity 0.2s ease` | Overlays appearing |
| `--transition-view` | `opacity 0.35s spring, transform 0.35s spring` | Full-screen view changes |

## Animation Reference

| Name | Curve | Duration | Used by |
|---|---|---|---|
| `reviewPopIn` | `--ease-bounce` | 0.25–0.3s | Review modal, success modal |
| `confettiFall` | `ease-out` | 0.9s | Success confetti |
| `reviewSpin` | `linear` | 0.7s | Loading spinner |
| `spin` | `linear` | 0.75s | Upload spinner |

## Rules

- All transition durations must reference `--duration-*` tokens
- All easing functions must reference `--ease-*` tokens
- When using a composed `--transition-*` token, do not override with raw values
- Animation `@keyframes` definitions are allowed in component CSS; their `animation-duration` should reference duration tokens
- Raw durations in component CSS (e.g., `0.15s`) are **WARNINGS** in the audit script
