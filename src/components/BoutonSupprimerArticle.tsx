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
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
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
      className="ml-3 text-xs font-semibold text-accent transition-colors hover:underline disabled:opacity-50"
    >
      {enCours ? "…" : "Supprimer"}
    </button>
  );
}
