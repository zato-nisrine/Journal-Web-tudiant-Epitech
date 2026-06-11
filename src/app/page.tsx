import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

const selectionListe = {
  id: true,
  titre: true,
  slug: true,
  extrait: true,
  imageUrl: true,
  aLaUne: true,
  vues: true,
  createdAt: true,
  auteur: { select: { id: true, nom: true } },
  categorie: { select: { id: true, nom: true, slug: true } },
  _count: { select: { commentaires: true, reactions: true } },
} as const;

export default async function Accueil() {
  const [aLaUne, categories] = await Promise.all([
    prisma.article.findFirst({
      where: { publie: true, aLaUne: true },
      orderBy: { createdAt: "desc" },
      select: selectionListe,
    }),
    prisma.category.findMany({
      orderBy: { nom: "asc" },
      include: { _count: { select: { articles: { where: { publie: true } } } } },
    }),
  ]);

  const recents = await prisma.article.findMany({
    where: { publie: true, ...(aLaUne ? { id: { not: aLaUne.id } } : {}) },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: selectionListe,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Bandeau d'introduction + recherche */}
      <section className="text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
          La vie étudiante d&apos;Epitech,
          <br />
          <span className="text-blue-600 dark:text-blue-400">racontée par ses étudiants.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
          Actualités de l&apos;école, événements, interviews, projets et bons plans :
          tout ce qui fait vibrer le campus, au même endroit.
        </p>
        <div className="mt-6 flex justify-center">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Article à la une */}
      {aLaUne && (
        <section className="mt-12" aria-label="Article à la une">
          <Link
            href={`/articles/${aLaUne.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="relative aspect-[1.9] md:aspect-auto md:min-h-72">
              {aLaUne.imageUrl ? (
                <Image
                  src={aLaUne.imageUrl}
                  alt={aLaUne.titre}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700" />
              )}
            </div>
            <div className="flex flex-col justify-center p-8">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-amber-400 px-2.5 py-0.5 font-bold text-amber-950">
                  ⭐ À la une
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {aLaUne.categorie.nom}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-tight transition-colors group-hover:text-blue-600 sm:text-3xl dark:group-hover:text-blue-400">
                {aLaUne.titre}
              </h2>
              <p className="mt-3 line-clamp-3 text-slate-500 dark:text-slate-400">
                {aLaUne.extrait}
              </p>
              <p className="mt-5 text-sm text-slate-400">
                {aLaUne.auteur.nom} · {formatDate(aLaUne.createdAt)} · 💬{" "}
                {aLaUne._count.commentaires} · ❤️ {aLaUne._count.reactions}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Derniers articles */}
      <section className="mt-14" aria-label="Derniers articles">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Derniers articles</h2>
          <Link
            href="/articles"
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Tout voir →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recents.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {recents.length === 0 && !aLaUne && (
          <p className="mt-6 text-slate-400">Aucun article publié pour le moment.</p>
        )}
      </section>

      {/* Catégories */}
      <section className="mt-14" aria-label="Catégories">
        <h2 className="text-2xl font-bold">Explorer par catégorie</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/articles?categorie=${c.slug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-blue-300"
            >
              {c.nom}
              <span className="ml-1.5 text-xs text-slate-400">
                {c._count.articles}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
