"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchBar } from "../../components/SearchBar";
import { FilterSidebar } from "../../components/FilterSidebar";
import { Pagination } from "../../components/Pagination";
import { BookCard } from "../../components/BookCard";
import type { Book, PaginatedResult, SearchFilters } from "../../lib/types";
import { ContributeForm } from "../../components/ContributeForm";
import { fetchBooks } from "../../lib/supabase/books";
import { useSearchParams, useRouter } from "next/navigation";

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = useMemo(() => searchParams.get("q") ?? "", [searchParams]);

  const [query, setQuery] = useState(initialQ);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<Book>>({ data: [], total: 0, page: 1, pageSize: 50 });
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBooks({ query, filters, page, pageSize: 50 });
      setResult(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query, filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query); else params.delete("q");
    router.replace(`/library?${params.toString()}`);
  }, [query]);

  // Reset to page 1 when query/filters change
  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 items-start">
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3">
            <div className="text-xs uppercase tracking-wide text-neutral-600">Filters</div>
            <div className="rounded border bg-white p-3">
              <FilterSidebar onChange={setFilters} />
            </div>
          </div>
        </aside>

        <section>
          <div className="sticky top-16 z-40 bg-gradient-to-b from-white/80 to-transparent backdrop-blur supports-[backdrop-filter]:from-white/60">
            <div className="py-3 transition-[padding,transform] [@supports(backdrop-filter:blur(0))]:backdrop-blur">
              <div className="mb-2 text-xs font-medium tracking-wide text-neutral-700">Browse the library</div>
              <div className="max-w-2xl">
                <SearchBar initialQuery={initialQ} onChange={setQuery} />
              </div>
            </div>
          </div>

          {/* Mobile filter section */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 px-4 py-2 rounded border bg-white text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                Show Filters
              </button>
              <a
                href="#sponsor-us"
                className="px-4 py-2 rounded border bg-black text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Become a Sponsor
              </a>
            </div>
          </div>

          {/* Full-page filter modal */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white">
              <div className="flex flex-col h-full">
                {/* Header with back button */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
                  >
                    <span>←</span>
                    Back
                  </button>
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="w-12" /> {/* Spacer for centering */}
                </div>

                {/* Filter content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <FilterSidebar onChange={setFilters} />
                </div>

                {/* Bottom action buttons */}
                <div className="p-4 border-t border-neutral-200 bg-white">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setFilters({});
                        setShowMobileFilters(false);
                      }}
                      className="flex-1 px-4 py-3 rounded border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 px-4 py-3 rounded border bg-black text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Show Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <li><a className="hover:underline" href="#contribute">Contribute</a></li>
              </ul>
            </div>
            <div id="contribute">
              <ContributeForm />
            </div>
            <div id="sponsor-us" className="rounded border bg-white p-3">
              <div className="font-medium mb-2">Our Sponsors</div>
              {/* Mock placement showcasing brand tile */}
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
                {/* Example placeholder for additional sponsors */}
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


