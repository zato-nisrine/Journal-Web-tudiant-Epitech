import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/utilisateurs — liste des utilisateurs (ADMIN uniquement)
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }
  if (session.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès réservé aux administrateurs" }, { status: 403 });
  }

  const utilisateurs = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { articles: true, commentaires: true } },
    },
  });

  return NextResponse.json({ utilisateurs });
}
