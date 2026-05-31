# Tour & Travel - Project Structure Documentation

This document explains the folder structure of the Tour & Travel project, a Next.js-based travel and tour booking application.

---

## 📁 Root Level Files & Folders

```
tourandtravel/
├── .git/                          # Git version control directory
├── .gitignore                     # Files to ignore in version control
├── .next/                         # Next.js build cache and output
├── node_modules/                  # Project dependencies (npm packages)
├── public/                        # Static assets (images, icons, etc.)
├── src/                          # Source code (main application folder)
├── eslint.config.mjs             # ESLint configuration (code quality rules)
├── next.config.ts                # Next.js configuration
├── package.json                  # Project metadata & dependencies
├── package-lock.json             # Locked dependency versions
├── postcss.config.mjs            # PostCSS configuration (CSS processing)
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Project documentation
└── PROJECT_STRUCTURE.md          # This file
```

---

## 📂 Public Folder (`/public`)

**Purpose:** Stores static assets served directly to the browser without processing.

```
public/
├── file.svg                      # SVG icon/image
├── globe.svg                     # Globe icon (likely for branding)
├── next.svg                      # Next.js logo
├── vercel.svg                    # Vercel logo
└── window.svg                    # Window icon
```

---

## 📂 Source Folder (`/src`)

**Purpose:** Contains all application source code organized by feature and functionality.

### Directory Structure:

```
src/
├── app/                          # Next.js App Router (pages & layouts)
├── components/                   # Reusable React components
├── data/                         # Static data & constants
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions & helpers
└── types/                        # TypeScript type definitions
```

---

## 📄 App Folder (`/src/app`)

**Purpose:** Contains Next.js app structure, main pages, and global styling.

```
src/app/
├── layout.tsx                    # Root layout component (wraps all pages)
├── page.tsx                      # Home page (main entry point)
├── globals.css                   # Global CSS styles (used across entire app)
└── favicon.ico                   # Browser tab icon
```

**What happens here:**
- `layout.tsx` defines the main HTML structure and navigation
- `page.tsx` is the homepage content
- `globals.css` contains site-wide styling

---

## 🧩 Components Folder (`/src/components`)

**Purpose:** Stores all reusable React components, organized by category.

### Structure:

```
src/components/
├── layout/                       # Main layout components
│   ├── Navbar.tsx               # Navigation bar component
│   └── Footer.tsx               # Footer component
│
├── sections/                     # Page sections (larger components)
│   ├── Hero.tsx                 # Hero/banner section
│   ├── TripPlanner.tsx          # Trip planning section
│   ├── DestinationMap.tsx       # Map section for destinations
│   ├── ExperienceShowcase.tsx   # Experience display section
│   ├── StatsSection.tsx         # Statistics display section
│   ├── Testimonials.tsx         # User testimonials section
│   ├── Contact.tsx              # Contact form section
│   └── Newsletter.tsx           # Newsletter subscription section
│
└── ui/                          # Reusable UI components (smaller, simple)
    ├── Sectionheading.tsx       # Generic heading component for sections
    └── SectionWrapper.tsx       # Wrapper component for consistent styling
```

**Component Categories:**

| Category | Purpose | Examples |
|----------|---------|----------|
| **layout** | Main page layout structure | Navigation, Footer |
| **sections** | Full-width page sections | Hero, Testimonials, Contact |
| **ui** | Small reusable components | Buttons, Headings, Wrappers |

---

## 💾 Data Folder (`/src/data`)

**Purpose:** Stores static data, constants, and mock data used throughout the app.

```
src/data/
└── destination.ts               # Destination information (tours, places, prices, etc.)
```

**Used for:** Static content that doesn't change frequently (tourism data, pricing, destination details)

---

## 🪝 Hooks Folder (`/src/hooks`)

**Purpose:** Contains custom React hooks for reusable logic.

```
src/hooks/
├── useParallax.ts               # Hook for parallax scrolling effect
└── useScrolled.ts               # Hook to detect if page has scrolled
```

**What they do:**
- Custom hooks encapsulate complex logic and make it reusable
- These hooks handle visual effects and scroll behavior

---

## 🔧 Lib Folder (`/src/lib`)

**Purpose:** Utility functions and helper code used throughout the application.

```
src/lib/
└── utils.ts                     # General utility functions (formatting, calculations, etc.)
```

**Contains:** Helper functions for common tasks (date formatting, number rounding, string manipulation, etc.)

---

## 📝 Types Folder (`/src/types`)

**Purpose:** TypeScript type definitions and interfaces used across the app.

```
src/types/
└── index.ts                     # Central file for all TypeScript type definitions
```

**Example types might include:**
- `Destination`, `Tour`, `Booking` interfaces
- `User`, `Review`, `Price` types
- Custom types for the application

---

## 📋 Configuration Files (Root Level)

| File | Purpose |
|------|---------|
| `package.json` | Lists all dependencies & npm scripts for running the project |
| `tsconfig.json` | TypeScript compiler settings |
| `next.config.ts` | Next.js framework configuration |
| `eslint.config.mjs` | Code quality/linting rules |
| `postcss.config.mjs` | CSS processing and Tailwind CSS config |

---

## 🎯 Data Flow Overview

```
┌─────────────────────────────────────┐
│     public/ (Static Assets)         │
│  (Images, Icons, SVG files)         │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│     src/app/ (Pages & Layout)       │
│  - layout.tsx (Main wrapper)        │
│  - page.tsx (Homepage)              │
│  - globals.css (Global styles)      │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│    src/components/ (UI Elements)    │
│  ├── layout/ (Navbar, Footer)       │
│  ├── sections/ (Page Sections)      │
│  └── ui/ (Reusable Components)      │
└────────────┬────────────────────────┘
             │
             ↓
┌──────────────────────────────────────┐
│  src/hooks/ + src/lib/ (Logic)      │
│  - Custom hooks (useParallax, etc)  │
│  - Utility functions (utils.ts)     │
│  - Custom logic & calculations      │
└──────────────┬───────────────────────┘
             │
             ↓
┌──────────────────────────────────────┐
│   src/data/ + src/types/ (Content)  │
│  - Static data (destinations)       │
│  - Type definitions (interfaces)    │
└──────────────────────────────────────┘
```

---

## 🚀 Quick Reference

### To add a new page:
- Create in `src/app/` (Next.js auto-routes files)

### To add a reusable component:
- Create in `src/components/ui/`

### To add a page section:
- Create in `src/components/sections/`

### To add static data:
- Add to `src/data/destination.ts` or create new file

### To add custom logic:
- Create utility function in `src/lib/` or hook in `src/hooks/`

### To add type definitions:
- Add interfaces to `src/types/index.ts`

---

## 📌 Key Points

✅ **Organized by feature** - Related code is grouped together  
✅ **Scalable structure** - Easy to add new features  
✅ **Separation of concerns** - Components, logic, data, and types are separate  
✅ **TypeScript** - Full type safety throughout the project  
✅ **Next.js optimized** - Uses modern React patterns  

---

*Last Updated: May 29, 2026*
