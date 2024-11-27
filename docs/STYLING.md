# Styling Guide

This document outlines the styling conventions and design system used in the Kusina Amadeo website.

## Color Palette

### Primary Colors
```css
--primary: #FFA500;        /* Amber */
--primary-dark: #FF8C00;   /* Dark Amber */
--primary-light: #FFD700;  /* Gold */
```

### Background Colors
```css
--bg-dark: #121212;        /* Main Background */
--bg-card: #1E1E1E;       /* Card Background */
--bg-hover: #2D2D2D;      /* Hover State */
```

### Text Colors
```css
--text-primary: #FFFFFF;   /* Primary Text */
--text-secondary: #A0A0A0; /* Secondary Text */
--text-muted: #6B7280;    /* Muted Text */
```

### Accent Colors
```css
--accent-1: #FF4B4B;      /* Red Accent */
--accent-2: #4CAF50;      /* Green Accent */
--accent-3: #2196F3;      /* Blue Accent */
```

## Typography

### Font Families
```css
--font-primary: 'Inter', sans-serif;
--font-secondary: 'Poppins', sans-serif;
--font-display: 'Playfair Display', serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

## Spacing System

### Base Spacing Units
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## Gradients

```css
--gradient-primary: linear-gradient(to right, var(--primary), var(--primary-dark));
--gradient-dark: linear-gradient(to bottom, #1a1a1a, #121212);
--gradient-card: linear-gradient(145deg, #1e1e1e, #2d2d2d);
```

## Border Radius

```css
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.25rem;      /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Full rounded */
```

## Animation

### Transitions
```css
--transition-all: all 0.3s ease;
--transition-transform: transform 0.2s ease;
--transition-opacity: opacity 0.2s ease;
```

### Animation Timing
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

## Media Queries

```css
/* Mobile */
@media (max-width: 640px) {
  /* Mobile-specific styles */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet-specific styles */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Desktop-specific styles */
}
```

## Component-Specific Styles

### Buttons
```css
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius);
  transition: var(--transition-all);
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-primary);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
}
```

### Cards
```css
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}
```

### Forms
```css
.input {
  background: var(--bg-dark);
  border: 1px solid var(--bg-hover);
  border-radius: var(--radius);
  padding: var(--spacing-2);
  color: var(--text-primary);
}
```

## Best Practices

1. **Consistency**
   - Use variables for colors, spacing, and typography
   - Maintain consistent spacing between elements
   - Follow the established component patterns

2. **Responsive Design**
   - Mobile-first approach
   - Use fluid typography
   - Implement responsive spacing
   - Test across all breakpoints

3. **Performance**
   - Minimize CSS bundle size
   - Use CSS modules for component-specific styles
   - Implement efficient animations

4. **Accessibility**
   - Maintain sufficient color contrast
   - Ensure text readability
   - Support reduced motion preferences
