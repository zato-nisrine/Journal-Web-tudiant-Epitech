import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories — liste des catégories avec compteur d'articles publiés
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { nom: "asc" },
    include: {
      _count: { select: { articles: { where: { publie: true } } } },
    },
  });
  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      nom: c.nom,
      slug: c.slug,
      nbArticles: c._count.articles,
    })),
  });
}
