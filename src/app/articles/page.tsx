import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tous les articles",
  description: "Parcourez, recherchez et filtrez tous les articles du journal.",
};

const ARTICLES_PAR_PAGE = 9;

const TRIS = [
  { valeur: "recent", label: "Plus récents" },
  { valeur: "populaire", label: "Plus populaires" },
  { valeur: "commentes", label: "Plus commentés" },
];

type SearchParams = Promise<{
  q?: string;
  categorie?: string;
  tri?: string;
  page?: string;
}>;

export default async function PageArticles({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categorie = params.categorie ?? "";
  const tri = params.tri ?? "recent";
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.ArticleWhereInput = { publie: true };
  if (categorie) where.categorie = { slug: categorie };
  if (q) {
    where.OR = [
      { titre: { contains: q, mode: "insensitive" } },
      { extrait: { contains: q, mode: "insensitive" } },
      { contenu: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ArticleOrderByWithRelationInput =
    tri === "populaire"
      ? { reactions: { _count: "desc" } }
      : tri === "commentes"
        ? { commentaires: { _count: "desc" } }
        : { createdAt: "desc" };

  const [articles, total, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * ARTICLES_PAR_PAGE,
      take: ARTICLES_PAR_PAGE,
      select: {
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
      },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { nom: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PAR_PAGE));
  const categorieActive = categories.find((c) => c.slug === categorie);

  function lienFiltre(modifs: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const courants: Record<string, string | undefined> = { q, categorie, tri, ...modifs };
    for (const [cle, valeur] of Object.entries(courants)) {
      if (valeur && !(cle === "tri" && valeur === "recent")) p.set(cle, valeur);
    }
    const qs = p.toString();
    return qs ? `/articles?${qs}` : "/articles";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">
        {categorieActive ? categorieActive.nom : "Tous les articles"}
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {total} article{total > 1 ? "s" : ""}
        {q && (
          <>
            {" "}pour la recherche « <span className="font-semibold">{q}</span> »
          </>
        )}
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Filtres par catégorie */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={lienFiltre({ categorie: undefined })}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !categorie
              ? "bg-blue-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          Toutes
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={lienFiltre({ categorie: c.slug })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              categorie === c.slug
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {c.nom}
          </Link>
        ))}
      </div>

      {/* Tri */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-slate-400">Trier par :</span>
        {TRIS.map((t) => (
          <Link
            key={t.valeur}
            href={lienFiltre({ tri: t.valeur })}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              tri === t.valeur
                ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-600">
          <p className="text-lg font-semibold">Aucun article trouvé</p>
          <p className="mt-1 text-sm text-slate-400">
            Essayez d&apos;autres mots-clés ou retirez les filtres.
          </p>
          <Link
            href="/articles"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Voir tous les articles
          </Link>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        baseUrl="/articles"
        searchParams={{ q, categorie, tri: tri !== "recent" ? tri : undefined }}
      />
    </div>
  );
}
