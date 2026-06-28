# ArtHub – Online Art Marketplace (Client)

## Project Overview
ArtHub is a digital platform connecting art lovers, collectors, and buyers with talented artists. It allows users to browse, discover, and purchase original artworks, while enabling artists to manage their creations.

## Live URL
[https://artisano.vercel.app/](https://artisano.vercel.app/)

## Purpose
To democratize access to art by providing an intuitive online marketplace where emerging artists can reach global audiences, and buyers get a secure, streamlined purchase experience.

## Key Features
- **Responsive UI:** Modern design built with Next.js, Tailwind CSS, and HeroUI/DaisyUI.
- **Authentication:** Email/Password and Google Login (OAuth) via BetterAuth.
- **Role-based Dashboards:** Specific interfaces and capabilities for Users (Buyers), Artists, and Admin.
- **Browse & Search:** Filter artworks by category, sort by price, and search by title/artist.
- **Artwork Management:** Artists can upload artworks (via Cloudinary), edit, and delete them.
- **Stripe Integration (Pending/In-Progress):** Secure payments for purchasing artworks and upgrading subscription tiers.
- **Comments & Wishlist:** Authenticated users can comment on purchased artworks and add items to a wishlist.
- **Admin Analytics:** Charts visualizing sales data and user statistics using Recharts.

## Tech Stack & npm Packages Used
- Next.js (16.2.9)
- React (19.2.4)
- Tailwind CSS
- HeroUI / DaisyUI
- Lucide React / React Icons (for icons)
- React Hook Form & Zod (for form handling and validation)
- Better-Auth (for authentication)
- Axios (for API requests)
- Recharts (for data visualization)
- @stripe/stripe-js (for payment gateway setup)

## Admin Credentials
- **Email:** admin@arthub.com
- **Password:** Admin@123

## Setup & Local Development
1. Clone the repository.
2. Run `pnpm install` to install dependencies.
3. Ensure you have the environment variables set up in your `.env` (for local) and `.env.production` (for live). The required variables are:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_BETTER_AUTH_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Run `pnpm dev` to start the development server.
