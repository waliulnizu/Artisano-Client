# Artisano — Online Art Marketplace (Client)

## Project Overview

Artisano is a full-stack digital art marketplace connecting artists (creators) with art lovers (collectors). Artists publish premium digital assets; collectors discover, review, and purchase them. The platform features role-based dashboards, Stripe-powered payments, and a curated gallery experience.

## Live URL

**Frontend:** [https://artisano.vercel.app/](https://artisano.vercel.app/)

---

## How the Project Works

### User Roles

| Role | Description |
|---|---|
| **Collector (user)** | Browses gallery, purchases artworks, writes reviews/comments, manages wishlist |
| **Artist** | Uploads artworks, manages studio, views sales analytics |
| **Admin** | Full platform control — user management, sales analytics, content moderation |

### Core Flows

1. **Browse & Discover** → Visitors browse the public gallery with search, category filters, price range, and sorting
2. **Artwork Detail** → View artwork details, artist dossier, related works, reviews, and comments
3. **Purchase** → Stripe checkout for one-time artwork purchases (monthly quota enforced)
4. **Membership** → Stripe subscription for VIP tiers (Pro $29/mo, Enterprise $99/mo)
5. **Collector Dashboard** → Acquired artworks vault, curatorial notes, purchase history, quota tracking
6. **Artist Studio** → Upload, edit, delete artworks with tier-based upload limits
7. **Admin Panel** → User management, sales analytics, platform statistics

### Authentication Flow

- **Email/Password** → JWT token stored in httpOnly cookie + client-side cookie
- **Google OAuth** → Better Auth session (google_users collection)
- **Dual auth** → Server checks both JWT cookie and Better Auth session

---

## Page Routes (Next.js App Router)

| Route | Purpose | Access |
|---|---|---|
| `/` | Public homepage — hero, stats, featured artworks, pricing, FAQ | Public |
| `/landing` | Dedicated marketing landing page | Public |
| `/login` | Login with email/password or Google | Public |
| `/register` | Register with role selection (Collector/Artist) | Public |
| `/browse` | Gallery with search, filters, pagination | Public |
| `/artwork/[id]` | Artwork detail — gallery, metadata, purchase card, reviews, comments | Public |
| `/artists` | Artist directory — all public creators | Public |
| `/artist/[name]` | Individual artist profile page | Public |
| `/premium` | Membership plans & upgrade | Public |
| `/vip-room` | VIP members-only area | Premium |
| `/purchase/success` | Stripe payment verification & receipt | Public (redirected) |
| `/dashboard` | Collector overview — stats, quota, quick links | Protected |
| `/dashboard/acquired` | Acquired artworks vault (purchased pieces) | Protected |
| `/dashboard/transactions` | Purchase history with receipts | Protected |
| `/dashboard/notes` | Curatorial notes — reviews & comments written | Protected |
| `/dashboard/settings` | Profile, password, avatar management | Protected |
| `/dashboard/my-assets` | Artist's uploaded artworks | Artist/Admin |
| `/dashboard/upload` | Upload new artwork (with image) | Artist/Admin |
| `/dashboard/admin-panel` | Admin analytics & user management | Admin |

---

## API Endpoints

All endpoints are prefixed with `http://localhost:5000/api` (or `https://artisano-server.onrender.com/api` in production).

### Auth Routes (`/api/auth`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user (name, email, password, role) | Public |
| `POST` | `/auth/login` | Login with email/password → JWT cookie | Public |
| `POST` | `/auth/logout` | Clear JWT cookie | Public |
| `GET` | `/auth/me` | Get current user profile | Protected |
| `GET` | `/auth/public-users` | List all public creators (artists/admins) with artwork count | Public |
| `PATCH` | `/auth/change-password` | Change password (current + new) | Protected |
| `PATCH` | `/auth/update-profile` | Update profile (with avatar upload) | Protected |
| `POST` | `/auth/upgrade` | Upgrade to Premium membership | Protected |
| `PATCH` | `/auth/update-role` | Update own role (user ↔ artist) | Protected |
| `GET` | `/auth/admin/users` | List all users (no passwords) | Admin |
| `PUT` | `/auth/admin/users/:id` | Update user role/premium status | Admin |

### Content Routes (`/api/content`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/content/public-data` | List artworks with search, filter, sort, pagination | Public |
| `GET` | `/content/premium-data` | List all artworks (premium + free) | Premium/Admin |
| `POST` | `/content/create` | Create new artwork (with image upload) | Artist/Admin |
| `PUT` | `/content/:id` | Update artwork (author or admin) | Protected |
| `DELETE` | `/content/:id` | Delete artwork (author or admin) | Protected |
| `GET` | `/content/artist-assets` | List current artist's artworks | Protected |
| `GET` | `/content/artist-profile` | Creator dossier — catalog size, acquired works, collector count | Public |
| `GET` | `/content/:id` | Single artwork detail (with collector count) | Public |
| `POST` | `/content/upload` | Upload standalone image to Cloudinary | Protected |

### Comment Routes (`/api/comment`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/comment/create` | Create comment on artwork | Protected |
| `GET` | `/comment/artwork/:artworkId` | Get all comments for an artwork | Public |
| `GET` | `/comment/my` | Get all comments written by current user | Protected |
| `PUT` | `/comment/update` | Update a comment | Protected |
| `DELETE` | `/comment/delete` | Delete a comment | Protected |

### Review Routes (`/api/review`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/review/submit` | Submit review with rating | Protected |
| `GET` | `/review/artwork/:artworkId` | Get all reviews for an artwork | Public |
| `GET` | `/review/my` | Get all reviews written by current user | Protected |
| `PUT` | `/review/update` | Update a review | Protected |
| `DELETE` | `/review/delete` | Delete a review | Protected |

### Wishlist Routes (`/api/wishlist`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/wishlist/toggle` | Toggle wishlist status for an artwork | Protected |
| `GET` | `/wishlist` | Get current user's wishlist | Protected |
| `GET` | `/wishlist/my-list` | Alias for above | Protected |

### Transaction Routes (`/api/transactions`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/transactions/acquired` | Collector's purchased artworks with receipts | Protected |
| `GET` | `/transactions/history` | Full purchase history (artworks + subscriptions) | Protected |

### Dashboard Routes (`/api/dashboard`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/dashboard/user-stats` | Collector stats — quota, tier, purchase count | Protected |
| `GET` | `/dashboard/artist-stats` | Artist stats — total assets, sales | Artist |
| `GET` | `/dashboard/admin-stats` | Admin stats — total users, artworks, premium users | Admin |

### Stripe Routes (`/api/stripe`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/stripe/create-checkout-session` | Create Stripe subscription checkout (VIP membership) | Public |
| `POST` | `/stripe/verify-payment` | Verify subscription payment & upgrade user | Public |
| `POST` | `/stripe/create-single-purchase-session` | Create Stripe one-time purchase (artwork) | Protected |
| `POST` | `/stripe/verify-single-purchase` | Verify artwork purchase & record transaction | Protected |
| `GET` | `/stripe/check-ownership` | Check if user owns artwork + quota info | Protected |
| `GET` | `/stripe/admin/sales-analytics` | 7-day sales revenue chart data | Admin |

### Checkout Routes (`/api/checkout`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/checkout/create-checkout-session` | Legacy Stripe subscription checkout | Public |

### Payment Routes (`/api/payment`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| — | *(see stripe.routes.js)* | Payment processing handled via Stripe |

### Mock Payment Routes (`/api/mock-payment`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| — | *(dev/testing only)* | Mock payment for local development | Dev |

### Settings Routes (`/api/settings`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| — | *(see routes/settings.routes.js)* | User settings management | Protected |

---

## Tech Stack & Packages

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.2.9 (App Router) |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS 4, DaisyUI 5.5, HeroUI 3.2 |
| **Auth** | Better Auth 1.6.2 |
| **Forms** | React Hook Form 7.79 + Zod 4.4 |
| **HTTP Client** | Axios 1.18 |
| **Payments** | Stripe.js 9.8 |
| **Charts** | Recharts 3.9 |
| **Themes** | next-themes 0.4.6 |
| **Icons** | lucide-react 0.475, react-icons 5.6 |
| **Toast** | react-hot-toast 2.6 |
| **Linting** | ESLint 9 |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000/api/auth
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Production (uncomment and update)
# NEXT_PUBLIC_API_URL=https://artisano-server.onrender.com/api
# NEXT_PUBLIC_BETTER_AUTH_URL=https://artisano-server.onrender.com/api/auth
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Yes | Better Auth server URL for OAuth |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe public key for client-side |

---

## Setup & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/waliulnizu/Artisano-Client.git
cd Artisano-Client

# 2. Install dependencies
pnpm install

# 3. Create .env.local with the variables above

# 4. Start development server
pnpm dev
```

The app runs on `http://localhost:3000`

---

## Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@arthub.com` |
| Password | `Admin@123` |

---

## Design System

The app uses a **warm olive gallery design system** with:
- Primary: `#5a6b48` (olive green)
- Background: `#e9f0dc` (light cream-olive)
- Dark mode: `zinc-950` base
- Typography: Display + Sans pairing
- Border radius: `rounded-3xl` (24px) for cards, `rounded-full` for buttons
- Shadows: Subtle with olive tint

---

## Package Manager

This project uses **pnpm** (pnpm-lock.yaml is tracked). Do not commit package-lock.json.
