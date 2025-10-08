import { supabase } from "./client";
import type { Book, BookJoined, PaginatedResult, SearchFilters } from "../types";
import { mapBookJoinedToBook } from "../types";

const PAGE_SIZE_DEFAULT = 50;

function buildSearchQuery(query: string | undefined) {
  if (!query) return undefined;
  const q = query.trim();
  if (!q) return undefined;
  // Use websearch_to_tsquery-like search via ilike fallbacks for free tier
  return q;
}

export async function fetchBooks({
  query,
  filters,
  page = 1,
  pageSize = PAGE_SIZE_DEFAULT,
}: {
  query?: string;
  filters?: SearchFilters;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<Book>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let select = supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`,
      { count: "exact" }
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  const search = buildSearchQuery(query);
  if (search) {
    select = select.or(
      `title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`
    );
  }

  if (filters?.author && filters.author.trim()) {
    select = select.ilike("author", `%${filters.author.trim()}%`);
  }

  if (filters?.labels && filters.labels.length > 0) {
    // Filter on related table field
    select = select.in("book_labels.label", filters.labels);
  }

  if (filters?.topics && filters.topics.length > 0) {
    select = select.in("book_topics.topic", filters.topics);
  }

  if (filters?.types && filters.types.length > 0) {
    select = select.in("sources.type", filters.types);
  }

  const { data, error, count } = await select;
  if (error) throw error;

  const mapped = (data as unknown as BookJoined[]).map(mapBookJoinedToBook);
  return {
    data: mapped,
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapBookJoinedToBook(data as unknown as BookJoined) : null;
}

export async function fetchTopBooks(limit = 10): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`
    )
    .order("created_at", { ascending: false })
    .range(0, Math.max(0, limit - 1));

  if (error) throw error;
  return ((data ?? []) as unknown as BookJoined[]).map(mapBookJoinedToBook);
}

export async function fetchNewBooks(limit = 10): Promise<Book[]> {
  // newest by created_at
  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`
    )
    .order("created_at", { ascending: false })
    .range(0, Math.max(0, limit - 1));
  if (error) throw error;
  return ((data ?? []) as unknown as BookJoined[]).map(mapBookJoinedToBook);
}

export async function fetchPopularBooks(limit = 10): Promise<Book[]> {
  // Popular proxy: books with the most sources
  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`
    )
    .limit(200); // fetch a window and sort client-side
  if (error) throw error;
  const mapped = ((data ?? []) as unknown as BookJoined[]).map(mapBookJoinedToBook);
  return mapped
    .sort((a, b) => (b.sources?.length ?? 0) - (a.sources?.length ?? 0))
    .slice(0, limit);
}

export async function fetchTrendingBooks(limit = 10): Promise<Book[]> {
  // Trending proxy: recent + with at least one source; recency-weighted
  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  const mapped = ((data ?? []) as unknown as BookJoined[]).map(mapBookJoinedToBook);
  const scored = mapped.map((b) => {
    const ageMs = Math.max(1, Date.now() - new Date(b.createdAt).getTime());
    const days = ageMs / (1000 * 60 * 60 * 24);
    const sourcesCount = b.sources?.length ?? 0;
    const score = (sourcesCount + 1) / (1 + days); // simple recency-weighted score
    return { b, score };
  });
  return scored
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.b);
}

export async function fetchRelatedByTopics(topics: string[], limit = 10): Promise<Book[]> {
  if (!topics || topics.length === 0) return [];
  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,isbn,author,cover_url,description,published_year,created_at,
       book_labels(label),
       book_topics(topic),
       sources(id,book_id,source_name,url,type,verified,format,added_at)`
    )
    .in("book_topics.topic", topics)
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as BookJoined[]).map(mapBookJoinedToBook);
}


