import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { nom: "Actualités école", slug: "actualites-ecole" },
  { nom: "Événements", slug: "evenements" },
  { nom: "Clubs & associations", slug: "clubs-associations" },
  { nom: "Interviews", slug: "interviews" },
  { nom: "Vie étudiante", slug: "vie-etudiante" },
  { nom: "Projets étudiants", slug: "projets-etudiants" },
  { nom: "Opportunités / stages", slug: "opportunites-stages" },
  { nom: "Esport / gaming", slug: "esport-gaming" },
  { nom: "Culture & divertissement", slug: "culture-divertissement" },
  { nom: "Tech & cybersécurité", slug: "tech-cybersecurite" },
];

// Comptes initiaux : un administrateur réel + un compte de démonstration
// destiné au jury d'évaluation. Aucune autre donnée n'est insérée.
const COMPTES = [
  {
    nom: "Nisrine Zato",
    email: "nisrine.zato@epitech.eu",
    password: "Freeproject123",
    role: Role.ADMIN,
  },
  {
    nom: "Compte démonstration (jury)",
    email: "jury@epitech.eu",
    password: "JuryDemo2026",
    role: Role.ADMIN,
  },
];

async function main() {
  console.log("🌱 Initialisation de la base…");

  // Catégories (structure du journal) — créées si absentes
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nom: c.nom },
      create: c,
    });
  }

  // Comptes — créés si absents, mot de passe (re)défini à chaque seed
  for (const u of COMPTES) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { nom: u.nom, role: u.role, passwordHash },
      create: { nom: u.nom, email: u.email, role: u.role, passwordHash },
    });
  }

  console.log("✅ Base initialisée :");
  console.log(`   - ${CATEGORIES.length} catégories`);
  console.log(`   - ${COMPTES.length} comptes :`);
  for (const u of COMPTES) console.log(`       • ${u.email} (${u.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
