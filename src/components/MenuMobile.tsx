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
        className="p-2 text-ink hover:text-accent"
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
        <nav className="absolute left-0 right-0 top-full z-50 border-y-2 border-ink bg-paper px-4 py-3">
          <ul className="flex flex-col divide-y divide-rule">
            {liens.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  onClick={() => setOuvert(false)}
                  className="kicker block py-3 text-sm text-ink hover:text-accent"
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
