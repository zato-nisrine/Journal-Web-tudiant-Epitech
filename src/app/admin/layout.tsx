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
    { href: "/admin", label: "📊 Tableau de bord" },
    { href: "/admin/articles", label: "📝 Articles" },
    ...(utilisateur.role === "ADMIN"
      ? [{ href: "/admin/utilisateurs", label: "👥 Utilisateurs" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black tracking-tight">Administration</h1>
        <Link
          href="/admin/articles/nouveau"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + Nouvel article
        </Link>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
        {liens.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {lien.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
