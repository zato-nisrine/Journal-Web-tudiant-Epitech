import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { commentaireSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// GET /api/articles/[id]/commentaires — liste des commentaires
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const commentaires = await prisma.comment.findMany({
    where: { articleId: id },
    orderBy: { createdAt: "desc" },
    include: { auteur: { select: { id: true, nom: true, role: true } } },
  });
  return NextResponse.json({ commentaires });
}

// POST /api/articles/[id]/commentaires — ajouter un commentaire (connecté)
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { erreur: "Connectez-vous pour commenter" },
      { status: 401 }
    );
  }

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article || !article.publie) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = commentaireSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erreur: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const commentaire = await prisma.comment.create({
    data: {
      contenu: parsed.data.contenu,
      articleId: id,
      auteurId: session.userId,
    },
    include: { auteur: { select: { id: true, nom: true, role: true } } },
  });

  return NextResponse.json({ commentaire }, { status: 201 });
}
