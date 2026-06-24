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
      <h2 className="kicker text-sm">
        Commentaires{" "}
        <span className="text-muted">({commentaires.length})</span>
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
            className="w-full resize-y border border-ink bg-surface p-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          />
          {erreur && <p className="mt-1 text-sm text-accent">{erreur}</p>}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted">
              Connecté en tant que {utilisateur.nom}
            </span>
            <button
              type="submit"
              disabled={envoi || contenu.trim().length < 2}
              className="bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {envoi ? "Envoi…" : "Publier"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 border border-dashed border-rule p-4 text-sm text-muted">
          <Link href="/connexion" className="font-semibold text-accent hover:underline">
            Connectez-vous
          </Link>{" "}
          pour rejoindre la discussion.
        </p>
      )}

      <ul className="mt-6 divide-y divide-rule border-t border-rule">
        {commentaires.map((c) => (
          <li key={c.id} className="py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-ink font-display text-sm font-bold text-ink">
                  {c.auteur.nom.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {c.auteur.nom}
                    {c.auteur.role !== "LECTEUR" && (
                      <span className="kicker ml-2 text-[10px] text-accent">
                        {LABELS_ROLES[c.auteur.role]}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{formatDate(c.createdAt)}</p>
                </div>
              </div>
              {peutSupprimer(c) && (
                <button
                  onClick={() => supprimer(c.id)}
                  title="Supprimer le commentaire"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Supprimer
                </button>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {c.contenu}
            </p>
          </li>
        ))}
        {commentaires.length === 0 && (
          <li className="py-4 text-sm text-muted">
            Aucun commentaire pour le moment. Soyez le premier à réagir !
          </li>
        )}
      </ul>
    </section>
  );
}
