"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTopicsSuggestions } from "../lib/supabase/topics";

type FilterSidebarProps = {
  initialAuthor?: string;
  initialLabels?: string[];
  initialTopics?: string[];
  initialTypes?: string[];
  onChange?: (filters: {
    author?: string;
    labels?: string[];
    topics?: string[];
    types?: string[];
  }) => void;
};

export function FilterSidebar({
  initialAuthor = "",
  initialLabels = [],
  initialTopics = [],
  initialTypes = [],
  onChange,
}: FilterSidebarProps) {
  const [author, setAuthor] = useState(initialAuthor);
  const [labels, setLabels] = useState<string[]>(initialLabels);
  const [topics, setTopics] = useState<string[]>(initialTopics);
  const [topicQuery, setTopicQuery] = useState("");
  const [topicOptions, setTopicOptions] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [types, setTypes] = useState<string[]>(initialTypes);

  useEffect(() => {
    onChange?.({ author, labels, topics, types });
  }, [author, labels, topics, types, onChange]);

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  // Debounced fetch for topic suggestions
  const debouncedFetch = useMemo(() => {
    let t: any;
    return (q: string) => {
      clearTimeout(t);
      t = setTimeout(async () => {
        setLoadingTopics(true);
        try {
          const suggestions = await fetchTopicsSuggestions(q);
          setTopicOptions(suggestions);
        } finally {
          setLoadingTopics(false);
        }
      }, 250);
    };
  }, []);

  useEffect(() => {
    debouncedFetch(topicQuery);
  }, [topicQuery, debouncedFetch]);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-600 mb-2">Author</div>
        <input
          className="w-full rounded border bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Filter by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-600 mb-2">Labels</div>
        <div className="flex flex-wrap gap-2">
          {['Free','Verified','Paid','Open Source'].map((l) => (
            <button
              key={l}
              className={`px-2 py-1 rounded border text-sm ${labels.includes(l) ? 'bg-black text-white border-black' : 'bg-white'}`}
              onClick={() => toggle(labels, setLabels, l)}
            >{l}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-600 mb-2">Types</div>
        <div className="flex flex-wrap gap-2">
          {['Free','Verified','Paid','Open Source'].map((t) => (
            <button
              key={t}
              className={`px-2 py-1 rounded border text-sm ${types.includes(t) ? 'bg-black text-white border-black' : 'bg-white'}`}
              onClick={() => toggle(types, setTypes, t)}
            >{t}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-600 mb-2">Topics</div>
        <div className="space-y-2">
          <input
            className="w-full rounded border bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Search topics…"
            value={topicQuery}
            onChange={(e) => setTopicQuery(e.target.value)}
          />
          <div className="max-h-40 overflow-auto rounded border bg-white divide-y">
            {loadingTopics ? (
              <div className="p-2 text-sm text-neutral-600">Loading…</div>
            ) : topicOptions.length === 0 ? (
              <div className="p-2 text-sm text-neutral-600">No topics</div>
            ) : (
              topicOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 p-2 text-sm">
                  <input
                    type="checkbox"
                    checked={topics.includes(opt)}
                    onChange={() => toggle(topics, setTopics, opt)}
                  />
                  <span className="truncate">{opt}</span>
                </label>
              ))
            )}
          </div>
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button key={t} className="px-2 py-0.5 rounded-full border bg-white text-xs" onClick={() => toggle(topics, setTopics, t)}>
                  {t} ×
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


