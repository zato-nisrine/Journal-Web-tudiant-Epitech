import Link from "next/link";
import LogoEpitech from "./LogoEpitech";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-black">
            Le Journal <span className="text-accent">Epitech</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Le journal étudiant d&apos;Epitech : actualités, événements et vie
            étudiante, par et pour les étudiants.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="kicker text-[10px] text-muted">Une publication des étudiants de</span>
            <LogoEpitech className="h-4 w-auto text-ink" />
          </div>
        </div>
        <div>
          <p className="kicker text-xs text-muted">Navigation</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/" className="hover:text-accent">Accueil</Link></li>
            <li><Link href="/articles" className="hover:text-accent">Tous les articles</Link></li>
            <li><Link href="/categories" className="hover:text-accent">Catégories</Link></li>
            <li><Link href="/inscription" className="hover:text-accent">Créer un compte</Link></li>
          </ul>
        </div>
        <div>
          <p className="kicker text-xs text-muted">La rédaction</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Nisrine Zato · Brandon Houssou · Justice H. · Theophore B. · Harys S.
          </p>
        </div>
      </div>
      <div className="border-t border-rule py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Le Journal Étudiant — Projet Epitech
      </div>
    </footer>
  );
}
