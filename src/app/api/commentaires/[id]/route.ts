import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/commentaires/[id] — supprimer (auteur du commentaire ou ADMIN)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }

  const commentaire = await prisma.comment.findUnique({ where: { id } });
  if (!commentaire) {
    return NextResponse.json({ erreur: "Commentaire introuvable" }, { status: 404 });
  }

  if (session.role !== "ADMIN" && session.userId !== commentaire.auteurId) {
    return NextResponse.json(
      { erreur: "Vous ne pouvez supprimer que vos propres commentaires" },
      { status: 403 }
    );
  }

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
