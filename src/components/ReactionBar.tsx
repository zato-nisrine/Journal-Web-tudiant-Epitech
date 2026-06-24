"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REACTIONS } from "@/lib/utils";

type Comptes = Record<string, number>;

export default function ReactionBar({
  articleId,
  initialComptes,
  initialMaReaction,
  connecte,
}: {
  articleId: string;
  initialComptes: Comptes;
  initialMaReaction: string | null;
  connecte: boolean;
}) {
  const router = useRouter();
  const [comptes, setComptes] = useState<Comptes>(initialComptes);
  const [maReaction, setMaReaction] = useState<string | null>(initialMaReaction);
  const [enCours, setEnCours] = useState(false);

  async function reagir(type: string) {
    if (!connecte) {
      router.push("/connexion");
      return;
    }
    if (enCours) return;
    setEnCours(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const data = await res.json();
        setComptes(data.comptes);
        setMaReaction(data.maReaction);
      }
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {REACTIONS.map((r) => {
        const active = maReaction === r.type;
        return (
          <button
            key={r.type}
            onClick={() => reagir(r.type)}
            disabled={enCours}
            title={connecte ? r.label : "Connectez-vous pour réagir"}
            className={`flex items-center gap-2 border px-3 py-1.5 text-sm transition-all ${
              active
                ? "border-accent bg-accent text-white"
                : "border-ink bg-surface text-ink hover:border-accent hover:text-accent"
            } ${enCours ? "opacity-60" : ""}`}
          >
            <span className="kicker text-[11px]">{r.label}</span>
            <span className="font-semibold tabular-nums">{comptes[r.type] ?? 0}</span>
          </button>
        );
      })}
      {!connecte && (
        <span className="ml-1 text-xs text-muted">
          Connectez-vous pour réagir
        </span>
      )}
    </div>
  );
}
