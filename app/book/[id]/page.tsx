import { fetchBookById } from "../../../lib/supabase/books";
import { SourceBadge } from "../../../components/SourceBadge";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};

export default async function BookPage({ params }: PageProps) {
  const { id } = params;
  const book = await fetchBookById(id);
  if (!book) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-neutral-600">Book not found.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <Link href="/library" className="text-sm underline">← Go back</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <div>
          <div className="rounded border bg-white overflow-hidden">
            {/* eslint-disable @next/next/no-img-element */}
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full object-cover" />
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center text-neutral-400">No cover</div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{book.title}</h1>
            <div className="text-neutral-700">{book.author ?? "Unknown author"}</div>
          </div>
          <div className="text-sm text-neutral-700 space-y-1">
            {book.isbn && <div><span className="font-medium">ISBN:</span> {book.isbn}</div>}
            {book.publishedYear && <div><span className="font-medium">Year:</span> {book.publishedYear}</div>}
          </div>
          {book.description && (
            <p className="text-neutral-800 whitespace-pre-line">{book.description}</p>
          )}

          {(book.labels.length > 0 || book.topics.length > 0) && (
            <div className="space-y-2">
              {book.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-neutral-600">Labels:</span>
                  {book.labels.map((l) => (
                    <span key={l} className="rounded-full border bg-white px-2 py-0.5 text-xs">{l}</span>
                  ))}
                </div>
              )}
              {book.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-neutral-600">Topics:</span>
                  {book.topics.map((t) => (
                    <span key={t} className="rounded-full border bg-white px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <h2 className="text-base font-medium mb-2">Sources</h2>
            <div className="text-xs text-neutral-700 mb-2">
              ⚠️ The links below lead to external sources. Availability, legality, and copyright status are determined by the original host, not Book Trace. Always support authors and publishers by purchasing official copies when possible.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {book.sources.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border bg-white p-3 hover:border-black/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm line-clamp-1">{s.sourceName ?? s.url}</div>
                    <SourceBadge label={s.type ?? s.sourceName} verified={s.verified} />
                  </div>
                  {s.format && (
                    <div className="text-xs text-neutral-600 mt-1">Format: {s.format}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Author highlight and related suggestions */}
      <div className="mt-10 space-y-6">
        {book.author && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-700">More works by {book.author}</div>
            <Link href={`/library?author=${encodeURIComponent(book.author)}`} className="text-sm underline">Explore →</Link>
          </div>
        )}
        <div>
          <div className="text-base font-medium mb-2">People also traced…</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Placeholder skeleton cards for MVP; can be replaced with actual recommendations later */}
            <div className="aspect-[3/4] rounded border bg-white" />
            <div className="aspect-[3/4] rounded border bg-white" />
            <div className="aspect-[3/4] rounded border bg-white" />
            <div className="aspect-[3/4] rounded border bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}


