# Kusina De Amadeo Website

A modern, responsive restaurant website built with Next.js 13, featuring both customer-facing pages and an admin dashboard for restaurant management.

## 🌟 Features

### Customer Features
- **Menu Browsing**: Interactive menu with categorized food items
- **About Page**: Rich content showcasing restaurant history, values, and journey
- **Dark Theme**: Elegant dark mode design throughout the application
- **Responsive Design**: Fully responsive across all devices
- **Animations**: Smooth transitions and animations using Framer Motion

### Admin Features
- **Dashboard**: Comprehensive admin interface
- **Menu Management**: Add, edit, and remove menu items
- **Order Management**: Track and manage customer orders
- **Collapsible Sidebar**: Easy navigation with animated sidebar
- **Protected Routes**: Secure admin access

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 13 (App Router)
- **Styling**: 
  - Tailwind CSS
  - Shadcn UI Components
  - Custom CSS Modules
- **State Management**: 
  - React Context
  - Zustand
- **Database**: 
  - PostgreSQL
  - Prisma ORM
- **Authentication**: NextAuth.js
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Image Optimization**: Next.js Image Component
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript

## 📁 Project Structure

```
kda/
├── src/
│   ├── app/                 # Next.js 13 app directory
│   │   ├── about/          # About page
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── menu/           # Menu pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   ├── admin/         # Admin-specific components
│   │   ├── ui/            # UI components
│   │   └── shared/        # Shared components
│   ├── lib/               # Utility functions
│   ├── providers/         # Context providers
│   └── styles/            # Global styles
├── public/               # Static assets
├── prisma/              # Database schema
└── docs/               # Documentation
```

## 🎨 Design System

### Colors
- Primary: Amber and gold tones
- Background: Dark theme with rich gradients
- Accents: Carefully selected complementary colors

### Typography
- Modern, readable fonts
- Hierarchical text styling
- Responsive font sizes

### Components
- Shadcn UI integration
- Custom-styled cards
- Interactive buttons
- Responsive tables
- Modal dialogs

## 🚀 Getting Started

### Prerequisites
- Node.js 16.8 or later
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file with the following:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security Features

- Protected API routes
- Secure authentication flow
- Input validation
- XSS protection
- CSRF protection

## 🎯 Key Pages

### Customer Pages
1. **Home Page**
   - Hero section
   - Featured menu items
   - Call-to-action sections

2. **Menu Page**
   - Categorized food items
   - Search functionality
   - Filtering options

3. **About Page**
   - Restaurant journey timeline
   - Core values
   - Location information
   - Interactive elements

### Admin Pages
1. **Dashboard**
   - Overview statistics
   - Recent orders
   - Quick actions

2. **Menu Management**
   - CRUD operations for menu items
   - Category management
   - Image upload

## 🔄 State Management

- Global theme state
- Cart management
- Admin sidebar state
- Form states

## 🎨 Animation System

Using Framer Motion for:
- Page transitions
- Component animations
- Hover effects
- Loading states

## 📈 Performance Optimization

- Image optimization
- Code splitting
- Dynamic imports
- Caching strategies
- Server-side rendering

## 🛣️ Future Roadmap

1. Phase 1 (Current)
   - ✅ Core functionality
   - ✅ Admin dashboard
   - ✅ Dark theme implementation

2. Phase 2 (Planned)
   - Online ordering system
   - Payment integration
   - Customer accounts
   - Reviews system

## 👥 Contributors

- Project Owner: [Your Name]
- Development Team: [Team Members]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For more detailed documentation, please refer to the `/docs` directory.
