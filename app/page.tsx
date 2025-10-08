"use client";

import Link from "next/link";
import { SearchBar } from "../components/SearchBar";
import Lottie from "lottie-react";
import booksAnimation from "../public/books-animation.json";
import { useEffect, useState } from "react";
import { BookCard } from "../components/BookCard";
import type { Book } from "../lib/types";
import { fetchNewBooks, fetchPopularBooks, fetchTrendingBooks } from "../lib/supabase/books";

export default function Home() {
  const [popular, setPopular] = useState<Book[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);
  const [recent, setRecent] = useState<Book[]>([]);

  useEffect(() => {
    fetchNewBooks(10).then(setRecent).catch(console.error);
    fetchPopularBooks(10).then(setPopular).catch(console.error);
    fetchTrendingBooks(10).then(setTrending).catch(console.error);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">Find every book. Everywhere.</h1>
          <p className="mt-3 text-neutral-700">Discover books from across the web — free, verified, and open. Book Trace helps you connect with knowledge, not ads.</p>
          <div className="mt-6 max-w-2xl">
            <SearchBar
              placeholder="Search by title, author, or topic…"
              size="lg"
              showSubmitButton
              onSubmit={(q: string) => q && window.location.assign(`/search?q=${encodeURIComponent(q)}`)}
            />
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-700">
              <Link href="#" className="hidden md:block rounded-full border bg-white px-2 py-1">📚 Browse Categories</Link>
              <Link href="#" className="hidden md:block rounded-full border bg-white px-2 py-1">✍️ Explore Authors</Link>
              <Link href="#" className="hidden md:block rounded-full border bg-white px-3 py-1">🆓 Free Books</Link>
              <Link href="#" className="hidden md:block rounded-full border bg-white px-3 py-1">✅ Verified Sources</Link>
            </div>
            <div className="mt-4 flex justify-center md:justify-start items-center gap-4">
              <Link href="/library" className="font-bold rounded-full text-sm border border-2 bg-black text-white px-5 py-3">Explore library →</Link>
              <Link href="/library#contribute" className="font-bold rounded-full text-sm border border-black text-black px-5 py-3">Contribute →</Link>
            </div>
          </div>
          <div className="mt-4">
            Initiative by 
            <p  className="text-teal-500 relative inline-flex items-center justify-center text-lg sm:text-lg px-2 py-1.5 rounded-md font-bold">
              Open Dev Society
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto h-48 sm:h-64 lg:h-80 max-w-md">
            <Lottie
              animationData={booksAnimation}
              loop={true}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Sponsors section */}
      <section className="mt-12">
        <div className="w-full">
          <div className="mb-4 text-center">
            <h2 className="text-base sm:text-lg font-medium">Our Sponsors</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 sm:gap-20">
            <a
              href="https://github.com/opendev-society"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 opacity-90 hover:opacity-100 transition-transform duration-200 hover:scale-[1.03]"
              aria-label="Open Dev Society"
            >
              {/* eslint-disable @next/next/no-img-element */}
              <img src="/ods-logo.svg" alt="Open Dev Society" className="h-10 sm:h-12 w-auto object-contain" />
              <div className="leading-tight">
                <div className="text-base sm:text-lg font-semibold">Open Dev Society</div>
                <div className="text-xs text-neutral-600">Platinum Sponsor</div>
              </div>
            </a>

            <div className="group flex items-center gap-4 opacity-90 transition-transform duration-200 group-hover:opacity-100 group-hover:scale-[1.03]">
              <div className="h-10 sm:h-12 w-[120px] sm:w-[140px] rounded bg-white border border-dashed flex items-center justify-center text-xs text-neutral-500">Your Brand Here</div>
              <div className="leading-tight">
                <div className="text-base sm:text-lg font-semibold">Your Brand Here</div>
                <div className="text-xs text-neutral-600">Sponsor tier</div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="#sponsor-us"
              className="inline-flex items-center justify-center px-4 py-2 rounded border bg-black text-white text-sm hover:opacity-90"
            >
              Sponsor Us
            </a>
          </div>
        </div>
      </section>

      {/* Newly Added, Popular and Trending sections */}
      <section className="mt-12 space-y-10">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-medium">Newly Added</h3>
            <div className="flex items-center gap-2">
              <button className="rounded border bg-white px-2 py-1 text-sm" onClick={() => {
                const el = document.getElementById('recent-row');
                el?.scrollBy({ left: -300, behavior: 'smooth' });
              }}>{"←"}</button>
              <button className="rounded border bg-white px-2 py-1 text-sm" onClick={() => {
                const el = document.getElementById('recent-row');
                el?.scrollBy({ left: 300, behavior: 'smooth' });
              }}>{"→"}</button>
            </div>
          </div>
          <div id="recent-row" className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory">
            {recent.map((b) => (
              <div key={b.id} className="min-w-[160px] snap-start">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-medium">Popular Books</h3>
            <div className="flex items-center gap-2">
              <button className="rounded border bg-white px-2 py-1 text-sm" onClick={() => {
                const el = document.getElementById('popular-row');
                el?.scrollBy({ left: -300, behavior: 'smooth' });
              }}>{"←"}</button>
              <button className="rounded border bg-white px-2 py-1 text-sm" onClick={() => {
                const el = document.getElementById('popular-row');
                el?.scrollBy({ left: 300, behavior: 'smooth' });
              }}>{"→"}</button>
            </div>
          </div>
          <div id="popular-row" className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory">
            {popular.map((b) => (
              <div key={b.id} className="min-w-[160px] snap-start">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-medium">Trending Books</h3>
            <div className="flex items-center gap-2">
              <button className="rounded border bg-white px-2 py-1 text-sm" onClick={() => {
                const el = document.getElementById('trending-row');
                el?.scrollBy({ left: -300, behavior: 'smooth' });
              }}>{"←"}</button>
              <button className="rounded border bg-white px-2 py-1 text-sm" onClick={() => {
                const el = document.getElementById('trending-row');
                el?.scrollBy({ left: 300, behavior: 'smooth' });
              }}>{"→"}</button>
            </div>
          </div>
          <div id="trending-row" className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory">
            {trending.map((b) => (
              <div key={b.id} className="min-w-[160px] snap-start">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
