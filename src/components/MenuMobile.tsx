"use client";

import { useState } from "react";
import Link from "next/link";

type Lien = { href: string; label: string };

export default function MenuMobile({ liens }: { liens: Lien[] }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOuvert(!ouvert)}
        aria-label="Ouvrir le menu"
        aria-expanded={ouvert}
        className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {ouvert ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {ouvert && (
        <nav className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <ul className="flex flex-col gap-1">
            {liens.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  onClick={() => setOuvert(false)}
                  className="block rounded-lg px-3 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
