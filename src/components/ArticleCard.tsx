import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export type ArticleResume = {
  id: string;
  titre: string;
  slug: string;
  extrait: string;
  imageUrl: string | null;
  aLaUne: boolean;
  createdAt: Date | string;
  auteur: { id: string; nom: string };
  categorie: { id: string; nom: string; slug: string };
  _count: { commentaires: number; reactions: number };
};

export default function ArticleCard({ article }: { article: ArticleResume }) {
  return (
    <article className="group flex flex-col border-t-2 border-ink pt-4">
      <Link
        href={`/articles/${article.slug}`}
        className="relative block aspect-[1.9] overflow-hidden bg-rule"
      >
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.titre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale-[15%] transition-all duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-5xl font-black text-muted/40">
            JE
          </div>
        )}
        {article.aLaUne && (
          <span className="kicker absolute left-0 top-0 bg-accent px-2 py-1 text-[10px] text-white">
            À la une
          </span>
        )}
      </Link>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <Link
          href={`/articles?categorie=${article.categorie.slug}`}
          className="kicker rounded-full bg-accent2/10 px-2.5 py-1 text-[11px] text-accent2 transition-colors hover:bg-accent2 hover:text-white"
        >
          {article.categorie.nom}
        </Link>
        <span className="text-muted">·</span>
        <span className="text-muted">{formatDate(article.createdAt)}</span>
      </div>

      <h3 className="mt-2 text-xl font-bold leading-snug">
        <Link
          href={`/articles/${article.slug}`}
          className="decoration-accent/0 transition group-hover:text-accent"
        >
          {article.titre}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {article.extrait}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-rule pt-2 text-xs text-muted">
        <span className="font-medium text-ink">{article.auteur.nom}</span>
        <span>
          {article._count.reactions} réactions · {article._count.commentaires} comm.
        </span>
      </div>
    </article>
  );
}