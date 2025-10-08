"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b border-[oklch(0.928_0.006_264.531)] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-black" />
          <span className="font-semibold tracking-tight">Book Trace</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://github.com/opendev-society" target="_blank" rel="noreferrer">GitHub</a>
          <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://discord.gg/" target="_blank" rel="noreferrer">Discord</a>
          <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://x.com/" target="_blank" rel="noreferrer">X</a>
          <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded border px-3 py-1 text-sm"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </header>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 w-full bg-white shadow-xl p-4 flex flex-col gap-3 overflow-y-auto min-h-screen">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button className="rounded border px-2 py-1 text-sm" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="h-px bg-neutral-200" />
            <Link href="/" className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/library" className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" onClick={() => setOpen(false)}>Library</Link>
            <a href="#sponsor-us" className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" onClick={() => setOpen(false)}>Sponsor Us</a>
            <div className="mt-2 text-xs uppercase tracking-wide text-neutral-600">Quick Links</div>
            <a className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://github.com/opendev-society" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>ODS GitHub</a>
            <a className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://discord.gg/" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Discord</a>
            <a className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://x.com/" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Twitter</a>
            <a className="py-1 relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="/library#contribute" onClick={() => setOpen(false)}>Contribute</a>
            <div className="h-px bg-neutral-200 my-2" />
            <div className="text-xs uppercase tracking-wide text-neutral-600">Our Sponsor</div>
            <a
              href="https://github.com/opendev-society"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded border bg-white p-3"
            >
              {/* eslint-disable @next/next/no-img-element */}
              <img src="/ods-logo.svg" alt="Open Dev Society" className="h-8 w-auto object-contain" />
              <div className="leading-tight">
                <div className="text-sm font-medium">Open Dev Society</div>
                <div className="text-xs text-neutral-600">Platinum Sponsor</div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


