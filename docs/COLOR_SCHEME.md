# Kusina Amadeo Color Scheme Documentation

## Brand Colors

### Primary Colors
- `brand-900`: #1A0F0F - Deep brown (backgrounds)
- `brand-800`: #2C1810 - Rich brown
- `brand-700`: #3D2116 - Warm brown
- `brand-600`: #4E2A1C - Medium brown
- `brand-500`: #663322 - Primary brown
- `brand-400`: #8B4432 - Light brown
- `brand-300`: #B05542 - Terracotta
- `brand-200`: #D56652 - Coral
- `brand-100`: #FF7762 - Salmon

### Supporting Colors
- `accent-900`: #FF3D00 - Deep orange
- `accent-800`: #FF5722 - Bright orange
- `accent-700`: #FF7043 - Light orange
- `accent-600`: #FF8A65 - Peach
- `accent-500`: #FFAB91 - Soft peach

### Neutral Colors
- `neutral-900`: #1A1A1A - Almost black
- `neutral-800`: #333333 - Dark gray
- `neutral-700`: #4D4D4D - Medium gray
- `neutral-600`: #666666 - Gray
- `neutral-500`: #808080 - Light gray
- `neutral-400`: #999999 - Lighter gray
- `neutral-300`: #B3B3B3 - Very light gray
- `neutral-200`: #CCCCCC - Almost white
- `neutral-100`: #F5F5F5 - Off white

## Gradients

### Brand Gradients
```css
.gradient-brand {
  background: linear-gradient(to right, var(--brand-400), var(--brand-300));
}

.gradient-dark {
  background: linear-gradient(to bottom, var(--brand-900), var(--brand-800));
}

.gradient-accent {
  background: linear-gradient(to right, var(--accent-800), var(--accent-600));
}
```

### Interactive States
```css
.hover-gradient {
  background: linear-gradient(to right, var(--brand-300), var(--brand-200));
  transition: opacity 0.2s ease-in-out;
}
```

## Component-Specific Colors

### Featured Component
- Background: gradient-dark with pattern overlay
- Text: brand-100 to brand-300
- Hover states: gradient-accent with opacity transitions

### ProductCard
- Background: neutral-100
- Text: brand-800
- Price: brand-300
- Hover overlay: gradient-brand with reduced opacity

### AddToCartButton
- Default: gradient-brand
- Hover: gradient-accent
- Loading state: brand-400 with pulse animation

### Header
- Background: gradient-dark with reduced opacity
- Navigation text: brand-300
- Active/Hover: brand-200
- Mobile menu: brand-900 with blur backdrop

### Footer
- Background: gradient-dark with pattern overlay
- Headings: brand-200
- Text: brand-400/90
- Links: brand-400/90 to brand-300 on hover
- Border accents: brand-800/50

## Usage Guidelines

1. **Text Hierarchy**
   - Primary headings: gradient-brand text
   - Secondary headings: brand-200
   - Body text: brand-400/90
   - Subtle text: brand-400/70

2. **Interactive Elements**
   - Buttons: gradient-brand base, gradient-accent hover
   - Links: brand-400 to brand-300 transition
   - Focus states: accent-600 ring

3. **Backgrounds**
   - Main content: neutral-100
   - Featured sections: gradient-dark
   - Cards: white to neutral-100
   - Overlays: brand-900/80 with backdrop blur

4. **Borders and Dividers**
   - Subtle separators: brand-800/50
   - Accent borders: gradient-accent
   - Input fields: brand-600

5. **Accessibility**
   - Maintain minimum contrast ratio of 4.5:1 for text
   - Use opacity values to create depth without losing readability
   - Ensure interactive states have distinct visual feedback

## Implementation Status

### Completed 
- Define color palette
- Implement gradients
- Apply colors to all major components:
  - Featured component
  - ProductCard
  - AddToCartButton
  - Header
  - Footer
- Document component-specific usage
- Implement hover and interactive states
- Add pattern overlays and decorative elements

### To Do
- [ ] Add dark mode support
- [ ] Create color utility classes
- [ ] Add color variables to Tailwind config
- [ ] Create color showcase in Storybook
- [ ] Validate color accessibility (WCAG)

## Implementation Notes
- All colors are implemented through Tailwind CSS utility classes
- Gradients use CSS custom properties for dynamic theming
- Opacity values are used consistently (90%, 70%, 50%) for visual hierarchy
- Pattern overlays use mix-blend-soft-light for texture
- Transitions use 200ms duration with ease-in-out timing
