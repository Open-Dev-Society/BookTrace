"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchBar } from "../../components/SearchBar";
import { Pagination } from "../../components/Pagination";
import { BookCard } from "../../components/BookCard";
import type { Book, PaginatedResult } from "../../lib/types";
import { ContributeForm } from "../../components/ContributeForm";
import { fetchBooks, fetchPopularBooks, fetchTrendingBooks, fetchNewBooks } from "../../lib/supabase/books";
import { useSearchParams, useRouter } from "next/navigation";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = useMemo(() => searchParams.get("q") ?? "", [searchParams]);

  const [query, setQuery] = useState(initialQ);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<Book>>({ data: [], total: 0, page: 1, pageSize: 50 });
  const [loading, setLoading] = useState(false);
  const [popular, setPopular] = useState<Book[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);
  const [relatedRaw, setRelatedRaw] = useState<Book[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBooks({ query, page, pageSize: 50 });
      setResult(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => { load(); }, [load]);

  // Load extra sections (independent of query): Popular, Trending, Related (recent by created_at)
  useEffect(() => {
    let active = true;
    fetchPopularBooks(8).then((res) => { if (active) setPopular(res); }).catch(console.error);
    fetchTrendingBooks(8).then((res) => { if (active) setTrending(res); }).catch(console.error);
    // fetch more to allow filtering out overlaps with current results
    fetchNewBooks(24).then((res) => { if (active) setRelatedRaw(res); }).catch(console.error);
    return () => { active = false; };
  }, []);

  // Exclude books already present in search results from Related
  const related = useMemo(() => {
    const shownIds = new Set(result.data.map((b) => b.id));
    return relatedRaw.filter((b) => !shownIds.has(b.id)).slice(0, 8);
  }, [relatedRaw, result.data]);

  // Sync URL when query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query); else params.delete("q");
    router.replace(`/search?${params.toString()}`);
  }, [query]);

  // Reset to page 1 when query changes
  useEffect(() => { setPage(1); }, [query]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="sticky top-16 z-40 bg-gradient-to-b from-white/80 to-transparent backdrop-blur supports-[backdrop-filter]:from-white/60">
        <div className="py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Search</h1>
          </div>
          <div className="max-w-2xl">
            <SearchBar initialQuery={initialQ} onChange={setQuery} onSubmit={(q) => setQuery(q)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start mt-2">
        <section>
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="text-neutral-600">{`Page ${page} of ${Math.max(1, Math.ceil(result.total / result.pageSize))}`}</div>
            <Pagination total={result.total} page={page} pageSize={result.pageSize} onPageChange={setPage} />
          </div>
          {loading ? (
            <div className="py-10 text-center text-neutral-600">Loading…</div>
          ) : result.data.length === 0 ? (
            <div className="py-10">
              <div className="text-center text-neutral-700">
                <div className="text-base">Couldn’t find that one yet — but the web is vast.</div>
                <div className="text-sm mt-1">Try a broader keyword or come back soon. We’re always indexing new sources.</div>
              </div>
              <div className="mt-4 max-w-xl mx-auto">
                <ContributeForm defaultTitle={query} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {result.data.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between py-4 text-sm">
            <div className="text-neutral-600">{`Page ${page} of ${Math.max(1, Math.ceil(result.total / result.pageSize))}`}</div>
            <Pagination total={result.total} page={page} pageSize={result.pageSize} onPageChange={setPage} />
          </div>
          {/* Extra sections */}
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-base font-medium mb-2">Related books</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {related.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-base font-medium mb-2">Popular</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popular.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-base font-medium mb-2">Trending</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trending.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
          </div>
        </section>
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3">
            <div className="rounded border bg-white p-3">
              <div className="font-medium">❤️ Support Knowledge Freedom</div>
              <p className="text-sm text-neutral-600 mt-1">Book Trace is maintained by volunteers who believe in open access.
              If you or your organization share our mission, consider sponsoring us — every contribution helps keep knowledge open and free for everyone.</p>
              <a
                href="#sponsor-us"
                className="mt-3 inline-flex items-center justify-center px-3 py-2 rounded border bg-black text-white text-sm hover:opacity-90"
              >
                Become a Sponsor
              </a>
            </div>
            <div className="rounded border bg-white p-3">
              <div className="font-medium mb-1">Quick Links</div>
              <ul className="text-sm text-neutral-700 list-disc list-inside space-y-1">
                <li><a className="hover:underline" href="https://github.com/opendev-society" target="_blank" rel="noreferrer">ODS GitHub</a></li>
                <li><a className="hover:underline" href="https://github.com" target="_blank" rel="noreferrer">Contribute</a></li>
              </ul>
            </div>
            <div id="sponsor-us" className="rounded border bg-white p-3">
              <div className="font-medium mb-2">Our Sponsors</div>
              <div className="grid grid-cols-1 gap-3">
                <a
                  href="https://github.com/opendev-society"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded border bg-white p-3 hover:border-black/40 transition"
                >
                  {/* eslint-disable @next/next/no-img-element */}
                  <img src="/ods-logo.svg" alt="Open Dev Society" className="h-10 w-10 rounded" />
                  <div className="flex-1">
                    <div className="font-medium leading-tight">Open Dev Society</div>
                    <div className="text-xs text-neutral-600">Platinum Sponsor — featured placement</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded border border-dashed bg-white p-3">
                  <div className="h-10 w-10 rounded bg-neutral-200" />
                  <div className="flex-1">
                    <div className="font-medium leading-tight">Your Brand Here</div>
                    <div className="text-xs text-neutral-600">Logo + name + optional tier label</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}


