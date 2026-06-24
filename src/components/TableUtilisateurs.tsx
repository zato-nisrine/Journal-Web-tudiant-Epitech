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
        <p className="mb-4 border-l-2 border-accent bg-accent/5 p-3 text-sm font-medium text-accent">
          {erreur}
        </p>
      )}
      <div className="overflow-x-auto border border-ink">
        <table className="w-full min-w-[700px] bg-surface text-sm">
          <thead>
            <tr className="kicker border-b-2 border-ink text-left text-[10px] text-muted">
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
                <tr key={u.id} className="border-b border-rule last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {u.nom}
                    {moi && (
                      <span className="kicker ml-2 text-[10px] text-accent">vous</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    {moi ? (
                      <span className="font-medium">{LABELS_ROLES[u.role]}</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => changerRole(u.id, e.target.value)}
                        aria-label={`Rôle de ${u.nom}`}
                        className="border border-ink bg-surface px-2 py-1 text-sm"
                      >
                        <option value="LECTEUR">Lecteur</option>
                        <option value="REDACTEUR">Rédacteur</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                    {u._count.articles} articles · {u._count.commentaires} comm.
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDateCourte(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!moi && (
                      <button
                        onClick={() => supprimer(u)}
                        className="text-xs font-semibold text-accent transition-colors hover:underline"
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
