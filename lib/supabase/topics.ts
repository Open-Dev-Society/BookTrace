import { supabase } from "./client";

export async function fetchTopicsSuggestions(query: string, limit = 10): Promise<string[]> {
  const q = query.trim();
  let req = supabase
    .from("book_topics")
    .select("topic")
    .order("topic", { ascending: true })
    .limit(limit);

  if (q) {
    req = req.ilike("topic", `%${q}%`);
  }

  const { data, error } = await req;
  if (error) throw error;
  const topics = (data ?? []).map((row: { topic: string }) => row.topic).filter(Boolean);
  // ensure uniqueness client-side just in case
  return Array.from(new Set(topics)).slice(0, limit);
}


