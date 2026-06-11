export function slugify(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateCourte(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const REACTIONS: { type: string; emoji: string; label: string }[] = [
  { type: "LIKE", emoji: "👍", label: "J'aime" },
  { type: "LOVE", emoji: "❤️", label: "J'adore" },
  { type: "BRAVO", emoji: "👏", label: "Bravo" },
  { type: "INTERESSANT", emoji: "💡", label: "Intéressant" },
];

export const LABELS_ROLES: Record<string, string> = {
  ADMIN: "Administrateur",
  REDACTEUR: "Rédacteur",
  LECTEUR: "Lecteur",
};
