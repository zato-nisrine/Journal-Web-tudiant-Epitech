import { NextRequest, NextResponse } from "next/server";
import { TypeReaction } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reactionSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

async function comptesReactions(articleId: string) {
  const groupes = await prisma.reaction.groupBy({
    by: ["type"],
    where: { articleId },
    _count: true,
  });
  const comptes: Record<string, number> = {
    LIKE: 0,
    LOVE: 0,
    BRAVO: 0,
    INTERESSANT: 0,
  };
  for (const g of groupes) comptes[g.type] = g._count;
  return comptes;
}

// GET /api/articles/[id]/reactions — compteurs + réaction de l'utilisateur courant
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();

  const [comptes, maReaction] = await Promise.all([
    comptesReactions(id),
    session
      ? prisma.reaction.findUnique({
          where: { userId_articleId: { userId: session.userId, articleId: id } },
        })
      : null,
  ]);

  return NextResponse.json({ comptes, maReaction: maReaction?.type ?? null });
}

// POST /api/articles/[id]/reactions — réagir (toggle : re-cliquer retire, autre type remplace)
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { erreur: "Connectez-vous pour réagir" },
      { status: 401 }
    );
  }

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article || !article.publie) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erreur: "Type de réaction invalide" }, { status: 400 });
  }

  const type = parsed.data.type as TypeReaction;
  const cle = { userId_articleId: { userId: session.userId, articleId: id } };
  const existante = await prisma.reaction.findUnique({ where: cle });

  let maReaction: TypeReaction | null;
  if (existante?.type === type) {
    await prisma.reaction.delete({ where: cle });
    maReaction = null;
  } else if (existante) {
    await prisma.reaction.update({ where: cle, data: { type } });
    maReaction = type;
  } else {
    await prisma.reaction.create({
      data: { type, userId: session.userId, articleId: id },
    });
    maReaction = type;
  }

  return NextResponse.json({ comptes: await comptesReactions(id), maReaction });
}
