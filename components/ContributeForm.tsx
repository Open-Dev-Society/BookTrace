"use client";

import { useState } from "react";

type ContributeFormProps = {
  defaultTitle?: string;
};

export function ContributeForm({ defaultTitle = "" }: ContributeFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded border bg-white p-3">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen((v) => !v)}>
        <div className="font-medium">Contribute a book</div>
        <div className="text-sm underline">{open ? "Hide" : "Open"}</div>
      </div>
      {open && (
        <div className="mt-3">
          {defaultTitle && (
            <div className="text-sm text-neutral-700 mb-3">Help us add "{defaultTitle}" to our library.</div>
          )}
          <div className="w-full">
            <iframe
              src="https://tally.so/embed/wa7vGZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              width="100%"
              height="600"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Contribute to Book Trace"
            />
          </div>
        </div>
      )}
    </div>
  );
}
