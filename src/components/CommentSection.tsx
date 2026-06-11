"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, LABELS_ROLES } from "@/lib/utils";

type Commentaire = {
  id: string;
  contenu: string;
  createdAt: string | Date;
  auteur: { id: string; nom: string; role: string };
};

type Utilisateur = { id: string; nom: string; role: string } | null;

export default function CommentSection({
  articleId,
  initialCommentaires,
  utilisateur,
}: {
  articleId: string;
  initialCommentaires: Commentaire[];
  utilisateur: Utilisateur;
}) {
  const [commentaires, setCommentaires] = useState(initialCommentaires);
  const [contenu, setContenu] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function publier(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/commentaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? "Une erreur est survenue");
        return;
      }
      setCommentaires([data.commentaire, ...commentaires]);
      setContenu("");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    const res = await fetch(`/api/commentaires/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCommentaires(commentaires.filter((c) => c.id !== id));
    }
  }

  const peutSupprimer = (c: Commentaire) =>
    utilisateur && (utilisateur.role === "ADMIN" || utilisateur.id === c.auteur.id);

  return (
    <section aria-label="Commentaires">
      <h2 className="text-xl font-bold">
        Commentaires{" "}
        <span className="text-slate-400">({commentaires.length})</span>
      </h2>

      {utilisateur ? (
        <form onSubmit={publier} className="mt-4">
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Partagez votre avis…"
            rows={3}
            maxLength={1000}
            required
            className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-blue-900"
          />
          {erreur && <p className="mt-1 text-sm text-red-600">{erreur}</p>}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Connecté en tant que {utilisateur.nom}
            </span>
            <button
              type="submit"
              disabled={envoi || contenu.trim().length < 2}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {envoi ? "Envoi…" : "Publier"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          <Link href="/connexion" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Connectez-vous
          </Link>{" "}
          pour rejoindre la discussion.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {commentaires.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {c.auteur.nom.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {c.auteur.nom}
                    {c.auteur.role !== "LECTEUR" && (
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                        {LABELS_ROLES[c.auteur.role]}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(c.createdAt)}</p>
                </div>
              </div>
              {peutSupprimer(c) && (
                <button
                  onClick={() => supprimer(c.id)}
                  title="Supprimer le commentaire"
                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline"
                >
                  Supprimer
                </button>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {c.contenu}
            </p>
          </li>
        ))}
        {commentaires.length === 0 && (
          <li className="text-sm text-slate-400">
            Aucun commentaire pour le moment. Soyez le premier à réagir !
          </li>
        )}
      </ul>
    </section>
  );
}
