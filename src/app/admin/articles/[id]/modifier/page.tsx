import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ArticleForm from "@/components/ArticleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Modifier l'article" };

export default async function ModifierArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const utilisateur = (await getCurrentUser())!;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  // Un rédacteur ne modifie que ses articles
  if (utilisateur.role !== "ADMIN" && article.auteurId !== utilisateur.id) {
    redirect("/admin/articles");
  }

  const categories = await prisma.category.findMany({
    orderBy: { nom: "asc" },
    select: { id: true, nom: true },
  });

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-bold">Modifier l&apos;article</h2>
      <div className="mt-6">
        <ArticleForm
          categories={categories}
          article={{
            id: article.id,
            titre: article.titre,
            extrait: article.extrait,
            contenu: article.contenu,
            imageUrl: article.imageUrl,
            categorieId: article.categorieId,
            publie: article.publie,
            aLaUne: article.aLaUne,
          }}
        />
      </div>
    </div>
  );
}
