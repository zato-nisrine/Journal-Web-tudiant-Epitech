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
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Devise du journal + recherche */}
      <section className="flex flex-col items-center gap-4 border-b-2 border-ink pb-6 text-center">
        <p className="kicker text-[11px] text-muted">
          Le journal étudiant — actualités · campus · culture
        </p>
        <p className="max-w-2xl font-display text-lg italic text-muted">
          « La vie étudiante d&apos;Epitech, racontée par ses étudiants. »
        </p>
        <div className="flex w-full justify-center">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Article à la une */}
      {aLaUne && (
        <section className="mt-8 border-b-2 border-ink pb-8" aria-label="Article à la une">
          <p className="kicker mb-4 text-xs text-accent">À la une</p>
          <Link
            href={`/articles/${aLaUne.slug}`}
            className="group grid items-center gap-6 md:grid-cols-2"
          >
            <div className="relative aspect-[1.9] overflow-hidden bg-rule md:order-2">
              {aLaUne.imageUrl ? (
                <Image
                  src={aLaUne.imageUrl}
                  alt={aLaUne.titre}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale-[15%] transition-all duration-500 group-hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-6xl font-black text-muted/40">
                  JE
                </div>
              )}
            </div>
            <div className="md:order-1">
              <p className="kicker text-[11px] text-accent">{aLaUne.categorie.nom}</p>
              <h2 className="mt-2 text-3xl font-black leading-tight transition-colors group-hover:text-accent sm:text-4xl">
                {aLaUne.titre}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">{aLaUne.extrait}</p>
              <p className="mt-4 text-sm text-muted">
                Par <span className="font-medium text-ink">{aLaUne.auteur.nom}</span> ·{" "}
                {formatDate(aLaUne.createdAt)}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Derniers articles */}
      <section className="mt-8" aria-label="Derniers articles">
        <div className="mb-6 flex items-baseline justify-between border-b border-rule pb-2">
          <h2 className="kicker text-sm">Derniers articles</h2>
          <Link href="/articles" className="kicker text-xs text-accent hover:text-accent-hover">
            Tout voir →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recents.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {recents.length === 0 && !aLaUne && (
          <p className="mt-6 text-muted">Aucun article publié pour le moment.</p>
        )}
      </section>

      {/* Catégories */}
      <section className="mt-12 border-t-2 border-ink pt-6" aria-label="Catégories">
        <h2 className="kicker mb-4 text-sm">Explorer par rubrique</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/articles?categorie=${c.slug}`}
              className="group inline-flex items-baseline gap-1.5 text-sm transition-colors hover:text-accent"
            >
              <span className="font-medium">{c.nom}</span>
              <span className="text-xs text-muted">({c._count.articles})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
