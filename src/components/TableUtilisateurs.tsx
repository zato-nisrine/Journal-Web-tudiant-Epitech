"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateCourte, LABELS_ROLES } from "@/lib/utils";

type Utilisateur = {
  id: string;
  nom: string;
  email: string;
  role: string;
  createdAt: string | Date;
  _count: { articles: number; commentaires: number };
};

export default function TableUtilisateurs({
  utilisateurs: initiaux,
  monId,
}: {
  utilisateurs: Utilisateur[];
  monId: string;
}) {
  const router = useRouter();
  const [utilisateurs, setUtilisateurs] = useState(initiaux);
  const [erreur, setErreur] = useState("");

  async function changerRole(id: string, role: string) {
    setErreur("");
    const res = await fetch(`/api/utilisateurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErreur(data.erreur ?? "Le changement de rôle a échoué");
      return;
    }
    setUtilisateurs((u) =>
      u.map((x) => (x.id === id ? { ...x, role: data.utilisateur.role } : x))
    );
    router.refresh();
  }

  async function supprimer(u: Utilisateur) {
    setErreur("");
    if (
      !confirm(
        `Supprimer le compte de ${u.nom} ? Ses articles et commentaires seront aussi supprimés.`
      )
    )
      return;
    const res = await fetch(`/api/utilisateurs/${u.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setErreur(data.erreur ?? "La suppression a échoué");
      return;
    }
    setUtilisateurs((liste) => liste.filter((x) => x.id !== u.id));
    router.refresh();
  }

  return (
    <div>
      {erreur && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {erreur}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[700px] bg-white text-sm dark:bg-slate-800">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Activité</th>
              <th className="px-4 py-3">Inscription</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => {
              const moi = u.id === monId;
              return (
                <tr
                  key={u.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-700/50"
                >
                  <td className="px-4 py-3 font-semibold">
                    {u.nom}
                    {moi && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        vous
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    {moi ? (
                      <span className="font-medium">{LABELS_ROLES[u.role]}</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => changerRole(u.id, e.target.value)}
                        aria-label={`Rôle de ${u.nom}`}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700"
                      >
                        <option value="LECTEUR">Lecteur</option>
                        <option value="REDACTEUR">Rédacteur</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                    📝 {u._count.articles} · 💬 {u._count.commentaires}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatDateCourte(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!moi && (
                      <button
                        onClick={() => supprimer(u)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
