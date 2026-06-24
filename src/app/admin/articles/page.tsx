import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDateCourte } from "@/lib/utils";
import BoutonSupprimerArticle from "@/components/BoutonSupprimerArticle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Gestion des articles" };

export default async function GestionArticles() {
  const utilisateur = (await getCurrentUser())!;

  // Un rédacteur gère ses articles ; un admin les gère tous
  const articles = await prisma.article.findMany({
    where: utilisateur.role === "ADMIN" ? {} : { auteurId: utilisateur.id },
    orderBy: { createdAt: "desc" },
    include: {
      auteur: { select: { nom: true } },
      categorie: { select: { nom: true } },
      _count: { select: { commentaires: true, reactions: true } },
    },
  });

  return (
    <div>
      <h2 className="font-display text-xl font-bold">
        {utilisateur.role === "ADMIN" ? "Tous les articles" : "Mes articles"}{" "}
        <span className="text-muted">({articles.length})</span>
      </h2>

      <div className="mt-4 overflow-x-auto border border-ink">
        <table className="w-full min-w-[700px] bg-surface text-sm">
          <thead>
            <tr className="kicker border-b-2 border-ink text-left text-[10px] text-muted">
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Auteur</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Stats</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-rule last:border-0">
                <td className="max-w-64 px-4 py-3">
                  <Link
                    href={`/articles/${a.slug}`}
                    className="line-clamp-1 font-semibold hover:text-accent hover:underline"
                  >
                    {a.aLaUne && <span className="text-accent">★ </span>}
                    {a.titre}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{a.categorie.nom}</td>
                <td className="px-4 py-3 text-muted">{a.auteur.nom}</td>
                <td className="px-4 py-3">
                  {a.publie ? (
                    <span className="kicker text-[10px] text-accent">Publié</span>
                  ) : (
                    <span className="kicker text-[10px] text-muted">Brouillon</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                  {a._count.commentaires} comm. · {a._count.reactions} réac.
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {formatDateCourte(a.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${a.id}/modifier`}
                    className="text-xs font-semibold text-accent transition-colors hover:underline"
                  >
                    Modifier
                  </Link>
                  <BoutonSupprimerArticle articleId={a.id} titre={a.titre} />
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  Aucun article pour le moment.{" "}
                  <Link href="/admin/articles/nouveau" className="font-semibold text-accent hover:underline">
                    Écrire le premier
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
