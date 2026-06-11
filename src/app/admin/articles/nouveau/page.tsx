import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/ArticleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NouvelArticle() {
  const categories = await prisma.category.findMany({
    orderBy: { nom: "asc" },
    select: { id: true, nom: true },
  });

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-bold">Écrire un nouvel article</h2>
      <div className="mt-6">
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}
