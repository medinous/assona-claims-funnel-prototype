---
title: Assona Design Tokens (moved)
---

# Assona design tokens overview (moved)

This document has moved.

- Canonical location: `docs/design-system/ASSONA-DESIGN-TOKENS.md`
- Usage examples: `docs/design-system/USAGE-EXAMPLES.md`

---

Below is the legacy content preserved for backward compatibility.

# Assona UI Kit - Design Token Implementation

Complete design system implementation with **9 cohesive color palettes**, **432 color values**, and full light/dark theme support.

## 📦 Package Contents

This implementation includes:

1. **`assona-tailwind.config.js`** - Tailwind CSS configuration
2. **`assona-design-tokens.css`** - CSS Custom Properties (variables)
3. **`assona-design-tokens.json`** - JSON tokens for design tools
4. **`USAGE-EXAMPLES.md`** - Comprehensive component examples

## 🚀 Quick Start

### Option 1: Using with Tailwind CSS

1. **Install Tailwind CSS** (if not already installed):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Replace your `tailwind.config.js`** with `assona-tailwind.config.js`:

```bash
mv assona-tailwind.config.js tailwind.config.js
```

3. **Add Tailwind directives** to your CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Use the tokens** in your components:

```jsx
<button className="bg-primary-600 text-neutral-0 px-4 py-3 rounded-sm hover:bg-primary-700">
  Primary Button
</button>
```

### Option 2: Using CSS Custom Properties

1. **Import the CSS file** in your project:

```html
<link rel="stylesheet" href="assona-design-tokens.css">
```

Or in your CSS:

```css
@import url('assona-design-tokens.css');
```

2. **Use the variables** in your styles:

```css
.button-primary {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-primary);
  padding: var(--spacing-component-sm) var(--spacing-component-md);
  border-radius: var(--radius-interactive);
}
```

### Option 3: Using JSON Tokens

Import the JSON file for use with:
- **Figma** (via Tokens Studio plugin)
- **Style Dictionary**
- **Custom build tools**

```javascript
import tokens from './assona-design-tokens.json';

// Access token values
const primaryColor = tokens.color.primary[600].value; // "#144F56"
```

## 🎨 Color System Overview

### Core Palettes (9 Total)

| Palette | Hue | Purpose | Brand Color |
|---------|-----|---------|-------------|
| **Primary** | 186° | Professional brand, CTAs | `#144F56` |
| **Accent** | 65° | Highlights, selected states | `#E4EC84` |
| **Neutral** | 135° | Text, surfaces, borders | Harmonized grays |
| **Error** | 10° | Errors, destructive actions | `#EE735D` |
| **Success** | 140° | Success states, confirmations | Green scale |
| **Warning** | 35° | Warnings, caution states | Orange scale |
| **Petrol** | 180° | Cool surfaces, info sections | `#C3DDDD` |
| **Blush** | 0° | Warm surfaces, personal content | `#EFE8E8` |
| **Sage** | 75° | Earthy surfaces, organic content | `#D1DCBA` |

### Usage Guidelines

#### ✅ DO
- Use **primary** for main actions and navigation
- Use **accent** sparingly (10-15% of interface)
- Use **neutral** for 70-80% of interface
- Always test contrast ratios
- Provide visual feedback beyond color

#### ❌ DON'T
- Don't use accent for primary CTAs (too bright)
- Don't use brand colors directly for text on white
- Don't rely on color alone to convey meaning
- Don't use low-contrast combinations (<3:1)
- Don't apply saturated colors to large areas

## 🌓 Dark Mode Support

### Automatic Theme Switching

The design system supports automatic dark mode based on:
1. User's system preference
2. Manual toggle via `.dark` class

### Implementation

**HTML:**

```html
<html class="dark">
  <!-- Your content -->
</html>
```

**JavaScript (with localStorage):**

```javascript
// Check and apply theme on load
const isDark = localStorage.getItem('darkMode') === 'true' ||
  window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDark) {
  document.documentElement.classList.add('dark');
}

// Toggle function
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
}
```

**React Example:**

```jsx
import { useEffect, useState } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Your content */}
    </div>
  );
}
```

## 📐 Design Token Structure

### Color Tokens

```text
Primary Colors:    primary-{50-950}
Accent Colors:     accent-{50-950}
Neutral Colors:    neutral-{0-1000}
Semantic Colors:   success-{50-950}, warning-{50-950}, error-{50-950}
Pastel Colors:     petrol-{50-950}, blush-{50-950}, sage-{50-950}
```

### Spacing Tokens

```text
Scale:             space-{0,1,2,3,4,6,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96}
Semantic:          spacing-component-{xs,sm,md,lg,xl}
                   spacing-layout-{xs,sm,md,lg,xl}
```

### Radius Tokens

```text
Scale:             radius-{none,xs,sm,md,lg,xl,2xl,circle,full}
Semantic:          radius-{interactive,input,surface,overlay,badge}
```

### Typography Tokens

