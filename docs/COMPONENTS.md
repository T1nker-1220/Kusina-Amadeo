# Components Documentation

This document provides detailed information about the key components used throughout the Kusina Amadeo website.

## Admin Components

### AdminSidebar
Location: `src/components/admin/AdminSidebar.tsx`

A collapsible sidebar component for the admin dashboard featuring:
- Dark theme with gradient background
- Animated transitions
- Responsive design
- Icon-based navigation
- Collapsible sections

### AdminHeader
Location: `src/components/admin/AdminHeader.tsx`

Header component for admin pages with:
- User profile information
- Quick actions
- Breadcrumb navigation

## UI Components

### Cards
Location: `src/components/ui/Card.tsx`

Reusable card components with:
- Hover effects
- Shadow variations
- Content layouts
- Image support

### Buttons
Location: `src/components/ui/Button.tsx`

Custom button components featuring:
- Multiple variants (primary, secondary, ghost)
- Loading states
- Icon support
- Size variations

### Modal
Location: `src/components/ui/Modal.tsx`

Modal dialog component with:
- Backdrop blur
- Animation effects
- Close button
- Flexible content area

## Page-Specific Components

### About Page Components
Location: `src/app/about/components/`

- **Timeline**: Interactive timeline showing restaurant history
- **ValueCard**: Cards displaying restaurant values
- **LocationMap**: Restaurant location information
- **TabNavigation**: Tab-based content navigation

### Menu Page Components
Location: `src/app/menu/components/`

- **MenuGrid**: Grid layout for menu items
- **CategoryFilter**: Menu category filtering
- **SearchBar**: Menu item search
- **MenuCard**: Individual menu item display

## Shared Components

### Layout Components
Location: `src/components/shared/`

- **Navbar**: Main navigation bar
- **Footer**: Site footer
- **Container**: Layout container
- **PageHeader**: Reusable page header

### Form Components
Location: `src/components/shared/forms/`

- **Input**: Text input fields
- **Select**: Dropdown selection
- **Checkbox**: Custom checkbox
- **FileUpload**: Image upload component

## Animation Components

### Motion Components
Location: `src/components/motion/`

Custom Framer Motion components for:
- Page transitions
- Scroll animations
- Hover effects
- Loading states

## Best Practices

1. **Component Structure**
   - Keep components focused and single-responsibility
   - Use TypeScript interfaces for props
   - Implement error boundaries where necessary

2. **Styling**
   - Use Tailwind CSS classes
   - Maintain consistent spacing
   - Follow responsive design patterns

3. **Performance**
   - Implement lazy loading where appropriate
   - Use memo for expensive renders
   - Optimize re-renders

4. **Accessibility**
   - Include ARIA labels
   - Ensure keyboard navigation
   - Maintain proper heading hierarchy
