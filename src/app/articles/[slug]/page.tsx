import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, peutRediger } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import ReactionBar from "@/components/ReactionBar";
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { titre: true, extrait: true },
  });
  if (!article) return { title: "Article introuvable" };
  return { title: article.titre, description: article.extrait };
}

export default async function PageArticle({ params }: Props) {
  const { slug } = await params;
  const utilisateur = await getCurrentUser();

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      auteur: { select: { id: true, nom: true } },
      categorie: { select: { id: true, nom: true, slug: true } },
    },
  });

  if (!article) notFound();

  // Les brouillons ne sont visibles que par leur auteur ou un admin
  if (!article.publie) {
    const autorise =
      utilisateur &&
      (utilisateur.role === "ADMIN" ||
        (peutRediger(utilisateur.role) && utilisateur.id === article.auteurId));
    if (!autorise) notFound();
  }

  // Compteur de vues (best effort, sans bloquer le rendu)
  if (article.publie) {
    prisma.article
      .update({ where: { id: article.id }, data: { vues: { increment: 1 } } })
      .catch(() => {});
  }

  const [commentaires, groupesReactions, maReaction, similaires] =
    await Promise.all([
      prisma.comment.findMany({
        where: { articleId: article.id },
        orderBy: { createdAt: "desc" },
        include: { auteur: { select: { id: true, nom: true, role: true } } },
      }),
      prisma.reaction.groupBy({
        by: ["type"],
        where: { articleId: article.id },
        _count: true,
      }),
      utilisateur
        ? prisma.reaction.findUnique({
            where: {
              userId_articleId: {
                userId: utilisateur.id,
                articleId: article.id,
              },
            },
          })
        : null,
      prisma.article.findMany({
        where: {
          publie: true,
          categorieId: article.categorieId,
          id: { not: article.id },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          titre: true,
          slug: true,
          extrait: true,
          imageUrl: true,
          aLaUne: true,
          vues: true,
          createdAt: true,
          auteur: { select: { id: true, nom: true } },
          categorie: { select: { id: true, nom: true, slug: true } },
          _count: { select: { commentaires: true, reactions: true } },
        },
      }),
    ]);

  const comptes: Record<string, number> = {
    LIKE: 0,
    LOVE: 0,
    BRAVO: 0,
    INTERESSANT: 0,
  };
  for (const g of groupesReactions) comptes[g.type] = g._count;

  const paragraphes = article.contenu.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <article>
        {/* En-tête */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href={`/articles?categorie=${article.categorie.slug}`}
            className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300"
          >
            {article.categorie.nom}
          </Link>
          {article.aLaUne && (
            <span className="rounded-full bg-amber-400 px-3 py-1 font-bold text-amber-950">
              ⭐ À la une
            </span>
          )}
          {!article.publie && (
            <span className="rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              Brouillon — non publié
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          {article.titre}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            {article.auteur.nom.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              {article.auteur.nom}
            </p>
            <p>
              {formatDate(article.createdAt)} · 👁 {article.vues} vues
            </p>
          </div>
        </div>

        {/* Image de couverture */}
        {article.imageUrl && (
          <div className="relative mt-8 aspect-[1.9] overflow-hidden rounded-2xl">
            <Image
              src={article.imageUrl}
              alt={article.titre}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* Contenu */}
        <div className="prose-article mt-8 text-[1.05rem] text-slate-700 dark:text-slate-300">
          {paragraphes.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {/* Réactions + partage */}
      <div className="mt-10 space-y-4 border-y border-slate-200 py-6 dark:border-slate-700">
        <ReactionBar
          articleId={article.id}
          initialComptes={comptes}
          initialMaReaction={maReaction?.type ?? null}
          connecte={!!utilisateur}
        />
        <ShareButtons titre={article.titre} />
      </div>

      {/* Commentaires */}
      <div className="mt-10">
        <CommentSection
          articleId={article.id}
          initialCommentaires={commentaires}
          utilisateur={utilisateur}
        />
      </div>

      {/* Articles similaires */}
      {similaires.length > 0 && (
        <section className="mt-14" aria-label="Articles similaires">
          <h2 className="text-xl font-bold">Dans la même catégorie</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