```text
Font Families:     font-{heading,body,mono}
Font Weights:      font-{light,regular,medium,semibold,bold}
Font Sizes:        text-{xs,sm,md,lg,xl,2xl,3xl}
Line Heights:      leading-{tight,normal,relaxed}
```

## 🎯 Accessibility Compliance

All color combinations are designed to meet **WCAG 2.1 Level AA/AAA** standards:

### Text Contrast Requirements
- **AAA (7:1)**: Use levels 700-950 on white (light mode)
- **AA (4.5:1)**: Use levels 600-700 on white (light mode)
- **Large text AA (3:1)**: Use levels 500-600 on white

### Recommended Combinations

**Light Mode:**

```css
/* AAA Compliant */
color: var(--color-neutral-900);          /* 11.8:1 */
color: var(--color-primary-600);          /* 8.2:1 */
color: var(--color-success-700);          /* 9.0:1 */

/* AA Compliant */
color: var(--color-accent-700);           /* 6.5:1 */
color: var(--color-warning-700);          /* 7.8:1 */
```

**Dark Mode:**

```css
/* AAA Compliant */
color: var(--color-neutral-100);          /* 17.8:1 */
color: var(--color-primary-400);          /* 8.2:1 */
color: var(--color-accent-400);           /* 9.5:1 */
```

## 🧩 Component Examples

### Button

```jsx
// Primary Button (Tailwind)
<button className="
  bg-primary-600 hover:bg-primary-700 active:bg-primary-800
  text-neutral-0 font-heading px-4 py-3 rounded-sm
  focus:ring-2 focus:ring-primary-600
  dark:bg-primary-500 dark:hover:bg-primary-400
">
  Primary Action
</button>

// Primary Button (CSS Variables)
<button style="
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-primary);
  padding: var(--spacing-component-sm) var(--spacing-component-md);
  border-radius: var(--radius-interactive);
">
  Primary Action
</button>
```

### Input

```jsx
<input
  type="text"
  className="
    w-full px-4 py-3 rounded-sm
    bg-neutral-0 border-2 border-neutral-300
    text-neutral-900 placeholder-neutral-500
    focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
    dark:bg-neutral-900 dark:border-neutral-600
  "
  placeholder="Enter text"
/>
```

### Card

```jsx
<div className="
  bg-neutral-0 border border-neutral-200 rounded-lg shadow-card
  p-6 hover:shadow-dropdown
  dark:bg-neutral-900 dark:border-neutral-700
">
  <h3 className="text-xl font-heading font-bold text-neutral-900 dark:text-neutral-0">
    Card Title
  </h3>
  <p className="text-md font-body text-neutral-700 dark:text-neutral-300">
    Card content goes here.
  </p>
</div>
```

### Alert

```jsx
<div className="
  bg-success-100 border-l-4 border-success-600 rounded-lg p-4
  dark:bg-success-950 dark:border-success-500
">
  <p className="text-success-700 dark:text-success-300">
    Success message
  </p>
</div>
```

## 🔧 Customization

### Extending the Palette

To add custom colors while maintaining consistency:

1. **Tailwind Config:**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom palette
        custom: {
          50: '#F0F0F0',
          // ... 100-950
        },
      },
    },
  },
}
```

2. **CSS Variables:**

```css
:root {
  --color-custom-50: #F0F0F0;
  /* ... 100-950 */
}

.dark {
  --color-custom-50: #0F0F0F;
  /* ... inverted values */
}
```

### Overriding Tokens

**Global Override:**

```css
:root {
  --color-primary-600: #YOUR_COLOR;
  --radius-sm: 8px;
  --spacing-component-md: 20px;
}
```

**Scoped Override:**

```css
.custom-section {
  --color-primary-600: #DIFFERENT_COLOR;
}
```

## 📚 Additional Resources

- **Full Usage Guide:** See `docs/design-system/USAGE-EXAMPLES.md` for comprehensive component patterns
- **Accessibility Testing:** Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Figma Integration:** Import `assona-design-tokens.json` using Tokens Studio plugin

## 🏗️ Design System Architecture

```text
Primitive Tokens (Raw Values)
    ↓
Semantic Tokens (Contextual)
    ↓
Component Patterns
    ↓
Page Layouts
```

### Token Hierarchy Example

```text
color-primary-600 (#144F56)           ← Primitive
    ↓
color-interactive-primary             ← Semantic
    ↓
.btn-primary { background: ... }      ← Component
    ↓
<Button variant="primary">            ← Usage
```

## ✅ Best Practices Checklist

- [ ] Always use design tokens instead of hard-coded values
- [ ] Test components in both light and dark modes
- [ ] Verify color contrast meets WCAG standards
- [ ] Use semantic tokens for context-specific styling
- [ ] Maintain consistent spacing using the scale
- [ ] Provide alternative feedback beyond color
- [ ] Document any custom token additions
- [ ] Keep token naming consistent with system

## 📞 Support

For questions or issues:
1. Check `USAGE-EXAMPLES.md` for implementation patterns
2. Review accessibility guidelines above
3. Consult the design team for brand-specific questions

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Maintained by:** Assona Design Team

