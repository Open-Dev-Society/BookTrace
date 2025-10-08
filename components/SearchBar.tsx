"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchSuggestions, type Suggestion } from "../lib/supabase/suggestions";

type SearchBarProps = {
  initialQuery?: string;
  placeholder?: string;
  debounceMs?: number;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  size?: "md" | "lg";
  showSubmitButton?: boolean;
};

export function SearchBar({
  initialQuery = "",
  placeholder = "Search by title, author, ISBN, or topic",
  debounceMs = 300,
  onChange,
  onSubmit,
  size = "md",
  showSubmitButton = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const debounced = useMemo(() => {
    let timeout: any;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => onChange?.(val), debounceMs);
    };
  }, [onChange, debounceMs]);

  useEffect(() => {
    debounced(value);
  }, [value, debounced]);

  // live suggestions (non-invasive)
  useEffect(() => {
    let active = true;
    if (!value.trim()) {
      setItems([]);
      return;
    }
    setLoading(true);
    fetchSuggestions(value).then((res) => {
      if (!active) return;
      setItems(res);
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative group">
        <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-shadow" />
        <input
          className={`relative w-full rounded-[10px] border border-[oklch(0.928_0.006_264.531)] bg-white outline-none focus:ring-2 focus:ring-black/10 ${size === "lg" ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) {
              onSubmit(value);
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          aria-label="Search books"
        />
        {showSubmitButton && (
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md border bg-black text-white text-lg px-3 py-1 hover:opacity-90"
            onClick={() => onSubmit?.(value)}
          >
            →
          </button>
        )}
        {open && (items.length > 0 || loading) && (
          <div className="absolute z-50 mt-1 w-full rounded border bg-white shadow-sm">
            {loading ? (
              <div className="p-2 text-sm text-neutral-600">Searching…</div>
            ) : (
              <ul className="max-h-64 overflow-auto">
                {items.map((it, idx) => (
                  <li
                    key={`${it.kind}-${it.value}-${idx}`}
                    className="px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      onSubmit?.(it.value);
                      setOpen(false);
                    }}
                  >
                    <span className="text-neutral-500 text-xs uppercase">{it.kind}</span>
                    <span className="truncate">{it.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


