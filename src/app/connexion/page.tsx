import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import FormulaireAuth from "@/components/FormulaireAuth";

export const metadata: Metadata = { title: "Connexion" };

export default async function PageConnexion() {
  const utilisateur = await getCurrentUser();
  if (utilisateur) redirect("/");
  return <FormulaireAuth mode="connexion" />;
}
