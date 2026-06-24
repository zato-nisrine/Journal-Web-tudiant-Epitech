import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import TableUtilisateurs from "@/components/TableUtilisateurs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Gestion des utilisateurs" };

export default async function GestionUtilisateurs() {
  const utilisateur = (await getCurrentUser())!;
  if (utilisateur.role !== "ADMIN") redirect("/admin");

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

  return (
    <div>
      <h2 className="font-display text-xl font-bold">
        Utilisateurs <span className="text-muted">({utilisateurs.length})</span>
      </h2>
      <div className="mt-4">
        <TableUtilisateurs utilisateurs={utilisateurs} monId={utilisateur.id} />
      </div>
    </div>
  );
}
