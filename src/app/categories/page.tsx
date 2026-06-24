import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catégories",
  description: "Toutes les catégories du journal étudiant.",
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
      <h1 className="border-b-2 border-ink pb-3 text-4xl font-black">Rubriques</h1>
      <p className="mt-3 text-sm text-muted">Explorez le journal par thématique.</p>

      <div className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/articles?categorie=${c.slug}`}
            className="group flex flex-col bg-surface p-6 transition-colors hover:bg-paper"
          >
            <span className="kicker text-xs text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-2 text-xl font-bold transition-colors group-hover:text-accent">
              {c.nom}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {c._count.articles} article{c._count.articles > 1 ? "s" : ""}
            </p>
            {c.articles[0] && (
              <p className="mt-3 line-clamp-2 text-sm italic text-muted">
                Dernier : {c.articles[0].titre}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
