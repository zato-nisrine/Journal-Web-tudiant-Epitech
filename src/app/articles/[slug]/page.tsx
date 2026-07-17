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
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href={`/articles?categorie=${article.categorie.slug}`}
            className="kicker rounded-full bg-accent2/10 px-2.5 py-1 text-xs text-accent2 transition-colors hover:bg-accent2 hover:text-white"
          >
            {article.categorie.nom}
          </Link>
          {article.aLaUne && (
            <span className="kicker bg-accent px-2 py-0.5 text-[11px] text-white">
              À la une
            </span>
          )}
          {!article.publie && (
            <span className="kicker border border-ink px-2 py-0.5 text-[11px] text-ink">
              Brouillon — non publié
            </span>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-black leading-[1.1] sm:text-5xl">
          {article.titre}
        </h1>

        <div className="mt-5 flex items-center gap-2 border-y border-rule py-3 text-sm text-muted">
          <span>
            Par <span className="font-semibold text-ink">{article.auteur.nom}</span>
          </span>
          <span>·</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>

        {/* Image de couverture */}
        {article.imageUrl && (
          <figure className="mt-8">
            <div className="relative aspect-[1.9] overflow-hidden bg-rule">
              <Image
                src={article.imageUrl}
                alt={article.titre}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs italic text-muted">
              {article.categorie.nom} — {article.titre}
            </figcaption>
          </figure>
        )}

        {/* Contenu */}
        <div className="prose-article mt-8 text-ink">
          {paragraphes.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {/* Réactions + partage */}
      <div className="mt-10 space-y-4 border-y-2 border-ink py-6">
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
        <section className="mt-14 border-t-2 border-ink pt-6" aria-label="Articles similaires">
          <h2 className="kicker mb-6 text-sm">Dans la même rubrique</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
