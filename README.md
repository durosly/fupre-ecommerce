# FUPREshop — Premium University Marketplace

A full-stack e-commerce application built for the FUPRE (Federal University of Petroleum Resources, Effurun) community.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Drizzle ORM + drizzle-kit
- **Authentication**: better-auth (email/password)
- **Styling**: TailwindCSS v4
- **Data Fetching**: Axios
- **Image Storage**: Local file system (`public/uploads`)

## Features

### Public

- 🏠 Homepage with hero section and featured products
- 🛍️ Product catalog with search and category filters
- 📦 Product detail pages with quantity selector
- 🛒 Shopping cart with quantity management
- 💳 Checkout with dummy payment (Card, Bank Transfer, Pay on Delivery)
- ℹ️ About Us and Contact Us pages

### Authentication

- 📧 Email + Password signup/login
- 🔒 Session handling with better-auth
- 👤 Role-based access (admin vs user)

### Admin Dashboard (role: admin)

- 📊 Dashboard overview with stats
- 📦 Product management (CRUD + image upload)
- 🛒 Order management with status updates
- 📋 Inventory tracking with inline stock editing

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create a `.env.local` file:

```env
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

```bash
npm run db:push    # Push schema to SQLite
npm run db:seed    # Seed demo products (Requires Internet Connection)
```

> **Note**: The seed script fetches products from DummyJSON and downloads images locally. An active internet connection is required for this step.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...all]/   # better-auth handler
│   │   ├── products/        # Products CRUD API
│   │   ├── cart/            # Cart API
│   │   ├── orders/          # Orders + Checkout API
│   │   └── upload/          # Image upload API
│   ├── admin/               # Admin dashboard pages
│   ├── auth/                # Login & Signup pages
│   ├── products/            # Product listing & detail
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout + Success
│   ├── about/               # About Us
│   ├── contact/             # Contact Us
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Button, Input
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema
│   │   └── index.ts         # DB connection
│   ├── auth.ts              # better-auth server config
│   └── auth-client.ts       # better-auth client hooks
├── services/
│   └── api.ts               # Axios service layer
├── scripts/
│   └── seed.ts              # Database seeder
└── public/uploads/products/ # Product image storage
```

## Creating an Admin User

1. Sign up normally at `/auth/signup`.
2. Open Drizzle Studio to update your user role:
      ```bash
      npm run db:studio
      ```
3. In Drizzle Studio, find the `user` table, locate your account, and change the `role` column from `user` to `admin`.
4. After saving the changes in Studio, log in (or refresh if already logged in).

### Admin Access

Once logged in as an admin, an "Admin" link will automatically appear in the navigation header, granting access to the [Admin Dashboard](/admin).

## Scripts

| Script                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Start development server                          |
| `npm run build`       | Build for production                              |
| `npm run start`       | Start production server                           |
| `npm run db:push`     | Push schema to database                           |
| `npm run db:seed`     | Seed demo products (Requires Internet Connection) |
| `npm run db:studio`   | Open Drizzle Studio to manage database            |
| `npm run db:generate` | Generate migrations                               |

## Design

- **Aesthetic**: Luxury/refined with warm amber-gold accents
- **Typography**: Playfair Display (Display) + DM Sans (Body)
- **Animations**: Staggered reveals, smooth hovers, scale-in modals
- **Theme**: Light mode with dark mode support
