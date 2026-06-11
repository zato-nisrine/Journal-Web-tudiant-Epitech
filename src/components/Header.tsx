import Link from "next/link";
import { getCurrentUser, peutRediger } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";
import BoutonDeconnexion from "./BoutonDeconnexion";
import MenuMobile from "./MenuMobile";

export default async function Header() {
  const utilisateur = await getCurrentUser();

  const liens = [
    { href: "/", label: "Accueil" },
    { href: "/articles", label: "Articles" },
    { href: "/categories", label: "Catégories" },
    ...(utilisateur && peutRediger(utilisateur.role)
      ? [{ href: "/admin", label: "Administration" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <MenuMobile liens={liens} />
          <Link href="/" className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-2 py-1 text-sm font-black tracking-tight text-white">
              JE
            </span>
            <span className="text-lg font-bold tracking-tight">
              Journal <span className="text-blue-600 dark:text-blue-400">Epitech</span>
            </span>
          </Link>
        </div>

        <nav className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {liens.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {utilisateur ? (
            <div className="flex items-center gap-2">
              <span
                className="hidden max-w-32 truncate text-sm font-medium md:inline"
                title={utilisateur.nom}
              >
                {utilisateur.nom}
              </span>
              <BoutonDeconnexion />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
