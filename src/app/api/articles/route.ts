import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession, peutRediger } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

const ARTICLES_PAR_PAGE = 9;

const selectionListe = {
  id: true,
  titre: true,
  slug: true,
  extrait: true,
  imageUrl: true,
  publie: true,
  aLaUne: true,
  vues: true,
  createdAt: true,
  auteur: { select: { id: true, nom: true } },
  categorie: { select: { id: true, nom: true, slug: true } },
  _count: { select: { commentaires: true, reactions: true } },
} satisfies Prisma.ArticleSelect;

// GET /api/articles — liste avec recherche, filtres et pagination
// Paramètres : q, categorie (slug), tri (recent|populaire|commentes), page, brouillons (rédacteurs)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const categorie = searchParams.get("categorie") ?? "";
  const tri = searchParams.get("tri") ?? "recent";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const brouillons = searchParams.get("brouillons") === "1";

  const session = await getSession();

  const where: Prisma.ArticleWhereInput = {};
  if (brouillons && session && peutRediger(session.role)) {
    // Les rédacteurs voient leurs brouillons, les admins tous les brouillons
    where.publie = false;
    if (session.role !== "ADMIN") where.auteurId = session.userId;
  } else {
    where.publie = true;
  }
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

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      select: selectionListe,
      skip: (page - 1) * ARTICLES_PAR_PAGE,
      take: ARTICLES_PAR_PAGE,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      totalPages: Math.max(1, Math.ceil(total / ARTICLES_PAR_PAGE)),
      total,
    },
  });
}

// POST /api/articles — créer un article (REDACTEUR ou ADMIN)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }
  if (!peutRediger(session.role)) {
    return NextResponse.json(
      { erreur: "Seuls les rédacteurs et administrateurs peuvent publier" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erreur: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const categorie = await prisma.category.findUnique({
    where: { id: parsed.data.categorieId },
  });
  if (!categorie) {
    return NextResponse.json({ erreur: "Catégorie inconnue" }, { status: 400 });
  }

  // Slug unique : suffixe numérique en cas de collision
  const base = slugify(parsed.data.titre);
  let slug = base;
  for (let i = 2; await prisma.article.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`;
  }

  const article = await prisma.article.create({
    data: {
      titre: parsed.data.titre,
      slug,
      extrait: parsed.data.extrait,
      contenu: parsed.data.contenu,
      imageUrl: parsed.data.imageUrl || null,
      categorieId: parsed.data.categorieId,
      publie: parsed.data.publie,
      aLaUne: parsed.data.aLaUne,
      auteurId: session.userId,
    },
    select: selectionListe,
  });

  return NextResponse.json({ article }, { status: 201 });
}
