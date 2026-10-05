# ArtHub – Online Art Marketplace (Client)

**Purpose:** ArtHub connects art lovers and collectors with independent artists. Buyers browse and purchase original artworks through Stripe, artists manage and sell their work, and an admin oversees users, artworks and transactions.

**Admin login:** admin@arthub.com / Admin@123

## Key features
- Email/password and Google login with JWT (7 days); choose Buyer or Artist at registration
- Role-based dashboards: user (purchase history, bought gallery, subscription tiers, profile), artist (CRUD artworks, sales history), admin (users, artworks, transactions, charts)
- Browse page with search (title/artist), category and price filters, sorting, pagination, skeleton loading
- Artwork details with Stripe Checkout, owner edit/delete, "Sold" badge
- Comment system: only buyers can comment; edit/delete own comments
- Subscription tiers (Free 3, Pro 9, Premium unlimited purchases) paid via Stripe
- imgBB image upload, dark mode (persisted), responsive layout, custom 404 and error boundary
- Reloading any private route keeps you logged in (auth state resolves before redirects)

## Setup
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the deployed server |
| `NEXT_PUBLIC_IMGBB_KEY` | imgBB API key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client id (optional; hides Google button if empty) |

## NPM packages
next, react, react-dom, tailwindcss, @tailwindcss/postcss, framer-motion, recharts, react-hot-toast, next-themes, lucide-react, @react-oauth/google
