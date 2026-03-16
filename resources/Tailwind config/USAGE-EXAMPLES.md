# ASSONA UI KIT - USAGE EXAMPLES

This document provides practical examples of how to use the Assona design tokens in your components.

## Table of Contents
1. [Button Components](#button-components)
2. [Form Inputs](#form-inputs)
3. [Cards & Surfaces](#cards--surfaces)
4. [Alerts & Notifications](#alerts--notifications)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Dark Mode Toggle](#dark-mode-toggle)

---

## Button Components

### Primary Button (Tailwind)
```jsx
<button className="
  bg-primary-600 hover:bg-primary-700 active:bg-primary-800
  text-neutral-0 font-heading font-regular
  px-4 py-3 rounded-sm
  transition-colors duration-200
  shadow-sm hover:shadow-md
  focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
  disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed
  dark:bg-primary-500 dark:hover:bg-primary-400 dark:active:bg-primary-300
">
  Primary Action
</button>
```

### Primary Button (CSS Variables)
```css
.btn-primary {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-primary);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-regular);
  padding: var(--spacing-component-sm) var(--spacing-component-md);
  border-radius: var(--radius-interactive);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-interactive-primary-hover);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  background-color: var(--color-interactive-primary-pressed);
}

.btn-primary:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.btn-primary:disabled {
  background-color: var(--color-interactive-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
```

### Secondary Button
```jsx
<button className="
  bg-transparent border-2 border-neutral-300 hover:bg-neutral-100
  text-neutral-900 font-heading font-regular
  px-4 py-3 rounded-sm
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
  dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800
">
  Secondary Action
</button>
```

### Accent Button
```jsx
<button className="
  bg-accent-600 hover:bg-accent-700 active:bg-accent-800
  text-neutral-950 font-heading font-regular
  px-4 py-3 rounded-sm
  transition-colors duration-200
  shadow-sm hover:shadow-md
  dark:bg-accent-500 dark:hover:bg-accent-400 dark:active:bg-accent-300
">
  Accent Action
</button>
```

### Destructive Button
```jsx
<button className="
  bg-error-600 hover:bg-error-700 active:bg-error-800
  text-neutral-0 font-heading font-regular
  px-4 py-3 rounded-sm
  transition-colors duration-200
  shadow-sm hover:shadow-md
  dark:bg-error-500 dark:hover:bg-error-400
">
  Delete
</button>
```

### Ghost Button
```jsx
<button className="
  bg-transparent hover:bg-primary-100 text-primary-600
  font-heading font-regular px-4 py-3 rounded-sm
  transition-colors duration-200
  dark:text-primary-400 dark:hover:bg-primary-900
">
  Ghost Action
</button>
```

---

## Form Inputs

### Text Input (Default State)
```jsx
<div className="w-full">
  <label className="block text-sm font-body font-medium text-neutral-900 mb-2 dark:text-neutral-100">
    Email Address
  </label>
  <input
    type="email"
    placeholder="Enter your email"
    className="
      w-full px-4 py-3 rounded-sm
      bg-neutral-0 border-2 border-neutral-300
      text-neutral-900 placeholder-neutral-500
      font-body text-md
      transition-all duration-200
      focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
      disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed
      dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-500
      dark:focus:border-primary-500
    "
  />
</div>
```

### Text Input (Error State)
```jsx
<div className="w-full">
  <label className="block text-sm font-body font-medium text-neutral-900 mb-2 dark:text-neutral-100">
    Password
  </label>
  <input
    type="password"
    placeholder="Enter password"
    aria-invalid="true"
    aria-describedby="password-error"
    className="
      w-full px-4 py-3 rounded-sm
      bg-error-50 border-2 border-error-600
      text-error-700 placeholder-error-400
      font-body text-md
      transition-all duration-200
      focus:outline-none focus:border-error-700 focus:ring-2 focus:ring-error-600/20
      dark:bg-error-950 dark:border-error-500 dark:text-error-300 dark:placeholder-error-500
    "
  />
  <p id="password-error" className="mt-2 text-sm text-error-700 dark:text-error-300">
    Password must be at least 8 characters
  </p>
</div>
```

### Text Input (Success State)
```jsx
<div className="w-full">
  <label className="block text-sm font-body font-medium text-neutral-900 mb-2 dark:text-neutral-100">
    Username
  </label>
  <input
    type="text"
    value="assona_user"
    className="
      w-full px-4 py-3 rounded-sm
      bg-success-50 border-2 border-success-600
      text-success-700 placeholder-success-400
      font-body text-md
      transition-all duration-200
      focus:outline-none focus:border-success-700 focus:ring-2 focus:ring-success-600/20
      dark:bg-success-950 dark:border-success-500 dark:text-success-300
    "
  />
  <p className="mt-2 text-sm text-success-700 dark:text-success-300 flex items-center gap-2">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Username is available
  </p>
</div>
```

### Textarea
```jsx
<div className="w-full">
  <label className="block text-sm font-body font-medium text-neutral-900 mb-2 dark:text-neutral-100">
    Description
  </label>
  <textarea
    rows="4"
    placeholder="Enter description"
    className="
      w-full px-4 py-3 rounded-sm
      bg-neutral-0 border-2 border-neutral-300
      text-neutral-900 placeholder-neutral-500
      font-body text-md
      resize-vertical
      transition-all duration-200
      focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
      dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-100
    "
  />
</div>
```

### Checkbox
```jsx
<label className="flex items-center gap-3 cursor-pointer group">
  <input
    type="checkbox"
    className="
      w-5 h-5 rounded cursor-pointer
      border-2 border-neutral-300
      text-primary-600 focus:ring-2 focus:ring-primary-600/20
      transition-all duration-200
      checked:bg-primary-600 checked:border-primary-600
      dark:border-neutral-600 dark:checked:bg-primary-500 dark:checked:border-primary-500
    "
  />
  <span className="text-md font-body text-neutral-900 group-hover:text-primary-600 dark:text-neutral-100 dark:group-hover:text-primary-400">
    I agree to the terms and conditions
  </span>
</label>
```

---

## Cards & Surfaces

### Default Card
```jsx
<div className="
  bg-neutral-0 border border-neutral-200 rounded-lg shadow-card
  p-6 transition-all duration-200 hover:shadow-dropdown
  dark:bg-neutral-900 dark:border-neutral-700
">
  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2 dark:text-neutral-0">
    Card Title
  </h3>
  <p className="text-md font-body text-neutral-700 dark:text-neutral-300">
    This is a standard card component with default styling.
  </p>
</div>
```

### Elevated Card (with shadow)
```jsx
<div className="
  bg-neutral-0 rounded-lg shadow-lg
  p-6 transition-all duration-200 hover:shadow-xl
  dark:bg-neutral-800 dark:shadow-2xl
">
  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2 dark:text-neutral-0">
    Elevated Card
  </h3>
  <p className="text-md font-body text-neutral-700 dark:text-neutral-300">
    This card has stronger elevation with deeper shadows.
  </p>
</div>
```

### Cool Surface (Petrol)
```jsx
<div className="
  bg-petrol-100 border border-petrol-300 rounded-lg
  p-6
  dark:bg-petrol-900 dark:border-petrol-700
">
  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2 dark:text-neutral-0">
    Information Section
  </h3>
  <p className="text-md font-body text-neutral-700 dark:text-neutral-300">
    Use cool petrol surfaces for data or information sections.
  </p>
</div>
```

### Warm Surface (Blush)
```jsx
<div className="
  bg-blush-100 border border-blush-300 rounded-lg
  p-6
  dark:bg-blush-900 dark:border-blush-700
">
  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2 dark:text-neutral-0">
    Personal Content
  </h3>
  <p className="text-md font-body text-neutral-700 dark:text-neutral-300">
    Use warm blush surfaces for personal or user-related content.
  </p>
</div>
```

### Earthy Surface (Sage)
```jsx
<div className="
  bg-sage-100 border border-sage-300 rounded-lg
  p-6
  dark:bg-sage-900 dark:border-sage-700
">
  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2 dark:text-neutral-0">
    Natural Content
  </h3>
  <p className="text-md font-body text-neutral-700 dark:text-neutral-300">
    Use sage surfaces for organic or natural content sections.
  </p>
</div>
```

### Accent Highlight Card
```jsx
<div className="
  bg-accent-100 border-l-4 border-accent-600 rounded-lg
  p-6
  dark:bg-accent-950 dark:border-accent-500
">
  <h3 className="text-xl font-heading font-bold text-accent-800 mb-2 dark:text-accent-300">
    Featured Content
  </h3>
  <p className="text-md font-body text-accent-700 dark:text-accent-400">
    Use accent cards for highlighted or promotional content.
  </p>
</div>
```

---

## Alerts & Notifications

### Info Alert
```jsx
<div className="
  bg-primary-100 border-l-4 border-primary-600 rounded-lg
  p-4 flex items-start gap-3
  dark:bg-primary-950 dark:border-primary-500
">
  <svg className="w-6 h-6 text-primary-600 flex-shrink-0 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
  <div>
    <h4 className="font-heading font-semibold text-primary-700 mb-1 dark:text-primary-300">
      Information
    </h4>
    <p className="text-sm font-body text-primary-700 dark:text-primary-300">
      This is an informational message to help guide users.
    </p>
  </div>
</div>
```

### Success Alert
```jsx
<div className="
  bg-success-100 border-l-4 border-success-600 rounded-lg
  p-4 flex items-start gap-3
  dark:bg-success-950 dark:border-success-500
">
  <svg className="w-6 h-6 text-success-600 flex-shrink-0 dark:text-success-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
  <div>
    <h4 className="font-heading font-semibold text-success-700 mb-1 dark:text-success-300">
      Success
    </h4>
    <p className="text-sm font-body text-success-700 dark:text-success-300">
      Your action has been completed successfully!
    </p>
  </div>
</div>
```

### Warning Alert
```jsx
<div className="
  bg-warning-100 border-l-4 border-warning-700 rounded-lg
  p-4 flex items-start gap-3
  dark:bg-warning-950 dark:border-warning-500
">
  <svg className="w-6 h-6 text-warning-700 flex-shrink-0 dark:text-warning-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
  <div>
    <h4 className="font-heading font-semibold text-warning-700 mb-1 dark:text-warning-300">
      Warning
    </h4>
    <p className="text-sm font-body text-warning-700 dark:text-warning-300">
      Please be cautious with this action. It may have consequences.
    </p>
  </div>
</div>
```

### Error Alert
```jsx
<div className="
  bg-error-100 border-l-4 border-error-700 rounded-lg
  p-4 flex items-start gap-3
  dark:bg-error-950 dark:border-error-500
">
  <svg className="w-6 h-6 text-error-700 flex-shrink-0 dark:text-error-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
  <div>
    <h4 className="font-heading font-semibold text-error-700 mb-1 dark:text-error-300">
      Error
    </h4>
    <p className="text-sm font-body text-error-700 dark:text-error-300">
      Something went wrong. Please try again or contact support.
    </p>
  </div>
</div>
```

---

## Typography

### Headings
```jsx
<div className="space-y-4">
  <h1 className="text-3xl font-heading font-bold text-neutral-1000 dark:text-neutral-0">
    Heading 1 - Welcome!
  </h1>
  
  <h2 className="text-2xl font-heading font-bold text-neutral-1000 dark:text-neutral-0">
    Heading 2 - Section Title
  </h2>
  
  <h3 className="text-xl font-heading font-bold text-neutral-900 dark:text-neutral-100">
    Heading 3 - Subsection
  </h3>
  
  <h4 className="text-md font-heading font-bold text-neutral-900 dark:text-neutral-100">
    Heading 4 - Small Title
  </h4>
</div>
```

### Body Text
```jsx
<div className="space-y-4">
  <p className="text-md font-body font-regular text-neutral-900 dark:text-neutral-100">
    This is primary body text. It uses the body font family (Inter) and should be used for most content.
  </p>
  
  <p className="text-md font-body font-medium text-neutral-900 dark:text-neutral-100">
    This is emphasized body text using medium weight for subtle emphasis.
  </p>
  
  <p className="text-sm font-body font-regular text-neutral-700 dark:text-neutral-300">
    This is secondary body text, slightly smaller and lighter for less important content.
  </p>
  
  <p className="text-xs font-body font-regular text-neutral-600 dark:text-neutral-400">
    This is caption text for labels, timestamps, and metadata.
  </p>
</div>
```

### Links
```jsx
<div className="space-y-2">
  <a href="#" className="
    text-md font-body font-regular text-primary-600
    hover:text-primary-700 hover:underline
    transition-colors duration-200
    dark:text-primary-400 dark:hover:text-primary-300
  ">
    Default Link
  </a>
  
  <a href="#" className="
    text-md font-body font-medium text-primary-600
    underline hover:text-primary-700
    transition-colors duration-200
    dark:text-primary-400 dark:hover:text-primary-300
  ">
    Underlined Link
  </a>
</div>
```

---

## Spacing & Layout

### Component Spacing
```jsx
{/* Tight spacing for icons and buttons */}
<div className="flex items-center gap-2">
  <span>Icon</span>
  <span>Text</span>
</div>

{/* Standard spacing between form elements */}
<div className="space-y-4">
  <input type="text" />
  <input type="email" />
  <button>Submit</button>
</div>

{/* Section spacing */}
<div className="space-y-8">
  <section>Section 1</section>
  <section>Section 2</section>
</div>

{/* Large section spacing */}
<div className="space-y-12">
  <section>Major Section 1</section>
  <section>Major Section 2</section>
</div>
```

### Layout Containers
```jsx
{/* Page container with padding */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Content */}
</div>

{/* Card grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-neutral-0 p-6 rounded-lg border border-neutral-200">Card 1</div>
  <div className="bg-neutral-0 p-6 rounded-lg border border-neutral-200">Card 2</div>
  <div className="bg-neutral-0 p-6 rounded-lg border border-neutral-200">Card 3</div>
</div>

{/* Stack layout */}
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## Dark Mode Toggle

### React Component
```jsx
'use client';

import { useState, useEffect } from 'react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="
        p-2 rounded-md transition-colors duration-200
        bg-neutral-200 hover:bg-neutral-300
        dark:bg-neutral-700 dark:hover:bg-neutral-600
      "
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg className="w-5 h-5 text-neutral-900 dark:text-neutral-100" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-neutral-900 dark:text-neutral-100" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
```

### Vanilla JavaScript
```html
<button id="darkModeToggle" class="p-2 rounded-md bg-neutral-200 dark:bg-neutral-700">
  <svg id="sunIcon" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
  </svg>
  <svg id="moonIcon" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
</button>

<script>
  const toggle = document.getElementById('darkModeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  
  // Check system preference or localStorage
  const darkMode = localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (darkMode) {
    document.documentElement.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  }
  
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark);
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
  });
</script>
```

---

## Best Practices

### 1. Always Use Design Tokens
❌ **Don't:**
```css
.button {
  background-color: #144F56;
  color: #FFFFFF;
}
```

✅ **Do:**
```css
.button {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-primary);
}
```

### 2. Respect Accessibility
- Always test color contrast ratios
- Use semantic HTML elements
- Provide focus indicators
- Never rely on color alone to convey meaning

### 3. Consistent Spacing
Use the spacing scale consistently:
- Component padding: `spacing-component-*`
- Layout gaps: `spacing-layout-*`
- Always use increments from the scale

### 4. Dark Mode Considerations
- Test all components in both themes
- Use semantic tokens that adapt automatically
- Ensure sufficient contrast in both modes
- Consider different shadow intensities

### 5. Component Composition
Build components from atomic tokens:
```jsx
// Good: composable, maintainable
<Button variant="primary" size="md">Click me</Button>

// Bad: hardcoded values
<button style={{ backgroundColor: '#144F56', padding: '12px 16px' }}>Click me</button>
```
