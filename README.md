## Book Trace — Open Dev Society

Trace every book on the web — free, verified, and open.

This repo contains the open-source MVP of Book Trace: a Next.js app that indexes book metadata (not files) and connects readers to publicly available sources such as OpenLibrary, Archive.org, publishers, GitHub, and verified repositories.

### Core Principles
- No Login Required: everything open and accessible
- No Piracy: index only publicly available or official links
- Knowledge for All: free, student-friendly
- Transparency First: clear labeling of Free, Verified, Paid, Open Source
- Zero Cost Stack: free-tier friendly infra

---

## Tech Stack
- Next.js 14+ (App Router) + TypeScript
- TailwindCSS; light, content-first theme
- shadcn/ui (optional styles/components)
- Supabase (free tier) for database + querying
- Deploy on Vercel

Directory overview
- `app/` — routes and pages (App Router)
  - `page.tsx` — home (hero + search + CTA)
  - `search/page.tsx` — search results + sections (Related/Popular/Trending placeholders)
  - `library/page.tsx` — browsable library (filters + pagination)
  - `book/[id]/page.tsx` — book details
  - `api/seed/route.ts` — inserts example data
  - `seed/page.tsx` — UI to trigger seed
- `components/` — shared UI
  - `SearchBar.tsx` — debounced search with suggestions
  - `FilterSidebar.tsx` — labels/topics/types/author filters + topics autocomplete
  - `Pagination.tsx` — reusable pagination
  - `BookCard.tsx` — cover/title/author + primary badge
  - `SourceBadge.tsx` — badges with emojis (🆓/✅/💰/💾)
  - `ContributeForm.tsx` — embedded Tally form for user submissions
- `lib/` — types and Supabase client + data utilities
  - `supabase/client.ts` — browser client
  - `supabase/books.ts` — search + filters + pagination + book by id
  - `supabase/topics.ts` — topics suggestions
  - `supabase/suggestions.ts` — title/author/topic suggestions
  - `types.ts` — DB rows and UI models (+ mappers)

Assets
- `public/ods-logo.svg` — Open Dev Society mock logo
- `public/books-animation.json` — Lottie animation for home hero

---

## Environment Setup
Create `.env.local` with your Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional: Tally embed (if using a different form than the default)
NEXT_PUBLIC_TALLY_CONTRIBUTE_URL=https://tally.so/embed/wa7vGZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1
```

Install and run locally:

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## Database Schema (Supabase)

```sql
-- Books
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  isbn text,
  author text,
  cover_url text,
  description text,
  published_year integer,
  created_at timestamp default now()
);

-- Book labels
create table book_labels (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  label text not null,
  unique(book_id, label)
);

-- Book topics
create table book_topics (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  topic text not null,
  unique(book_id, topic)
);

-- Sources
create table sources (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  source_name text,
  url text not null,
  type text,
  verified boolean default false,
  format text,
  added_at timestamp default now()
);
```

Row Level Security (RLS) for public read (anon key):

```sql
alter table public.books enable row level security;
create policy "Public read books" on public.books for select using (true);

alter table public.book_labels enable row level security;
create policy "Public read labels" on public.book_labels for select using (true);

alter table public.book_topics enable row level security;
create policy "Public read topics" on public.book_topics for select using (true);

alter table public.sources enable row level security;
create policy "Public read sources" on public.sources for select using (true);
```

---

## Data Fetching & Types

- `lib/types.ts` models raw rows (`BookRow`, `BookLabelRow`, `BookTopicRow`, `SourceRow`) and joined shapes (`BookJoined`). `mapBookJoinedToBook` converts to a UI-friendly `Book` model.
- `lib/supabase/books.ts`
  - `fetchBooks({ query, filters, page, pageSize })`
    - Search across `title`, `author`, `isbn`
    - Filters: `.in("book_labels.label")`, `.in("book_topics.topic")`, `.in("sources.type")`
    - Exact count + range pagination (50/page default)
  - `fetchBookById(id)` returns a single book with related `labels`, `topics`, `sources`.
- `lib/supabase/topics.ts` — distinct topic suggestions via `ilike` + client dedupe
- `lib/supabase/suggestions.ts` — suggestions across titles, authors, topics

---

## UI/UX Overview

Pages
- `/` Home: split hero with animated Lottie, headline (“Find every book. Everywhere.”), large search, quick tags (Browse, Authors, Free, Verified), CTAs to Explore Library and Contribute.
- `/library` Library: left filters, floating search bar, top/bottom pagination, 50/books per page.
- `/search` Search: search-focused results + placeholder sections for Related/Popular/Trending.
- `/book/[id]` Book Details: cover, title, author, ISBN, description, labels, topics, sources (with badges), disclaimers, “More works by Author”, and a placeholder “People also traced…” grid.
- `/seed` Seed: button to insert example data.

Components
- SearchBar: debounced input, suggestions dropdown, optional submit button; supports large hero variant.
- FilterSidebar: author text filter; quick chips for labels/types; topics autocomplete with suggestions; multi-select chips.
- Pagination: compact, Amazon-style page navigation.
- BookCard: cover, title, author, primary source badge; subtle hover tilt/shadow.
- SourceBadge: clearly labeled badges (🆓 Free, ✅ Verified, 💰 Paid, 💾 Open Source).
- ContributeForm: togglable section that embeds Tally.

Branding & Theme
- Clean, minimal, content-focused; black text on light background.
- Sticky header with logo + social links; sleek translucent footer centered © line and a one-line links row.
- Disclaimers near sources and in footer about connecting to knowledge, not files.

---

## Seeding Example Data

Visit `http://localhost:3000/seed` and click "Run Seed" to insert example rows into `books`, `book_labels`, `book_topics`, and `sources` via `POST /api/seed`.

---

## Contributing

We welcome contributions of metadata and sources. Use the inline Tally form from the no-results area or the library quick links.

- Embedded Tally form (default): `https://tally.so/embed/wa7vGZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1` ([Tally Embed](`https://tally.so/embed/wa7vGZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`))
- Optional env override: `NEXT_PUBLIC_TALLY_CONTRIBUTE_URL`

---

## Current Status

Implemented
- Supabase integration (client + queries)
- Normalized schema with labels/topics/sources
- Library listing with filters, debounce search, and pagination (50/page)
- Search page with suggestions and extra placeholder sections
- Book details page with badges, disclaimers, and related placeholders
- Home hero with Lottie animation and branding
- Seed route + page for example data
- Contribute form embedded via Tally; quick links + buttons

Next Ideas
- URL-synced filters (labels/types/topics/author) across pages
- Actual related/popular/trending recommendations
- Admin moderation queue for submissions
- Analytics on search and click-through (privacy-respecting)

---

## Legal & Ethics
- Book Trace does not host or distribute files.
- Links point to external hosts; availability and legality are determined by the hosts.
- Support authors and publishers by buying official copies when possible.

---

## Development Scripts

```bash
npm run dev     # start local dev server
npm run build   # build for production
npm run start   # start production build locally
```

---

## Deploy

Deploy to Vercel. Provide the environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (optional) `NEXT_PUBLIC_TALLY_CONTRIBUTE_URL`

Ensure RLS select policies are enabled for public read as shown above.
