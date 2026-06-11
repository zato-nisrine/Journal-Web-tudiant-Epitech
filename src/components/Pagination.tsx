import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  baseUrl,
  searchParams,
}: {
  page: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function lien(p: number) {
    const params = new URLSearchParams();
    for (const [cle, valeur] of Object.entries(searchParams)) {
      if (valeur && cle !== "page") params.set(cle, valeur);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }

  const classes = (actif: boolean, desactive = false) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
      desactive
        ? "pointer-events-none opacity-40"
        : actif
          ? "bg-blue-600 text-white"
          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
    }`;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <Link href={lien(page - 1)} className={classes(false, page <= 1)} aria-label="Page précédente">
        ← Précédent
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={lien(p)} className={classes(p === page)} aria-current={p === page ? "page" : undefined}>
          {p}
        </Link>
      ))}
      <Link href={lien(page + 1)} className={classes(false, page >= totalPages)} aria-label="Page suivante">
        Suivant →
      </Link>
    </nav>
  );
}
