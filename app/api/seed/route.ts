import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/client";

type SeedBook = {
  title: string;
  author?: string;
  isbn?: string;
  cover_url?: string;
  description?: string;
  published_year?: number;
  labels?: string[];
  topics?: string[];
  sources?: Array<{
    source_name?: string;
    url: string;
    type?: string;
    verified?: boolean;
    format?: string;
  }>;
};

const SEED: SeedBook[] = [
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen; Charles E. Leiserson; Ronald L. Rivest; Clifford Stein",
    isbn: "9780262046305",
    cover_url: "https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg",
    description: "A comprehensive textbook covering modern algorithms and data structures.",
    published_year: 2022,
    labels: ["Textbook", "Computer Science"],
    topics: ["Algorithms", "Data Structures"],
    sources: [
      { source_name: "Publisher", url: "https://mitpress.mit.edu/", type: "Paid", verified: true, format: "Hardcover" },
      { source_name: "OpenLibrary", url: "https://openlibrary.org/", type: "Free", verified: false, format: "Borrow" },
    ],
  },
  {
    title: "The Republic",
    author: "Plato",
    isbn: "9780140455113",
    cover_url: "https://covers.openlibrary.org/b/isbn/9780140455113-L.jpg",
    description: "A Socratic dialogue concerning justice and the ideal state.",
    published_year: -380,
    labels: ["Classic", "Philosophy"],
    topics: ["Ethics", "Politics"],
    sources: [
      { source_name: "Archive.org", url: "https://archive.org/", type: "Free", verified: true, format: "PDF" },
      { source_name: "Project Gutenberg", url: "https://gutenberg.org/", type: "Open Source", verified: true, format: "EPUB" },
    ],
  },
];

export async function POST() {
  try {
    for (const item of SEED) {
      const { data: book, error: bookErr } = await supabase
        .from("books")
        .insert({
          title: item.title,
          author: item.author ?? null,
          isbn: item.isbn ?? null,
          cover_url: item.cover_url ?? null,
          description: item.description ?? null,
          published_year: item.published_year ?? null,
        })
        .select("id")
        .single();
      if (bookErr) throw bookErr;

      const bookId = book!.id as string;

      if (item.labels?.length) {
        const rows = item.labels.map((label) => ({ book_id: bookId, label }));
        const { error } = await supabase.from("book_labels").upsert(rows, { onConflict: "book_id,label" });
        if (error) throw error;
      }

      if (item.topics?.length) {
        const rows = item.topics.map((topic) => ({ book_id: bookId, topic }));
        const { error } = await supabase.from("book_topics").upsert(rows, { onConflict: "book_id,topic" });
        if (error) throw error;
      }

      if (item.sources?.length) {
        const rows = item.sources.map((s) => ({
          book_id: bookId,
          source_name: s.source_name ?? null,
          url: s.url,
          type: s.type ?? null,
          verified: s.verified ?? false,
          format: s.format ?? null,
        }));
        const { error } = await supabase.from("sources").insert(rows);
        if (error) throw error;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}


