"use client";

import { useRouter } from "next/navigation";

export default function BoutonDeconnexion() {
  const router = useRouter();

  async function deconnecter() {
    await fetch("/api/auth/deconnexion", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={deconnecter}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    >
      Déconnexion
    </button>
  );
}
