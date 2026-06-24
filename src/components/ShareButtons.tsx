"use client";

import { useState } from "react";

export default function ShareButtons({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);

  function urlCourante() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function copierLien() {
    await navigator.clipboard.writeText(urlCourante());
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  function ouvrir(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  const u = () => encodeURIComponent(urlCourante());
  const t = encodeURIComponent(titre);

  const reseaux = [
    {
      label: "X / Twitter",
      icone: "𝕏",
      action: () => ouvrir(`https://twitter.com/intent/tweet?url=${u()}&text=${t}`),
    },
    {
      label: "Facebook",
      icone: "f",
      action: () => ouvrir(`https://www.facebook.com/sharer/sharer.php?u=${u()}`),
    },
    {
      label: "LinkedIn",
      icone: "in",
      action: () => ouvrir(`https://www.linkedin.com/sharing/share-offsite/?url=${u()}`),
    },
    {
      label: "WhatsApp",
      icone: "wa",
      action: () => ouvrir(`https://wa.me/?text=${t}%20${u()}`),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="kicker text-xs text-muted">Partager</span>
      {reseaux.map((r) => (
        <button
          key={r.label}
          onClick={r.action}
          title={`Partager sur ${r.label}`}
          aria-label={`Partager sur ${r.label}`}
          className="flex h-9 w-9 items-center justify-center border border-ink bg-surface text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {r.icone}
        </button>
      ))}
      <button
        onClick={copierLien}
        className="border border-ink bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {copie ? "Lien copié ✓" : "Copier le lien"}
      </button>
    </div>
  );
}
