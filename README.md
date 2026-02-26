# LibraryPro 📚

A full-stack digital library management system — browse, purchase, and read books online, with an admin dashboard for managing the catalog, users, and analytics.

## Features

### For Readers
- 🔍 **Browse & Search** — filter books by category, author, publisher, price range, and sort order
- 📖 **In-browser PDF Reader** — read purchased books directly in the app
- ⭐ **Ratings & Reviews** — rate books and leave reviews
- ❤️ **Favorites** — save books to your favorites list
- 📊 **Reading History** — track pages read, reading time, and completion status
- 🛒 **Cart & Checkout** — purchase books via Stripe
- 📚 **Personal Library** — access all your purchased books in one place
- 🤖 **AI Recommendations** — get book suggestions based on reading history, preferences, and collaborative filtering
- 🎨 **Preferences** — set reading genre preferences to personalize recommendations
- 🌙 **Dark Mode** — full light/dark theme support

### For Admins
- 📝 **Book Management** — create, edit, and manage the full book catalog
- 🖼️ **Cover Images** — upload multiple cover images with automatic blurhash placeholders
- 📄 **PDF Upload** — upload book files via UploadThing
- 📈 **Analytics Dashboard** — view stats on popularity, reading history, and favorites per book
- 👥 **User Management** — view member profiles and activity
- 🏷️ **Catalog Management** — create and manage authors, publishers, and categories

### Discovery
- 🏆 **Bestsellers** — top books by sales
- 🆕 **New Releases** — recently published books
- 💯 **Top Rated** — highest rated books
- 🔎 **Discover Page** — curated sections combining all of the above

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Auth | NextAuth.js v4 — JWT strategy |
| Database | PostgreSQL + Prisma ORM v6 |
| State / Data | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix) |
| Animations | Framer Motion |
| File Storage | UploadThing (PDFs & book covers) |
| Image Processing | Sharp + Blurhash |
| Payments | Stripe |
| Notifications | Sonner |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |

---

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your env vars
npx prisma migrate dev
npm run dev                  # http://localhost:3000
```

### Scripts

```bash
npm run dev           # dev server with Turbopack
npm run build         # prisma generate + next build
npm run type-check    # tsc --noEmit
npm run lint:fix      # ESLint with auto-fix
npm run seed          # seed the database with books
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | JWT signing secret |
| `NEXTAUTH_URL` | Full app URL (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_API` | Base URL for client-side API calls |
| `UPLOADTHING_SECRET` | UploadThing secret |
| `UPLOADTHING_APP_ID` | UploadThing app ID |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/books` | Public | Full catalog with filters |
| `/books/:id` | Public | Book detail, ratings & reviews |
| `/books/:id/read` | Public | In-browser PDF reader |
| `/discover` | Public | Curated discovery sections |
| `/bestsellers` | Public | Top-selling books |
| `/new-releases` | Public | Recently published books |
| `/library` | Public | Browse library catalog |
| `/cart` | Public | Shopping cart |
| `/auth/signin` | Guest only | Sign in / Register |
| `/profile/:userId` | Protected | User dashboard |
| `/profile/:userId/managebooks` | Admin only | Book management |
| `/profile/:userId/managebooks/createbook` | Admin only | Create new book |
| `/profile/:userId/managebooks/:bookId/editBook` | Admin only | Edit existing book |
| `/profile/:userId/perferances` | Protected | Reading preferences |
| `/recommendation` | Protected | AI-powered recommendations |
| `/checkout` | Protected | Purchase checkout |
| `/checkout/success` | Protected | Order confirmation |
| `/users/:userId` | Protected | Member profile |

---

## Project Structure

```
app/
├── (homePage)/         # Landing page
├── (routes)/           # All user-facing pages
│   ├── auth/           # Sign in / register
│   ├── books/          # Catalog, detail, PDF reader
│   ├── profile/        # User dashboard + admin tools
│   ├── recommendation/ # AI recommendations
│   ├── checkout/       # Purchase flow
│   └── ...
├── api/                # Route Handlers (backend)
├── _components/        # Shared UI components
├── error.tsx           # Global error boundary
└── layout.tsx          # Root layout + providers

store/
├── QueriesApi/         # RTK Query slices (one per domain)
└── Reducers/           # Redux slices for local state

lib/
├── authOption.ts       # NextAuth config
├── prisma.ts           # Prisma client singleton
└── user-actions.ts     # Server actions

middleware.ts           # Route-level auth guard
prisma/schema.prisma    # Database schema
```

---

## Authentication

Route protection is handled in `middleware.ts` using NextAuth's `getToken()`:
- Unauthenticated users on protected routes → redirect to `/auth/signin?callbackUrl=...`
- Authenticated users on `/auth/*` → redirect to `/`
- `/api/auth/*` is always open (NextAuth internals)

User roles: `ADMIN` and `MEMBER`. Admin-only API routes check `session.user.role === "ADMIN"`.
