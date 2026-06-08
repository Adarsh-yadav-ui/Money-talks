# Money Talks

A full-stack digital products marketplace built with Next.js 16, Convex, Clerk, and Polar. Creators can sell ebooks, templates, presets, and any digital file — buyers get instant access after purchase.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui (neo-brutalism) |
| Backend/DB | Convex (reactive full-stack + document DB) |
| Auth | Clerk (JWT + webhook sync) |
| Billing | Polar (sandbox, `@convex-dev/polar` + `@polar-sh/sdk`) |
| Email | Resend |
| Font | Space Grotesk |
| Package Manager | Bun |

## Features

- **Marketplace** — Browse, search, and filter products by category
- **Seller dashboard** — Create, edit, publish/unpublish, and delete products
- **Digital delivery** — Purchase-gated file downloads and rich text content
- **Cart system** — Multi-product cart with Polar checkout
- **Purchases** — View all purchased products with content and downloads
- **Seller profiles** — Public seller pages showing their products
- **Responsive** — Mobile-first with hamburger menu
- **Neo-brutalism UI** — Hard shadows, thick borders, bold typography

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/explore` | Browse + search + category filter |
| `/products/[slug]` | Public product detail |
| `/products/[slug]/success` | Legacy redirect |
| `/dashboard` | Seller dashboard |
| `/dashboard/products/[slug]` | Product detail (owner edit/delete) |
| `/dashboard/products/[slug]/edit` | Edit product form |
| `/dashboard/products/[slug]/success` | Post-purchase content |
| `/dashboard/seller/[email]` | Seller profile |
| `/cart` | Shopping cart |
| `/cart/success` | Post-cart-checkout |
| `/purchases` | My purchased products |
| `/about`, `/blog`, `/contact` | Static pages |
| `/pricing`, `/faq` | Static pages |
| `/terms`, `/privacy` | Legal pages |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd money-talks
bun install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
# Clerk (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex (https://convex.dev)
NEXT_PUBLIC_CONVEX_URL=

# Polar (https://polar.sh) — sandbox mode
POLAR_ACCESS_TOKEN=
POLAR_ORGANIZATION_ID=
POLAR_WEBHOOK_SECRET=

# Resend (https://resend.com)
RESEND_API_KEY=
```

### 3. Run migrations

```bash
bunx convex deploy
```

### 4. Start dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Convex** handles all backend logic: database, file storage, scheduled jobs, webhooks, and server actions
- **Clerk webhook** (`/clerk-users-webhook`) syncs users to Convex on sign-up/update
- **Polar webhook** (via `@convex-dev/polar`) handles order confirmations
- **Cart** is stored as Convex `cart` table rows (not localStorage) for cross-session persistence
- **File access** is purchase-gated via `hasPurchased` query; file downloads go through `getProductDownload`
- **Email** sent via `ctx.scheduler.runAfter(0, internalAction)` from mutations to Resend

## Neo-brutalism Theme

The design uses custom CSS variables defined in `globals.css`:
- `--shadow: 4px 4px 0px 0px var(--border)` — the signature hard shadow
- `--spacing-boxShadowX/Y: 4px` — hover translate offset
- `--radius-base: 0px` — no border radius anywhere
- `--font-weight-base: 500`, `--font-weight-heading: 700`

## Key Convex Tables

- **users** — Synced from Clerk; role: `"buyer"` | `"creator"`
- **categories** — 8 default categories auto-seeded
- **products** — status: `draft` | `published` | `archived`; supports `files[]`, `coverImage`, `content` (rich text)
- **cart** — buyerId + productId (deduped)
- **orders** + **orderItems** — Purchases with fee tracking
