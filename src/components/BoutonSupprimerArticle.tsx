"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoutonSupprimerArticle({
  articleId,
  titre,
}: {
  articleId: string;
  titre: string;
}) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function supprimer() {
    if (!confirm(`Supprimer définitivement « ${titre} » ?`)) return;
    setEnCours(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else {
        const data = await res.json();
        alert(data.erreur ?? "La suppression a échoué");
      }
    } finally {
      setEnCours(false);
    }
  }

  return (
    <button
      onClick={supprimer}
      disabled={enCours}
      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/30"
    >
      {enCours ? "…" : "Supprimer"}
    </button>
  );
}
