import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-8xl font-black text-accent">404</p>
      <h1 className="mt-4 text-3xl font-black">Page introuvable</h1>
      <p className="mt-2 text-muted">
        Cette page n&apos;existe pas ou a été déplacée — un peu comme une salle de
        projet libre un jour de soutenance.
      </p>
      <Link
        href="/"
        className="kicker mt-6 bg-ink px-5 py-2.5 text-xs text-paper transition-colors hover:bg-accent"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
