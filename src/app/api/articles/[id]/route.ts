import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, peutRediger } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// GET /api/articles/[id] — détail d'un article (id ou slug)
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const article = await prisma.article.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      auteur: { select: { id: true, nom: true } },
      categorie: { select: { id: true, nom: true, slug: true } },
      _count: { select: { commentaires: true, reactions: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  if (!article.publie) {
    const session = await getSession();
    const autorise =
      session &&
      (session.role === "ADMIN" ||
        (peutRediger(session.role) && session.userId === article.auteurId));
    if (!autorise) {
      return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
    }
  }

  return NextResponse.json({ article });
}

// PUT /api/articles/[id] — modifier (auteur ou ADMIN)
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  const autorise =
    session.role === "ADMIN" ||
    (peutRediger(session.role) && session.userId === article.auteurId);
  if (!autorise) {
    return NextResponse.json(
      { erreur: "Vous ne pouvez modifier que vos propres articles" },
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

  const maj = await prisma.article.update({
    where: { id },
    data: {
      titre: parsed.data.titre,
      extrait: parsed.data.extrait,
      contenu: parsed.data.contenu,
      imageUrl: parsed.data.imageUrl || null,
      categorieId: parsed.data.categorieId,
      publie: parsed.data.publie,
      aLaUne: parsed.data.aLaUne,
    },
    include: {
      auteur: { select: { id: true, nom: true } },
      categorie: { select: { id: true, nom: true, slug: true } },
    },
  });

  return NextResponse.json({ article: maj });
}

// DELETE /api/articles/[id] — supprimer (auteur ou ADMIN)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  const autorise =
    session.role === "ADMIN" ||
    (peutRediger(session.role) && session.userId === article.auteurId);
  if (!autorise) {
    return NextResponse.json(
      { erreur: "Vous ne pouvez supprimer que vos propres articles" },
      { status: 403 }
    );
  }

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
