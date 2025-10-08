// Raw DB rows
export type BookRow = {
  id: string;
  title: string;
  isbn: string | null;
  author: string | null;
  cover_url: string | null;
  description: string | null;
  published_year: number | null;
  created_at: string;
};

export type BookLabelRow = {
  id: string;
  book_id: string;
  label: string;
};

export type BookTopicRow = {
  id: string;
  book_id: string;
  topic: string;
};

export type SourceRow = {
  id: string;
  book_id: string;
  source_name: string | null;
  url: string;
  type: string | null; // e.g., "Free" | "Verified" | "Paid" | "Open Source"
  verified: boolean | null;
  format: string | null;
  added_at: string;
};

// Joined shape from Supabase select with relations
export type BookJoined = BookRow & {
  book_labels: Pick<BookLabelRow, "label">[];
  book_topics: Pick<BookTopicRow, "topic">[];
  sources: SourceRow[];
};

// UI-ready model
export type Book = {
  id: string;
  title: string;
  isbn: string | null;
  author: string | null;
  coverUrl: string | null;
  description: string | null;
  publishedYear: number | null;
  createdAt: string;
  labels: string[];
  topics: string[];
  sources: Array<{
    id: string;
    sourceName: string | null;
    url: string;
    type: string | null;
    verified: boolean;
    format: string | null;
    addedAt: string;
  }>;
};

export type SearchFilters = {
  labels?: string[];
  topics?: string[];
  types?: string[]; // source types
  author?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function mapBookJoinedToBook(input: BookJoined): Book {
  return {
    id: input.id,
    title: input.title,
    isbn: input.isbn,
    author: input.author,
    coverUrl: input.cover_url,
    description: input.description,
    publishedYear: input.published_year ?? null,
    createdAt: input.created_at,
    labels: (input.book_labels ?? []).map((l) => l.label),
    topics: (input.book_topics ?? []).map((t) => t.topic),
    sources: (input.sources ?? []).map((s) => ({
      id: s.id,
      sourceName: s.source_name,
      url: s.url,
      type: s.type,
      verified: Boolean(s.verified),
      format: s.format,
      addedAt: s.added_at,
    })),
  };
}


