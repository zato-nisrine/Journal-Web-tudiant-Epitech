import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, peutRediger } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const utilisateur = await getCurrentUser();
  if (!utilisateur) redirect("/connexion");
  if (!peutRediger(utilisateur.role)) redirect("/");

  const liens = [
    { href: "/admin", label: "Tableau de bord" },
    { href: "/admin/articles", label: "Articles" },
    ...(utilisateur.role === "ADMIN"
      ? [{ href: "/admin/utilisateurs", label: "Utilisateurs" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
        <h1 className="font-display text-3xl font-black">La Rédaction</h1>
        <Link
          href="/admin/articles/nouveau"
          className="kicker bg-ink px-4 py-2 text-xs text-paper transition-colors hover:bg-accent"
        >
          + Nouvel article
        </Link>
      </div>

      <nav className="mt-5 flex flex-wrap gap-6 border-b border-rule pb-4">
        {liens.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            className="kicker text-xs text-muted transition-colors hover:text-accent"
          >
            {lien.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
