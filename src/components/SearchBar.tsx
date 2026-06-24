"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function rechercher(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    params.delete("page");
    router.push(`/articles?${params.toString()}`);
  }

  return (
    <form onSubmit={rechercher} className="relative w-full max-w-xl">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un article, un mot-clé…"
        aria-label="Rechercher"
        className="w-full border border-ink bg-surface py-2.5 pl-4 pr-12 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute right-0 top-0 h-full bg-ink px-3 text-paper transition-colors hover:bg-accent"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
