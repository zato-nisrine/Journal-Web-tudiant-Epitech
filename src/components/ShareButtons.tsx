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
      icone: "🟢",
      action: () => ouvrir(`https://wa.me/?text=${t}%20${u()}`),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Partager :
      </span>
      {reseaux.map((r) => (
        <button
          key={r.label}
          onClick={r.action}
          title={`Partager sur ${r.label}`}
          aria-label={`Partager sur ${r.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {r.icone}
        </button>
      ))}
      <button
        onClick={copierLien}
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        {copie ? "✓ Lien copié !" : "🔗 Copier le lien"}
      </button>
    </div>
  );
}
