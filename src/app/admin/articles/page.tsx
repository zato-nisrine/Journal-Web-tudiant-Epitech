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
      <h2 className="text-lg font-bold">
        {utilisateur.role === "ADMIN" ? "Tous les articles" : "Mes articles"}{" "}
        <span className="text-slate-400">({articles.length})</span>
      </h2>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[700px] bg-white text-sm dark:bg-slate-800">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
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
              <tr
                key={a.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-700/50"
              >
                <td className="max-w-64 px-4 py-3">
                  <Link
                    href={`/articles/${a.slug}`}
                    className="line-clamp-1 font-semibold hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                  >
                    {a.aLaUne && "⭐ "}
                    {a.titre}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {a.categorie.nom}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {a.auteur.nom}
                </td>
                <td className="px-4 py-3">
                  {a.publie ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Publié
                    </span>
                  ) : (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                      Brouillon
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                  👁 {a.vues} · 💬 {a._count.commentaires} · ❤️ {a._count.reactions}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400">
                  {formatDateCourte(a.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${a.id}/modifier`}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    Modifier
                  </Link>
                  <BoutonSupprimerArticle articleId={a.id} titre={a.titre} />
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Aucun article pour le moment.{" "}
                  <Link href="/admin/articles/nouveau" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
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
