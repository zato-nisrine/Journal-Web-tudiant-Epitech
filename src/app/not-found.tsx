import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-black text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Cette page n&apos;existe pas ou a été déplacée — un peu comme une salle de
        projet libre un jour de soutenance.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
