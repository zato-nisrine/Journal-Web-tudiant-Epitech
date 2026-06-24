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
      className="font-medium text-muted transition-colors hover:text-accent"
    >
      Déconnexion
    </button>
  );
}
