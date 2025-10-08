"use client";

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
};

export function Pagination({ total, page, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function go(to: number) {
    if (to < 1 || to > totalPages) return;
    onPageChange?.(to);
  }

  const pagesToShow = (() => {
    const pages: number[] = [];
    const max = Math.min(totalPages, 5);
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start + 1 < max) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

  return (
    <div className="inline-flex items-center gap-1 select-none">
      <button
        className="px-2 py-1 rounded border bg-white text-sm disabled:opacity-40"
        disabled={!canPrev}
        onClick={() => go(page - 1)}
      >
        Prev
      </button>
      {pagesToShow[0] > 1 && (
        <>
          <button className="px-2 py-1 rounded border bg-white text-sm" onClick={() => go(1)}>1</button>
          <span className="px-2 text-neutral-500">…</span>
        </>
      )}
      {pagesToShow.map((p) => (
        <button
          key={p}
          className={`px-2 py-1 rounded border text-sm ${p === page ? "bg-black text-white border-black" : "bg-white"}`}
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}
      {pagesToShow.at(-1)! < totalPages && (
        <>
          <span className="px-2 text-neutral-500">…</span>
          <button className="px-2 py-1 rounded border bg-white text-sm" onClick={() => go(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        className="px-2 py-1 rounded border bg-white text-sm disabled:opacity-40"
        disabled={!canNext}
        onClick={() => go(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}


