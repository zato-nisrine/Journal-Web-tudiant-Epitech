import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">
            Journal <span className="text-blue-600 dark:text-blue-400">Epitech</span>
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Le journal étudiant d&apos;Epitech : actualités, événements et vie
            étudiante, par et pour les étudiants.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Navigation
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Accueil</Link></li>
            <li><Link href="/articles" className="hover:text-blue-600 dark:hover:text-blue-400">Tous les articles</Link></li>
            <li><Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400">Catégories</Link></li>
            <li><Link href="/inscription" className="hover:text-blue-600 dark:hover:text-blue-400">Créer un compte</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            L&apos;équipe
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Nisrine Zato · Brandon Houssou · Justice H. · Theophore B. · Harys S.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-700">
        © {new Date().getFullYear()} Journal Web Étudiant — Projet Epitech
      </div>
    </footer>
  );
}
