import Link from "next/link";
import type { Book } from "../lib/types";
import { SourceBadge } from "./SourceBadge";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const primarySource = book.sources[0];
  return (
    <Link href={`/book/${book.id}`} className="group block rounded border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow will-change-transform hover:-translate-y-[2px] hover:[transform:perspective(800px)_rotateX(1deg)]">
      <div className="aspect-[3/4] bg-neutral-100 relative">
        {book.coverUrl ? (
          /* eslint-disable @next/next/no-img-element */
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-neutral-400 text-sm">No cover</div>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_0_0_rgba(0,0,0,0.0)] group-hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]" />
      </div>
      <div className="p-3 space-y-1">
        <div className="font-medium leading-tight line-clamp-2 group-hover:underline">{book.title}</div>
        <div className="text-sm text-neutral-600 line-clamp-1">{book.author ?? "Unknown author"}</div>
        {primarySource && (
          <div className="pt-1">
            <SourceBadge label={primarySource.type ?? primarySource.sourceName} verified={primarySource.verified} />
          </div>
        )}
      </div>
    </Link>
  );
}


