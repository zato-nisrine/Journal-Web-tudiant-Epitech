import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catégories",
  description: "Toutes les catégories du journal étudiant.",
};

const ICONES: Record<string, string> = {
  "actualites-ecole": "🏫",
  "evenements": "🎉",
  "clubs-associations": "🤝",
  "interviews": "🎤",
  "vie-etudiante": "🎓",
  "projets-etudiants": "🛠️",
  "opportunites-stages": "💼",
  "esport-gaming": "🎮",
  "culture-divertissement": "🎬",
};

export default async function PageCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { nom: "asc" },
    include: {
      _count: { select: { articles: { where: { publie: true } } } },
      articles: {
        where: { publie: true },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { titre: true, slug: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">Catégories</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Explorez le journal par thématique.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/articles?categorie=${c.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="text-3xl">{ICONES[c.slug] ?? "📰"}</div>
            <h2 className="mt-3 text-lg font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {c.nom}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {c._count.articles} article{c._count.articles > 1 ? "s" : ""}
            </p>
            {c.articles[0] && (
              <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                Dernier : {c.articles[0].titre}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
