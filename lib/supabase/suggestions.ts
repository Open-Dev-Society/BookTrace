import { supabase } from "./client";

export type Suggestion = {
  kind: "title" | "author" | "topic";
  value: string;
};

export async function fetchSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const q = query.trim();
  if (!q) return [];

  const [titlesRes, authorsRes, topicsRes] = await Promise.all([
    supabase.from("books").select("title").ilike("title", `%${q}%`).limit(limit),
    supabase.from("books").select("author").ilike("author", `%${q}%`).limit(limit),
    supabase.from("book_topics").select("topic").ilike("topic", `%${q}%`).limit(limit),
  ]);

  if (titlesRes.error) throw titlesRes.error;
  if (authorsRes.error) throw authorsRes.error;
  if (topicsRes.error) throw topicsRes.error;

  const out: Suggestion[] = [];
  for (const r of (titlesRes.data ?? [])) if (r.title) out.push({ kind: "title", value: r.title });
  for (const r of (authorsRes.data ?? [])) if (r.author) out.push({ kind: "author", value: r.author });
  for (const r of (topicsRes.data ?? [])) if (r.topic) out.push({ kind: "topic", value: r.topic });

  const seen = new Set<string>();
  const unique = out.filter((s) => {
    const key = `${s.kind}:${s.value.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, limit);
}


