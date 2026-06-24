import Link from "next/link";
import { getCurrentUser, peutRediger } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";
import BoutonDeconnexion from "./BoutonDeconnexion";
import MenuMobile from "./MenuMobile";
import LogoEpitech from "./LogoEpitech";

export default async function Header() {
  const utilisateur = await getCurrentUser();

  const liens = [
    { href: "/", label: "Accueil" },
    { href: "/articles", label: "Articles" },
    { href: "/categories", label: "Catégories" },
    ...(utilisateur && peutRediger(utilisateur.role)
      ? [{ href: "/admin", label: "Rédaction" }]
      : []),
  ];

  const aujourdhui = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
      {/* Bandeau supérieur : date + compte */}
      <div className="border-b border-rule">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <LogoEpitech className="h-3 w-auto text-ink" />
            <span className="hidden capitalize sm:inline">· {aujourdhui}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {utilisateur ? (
              <div className="flex items-center gap-3">
                <span
                  className="hidden max-w-32 truncate font-medium text-ink md:inline"
                  title={utilisateur.nom}
                >
                  {utilisateur.nom}
                </span>
                <BoutonDeconnexion />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/connexion" className="font-medium hover:text-accent">
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Masthead + navigation */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <MenuMobile liens={liens} />
        <Link href="/" className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Le Journal <span className="text-accent">Epitech</span>
        </Link>
        <nav className="ml-auto hidden sm:block">
          <ul className="flex items-center gap-6">
            {liens.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="kicker text-xs text-ink transition-colors hover:text-accent"
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
