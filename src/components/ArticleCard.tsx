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
  vues: number;
  createdAt: Date | string;
  auteur: { id: string; nom: string };
  categorie: { id: string; nom: string; slug: string };
  _count: { commentaires: number; reactions: number };
};

export default function ArticleCard({ article }: { article: ArticleResume }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <Link href={`/articles/${article.slug}`} className="relative block aspect-[1.9] overflow-hidden bg-slate-200 dark:bg-slate-700">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.titre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-5xl font-black text-white/40">
            JE
          </div>
        )}
        {article.aLaUne && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-amber-950">
            ⭐ À la une
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/articles?categorie=${article.categorie.slug}`}
            className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/70"
          >
            {article.categorie.nom}
          </Link>
          <span className="text-slate-400">{formatDate(article.createdAt)}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          <Link
            href={`/articles/${article.slug}`}
            className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
          >
            {article.titre}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500 dark:text-slate-400">
          {article.extrait}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {article.auteur.nom}
          </span>
          <span className="flex items-center gap-3">
            <span title="Réactions">❤️ {article._count.reactions}</span>
            <span title="Commentaires">💬 {article._count.commentaires}</span>
            <span title="Vues">👁 {article.vues}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
