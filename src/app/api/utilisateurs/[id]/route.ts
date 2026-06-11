import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { roleSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/utilisateurs/[id] — changer le rôle (ADMIN uniquement)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }
  if (session.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès réservé aux administrateurs" }, { status: 403 });
  }
  if (session.userId === id) {
    return NextResponse.json(
      { erreur: "Vous ne pouvez pas modifier votre propre rôle" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = roleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erreur: "Rôle invalide" }, { status: 400 });
  }

  const utilisateur = await prisma.user
    .update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, nom: true, email: true, role: true },
    })
    .catch(() => null);

  if (!utilisateur) {
    return NextResponse.json({ erreur: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json({ utilisateur });
}

// DELETE /api/utilisateurs/[id] — supprimer un compte (ADMIN uniquement)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }
  if (session.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès réservé aux administrateurs" }, { status: 403 });
  }
  if (session.userId === id) {
    return NextResponse.json(
      { erreur: "Vous ne pouvez pas supprimer votre propre compte" },
      { status: 400 }
    );
  }

  const supprime = await prisma.user.delete({ where: { id } }).catch(() => null);
  if (!supprime) {
    return NextResponse.json({ erreur: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
