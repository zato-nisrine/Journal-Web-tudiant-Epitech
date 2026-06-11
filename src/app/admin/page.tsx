import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateCourte } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function TableauDeBord() {
  const [
    nbArticles,
    nbPublies,
    nbUtilisateurs,
    nbCommentaires,
    nbReactions,
    sommeVues,
    topArticles,
    derniersCommentaires,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { publie: true } }),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.reaction.count(),
    prisma.article.aggregate({ _sum: { vues: true } }),
    prisma.article.findMany({
      where: { publie: true },
      orderBy: { vues: "desc" },
      take: 5,
      select: { id: true, titre: true, slug: true, vues: true },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        auteur: { select: { nom: true } },
        article: { select: { titre: true, slug: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Articles", valeur: nbArticles, detail: `dont ${nbPublies} publiés` },
    { label: "Vues totales", valeur: sommeVues._sum.vues ?? 0, detail: "sur tous les articles" },
    { label: "Utilisateurs", valeur: nbUtilisateurs, detail: "comptes créés" },
    { label: "Commentaires", valeur: nbCommentaires, detail: `et ${nbReactions} réactions` },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-sm font-medium text-slate-400">{s.label}</p>
            <p className="mt-1 text-3xl font-black">{s.valeur}</p>
            <p className="mt-1 text-xs text-slate-400">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-bold">🏆 Articles les plus vus</h2>
          <ul className="mt-4 space-y-3">
            {topArticles.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 truncate">
                  <span className="font-bold text-slate-300 dark:text-slate-600">
                    {i + 1}.
                  </span>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="truncate hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                  >
                    {a.titre}
                  </Link>
                </span>
                <span className="shrink-0 text-slate-400">👁 {a.vues}</span>
              </li>
            ))}
            {topArticles.length === 0 && (
              <li className="text-sm text-slate-400">Aucun article publié.</li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-bold">💬 Derniers commentaires</h2>
          <ul className="mt-4 space-y-3">
            {derniersCommentaires.map((c) => (
              <li key={c.id} className="text-sm">
                <p className="line-clamp-2 text-slate-600 dark:text-slate-300">
                  « {c.contenu} »
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {c.auteur.nom} · {formatDateCourte(c.createdAt)} · sur{" "}
                  <Link
                    href={`/articles/${c.article.slug}`}
                    className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                  >
                    {c.article.titre}
                  </Link>
                </p>
              </li>
            ))}
            {derniersCommentaires.length === 0 && (
              <li className="text-sm text-slate-400">Aucun commentaire.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
