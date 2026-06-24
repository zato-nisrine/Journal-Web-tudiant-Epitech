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
    topArticles,
    derniersCommentaires,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { publie: true } }),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.reaction.count(),
    prisma.article.findMany({
      where: { publie: true },
      orderBy: { reactions: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        titre: true,
        slug: true,
        _count: { select: { reactions: true } },
      },
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
    { label: "Utilisateurs", valeur: nbUtilisateurs, detail: "comptes créés" },
    { label: "Commentaires", valeur: nbCommentaires, detail: "au total" },
    { label: "Réactions", valeur: nbReactions, detail: "au total" },
  ];

  return (
    <div>
      <div className="grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface p-5">
            <p className="kicker text-[11px] text-muted">{s.label}</p>
            <p className="mt-1 font-display text-4xl font-black">{s.valeur}</p>
            <p className="mt-1 text-xs text-muted">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-ink bg-surface p-5">
          <h2 className="kicker text-xs text-accent">Articles les plus populaires</h2>
          <ul className="mt-4 divide-y divide-rule">
            {topArticles.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="flex items-center gap-2 truncate">
                  <span className="font-display font-bold text-muted">{i + 1}.</span>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="truncate hover:text-accent hover:underline"
                  >
                    {a.titre}
                  </Link>
                </span>
                <span className="shrink-0 text-muted">{a._count.reactions} réactions</span>
              </li>
            ))}
            {topArticles.length === 0 && (
              <li className="py-2 text-sm text-muted">Aucun article publié.</li>
            )}
          </ul>
        </section>

        <section className="border border-ink bg-surface p-5">
          <h2 className="kicker text-xs text-accent">Derniers commentaires</h2>
          <ul className="mt-4 divide-y divide-rule">
            {derniersCommentaires.map((c) => (
              <li key={c.id} className="py-2 text-sm">
                <p className="line-clamp-2 italic text-ink">« {c.contenu} »</p>
                <p className="mt-0.5 text-xs text-muted">
                  {c.auteur.nom} · {formatDateCourte(c.createdAt)} · sur{" "}
                  <Link
                    href={`/articles/${c.article.slug}`}
                    className="hover:text-accent hover:underline"
                  >
                    {c.article.titre}
                  </Link>
                </p>
              </li>
            ))}
            {derniersCommentaires.length === 0 && (
              <li className="py-2 text-sm text-muted">Aucun commentaire.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
