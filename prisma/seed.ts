import { PrismaClient, Role, TypeReaction } from "@prisma/client";
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
];

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Nettoyage (ordre inverse des dépendances)
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 12);

  const [nisrine, brandon, justice, theophore, harys, lecteur] =
    await Promise.all(
      [
        { nom: "Nisrine Zato", email: "nisrine@epitech.eu", role: Role.ADMIN },
        {
          nom: "Brandon Houssou",
          email: "brandon@epitech.eu",
          role: Role.REDACTEUR,
        },
        {
          nom: "Justice H.",
          email: "justice@epitech.eu",
          role: Role.REDACTEUR,
        },
        {
          nom: "Theophore B.",
          email: "theophore@epitech.eu",
          role: Role.REDACTEUR,
        },
        { nom: "Harys S.", email: "harys@epitech.eu", role: Role.REDACTEUR },
        {
          nom: "Étudiant Curieux",
          email: "lecteur@epitech.eu",
          role: Role.LECTEUR,
        },
      ].map((u) => prisma.user.create({ data: { ...u, passwordHash } }))
    );

  const categories = await Promise.all(
    CATEGORIES.map((c) => prisma.category.create({ data: c }))
  );
  const cat = (slug: string) => {
    const found = categories.find((c) => c.slug === slug);
    if (!found) throw new Error(`Catégorie introuvable : ${slug}`);
    return found.id;
  };

  const articles = [
    {
      titre: "Rentrée 2026 : tout ce qui change à Epitech cette année",
      slug: "rentree-2026-tout-ce-qui-change-a-epitech",
      extrait:
        "Nouveaux locaux, pédagogie repensée et arrivée de nouveaux intervenants : le point complet sur la rentrée.",
      contenu: `La rentrée 2026 marque un tournant pour notre campus. L'administration a annoncé une série de changements qui vont transformer le quotidien des étudiants dès ce semestre.

Premier changement majeur : les salles de projet du deuxième étage ont été entièrement rénovées pendant l'été. Écrans partagés, mobilier modulable et nouvelles bornes de réservation font leur apparition. Fini les négociations interminables pour trouver une salle libre, tout passe désormais par l'intranet.

Côté pédagogie, le module de projet personnel évolue. Les étudiants pourront désormais constituer des équipes inter-promotions, une demande récurrente des délégués depuis deux ans. Les soutenances seront également ouvertes au public étudiant, une excellente nouvelle pour découvrir les projets des autres promotions.

Enfin, plusieurs nouveaux intervenants issus de l'industrie rejoignent l'équipe pédagogique, notamment sur les modules de sécurité et d'intelligence artificielle. Des conférences ouvertes à tous seront organisées chaque mois.

La rédaction du journal suivra de près ces évolutions tout au long de l'année. N'hésitez pas à partager vos retours en commentaire !`,
      imageUrl: "https://picsum.photos/seed/epitech-rentree/1200/630",
      publie: true,
      aLaUne: true,
      vues: 248,
      auteurId: nisrine.id,
      categorieId: cat("actualites-ecole"),
    },
    {
      titre: "Hackathon de janvier : 48 heures pour innover",
      slug: "hackathon-de-janvier-48-heures-pour-innover",
      extrait:
        "Le grand hackathon annuel revient les 24 et 25 janvier. Inscriptions ouvertes, thème dévoilé : la ville intelligente.",
      contenu: `C'est officiel : le hackathon annuel du campus aura lieu les 24 et 25 janvier prochains. Pendant 48 heures, les équipes de 3 à 5 étudiants s'affronteront autour d'un thème dévoilé cette semaine : la ville intelligente.

Au programme : conception, développement et pitch final devant un jury composé d'intervenants et de professionnels invités. Les critères d'évaluation porteront sur l'innovation, la qualité technique et l'impact potentiel du projet.

Les lots ne sont pas en reste : l'équipe gagnante remportera des places pour la prochaine grande conférence tech de la région, et des goodies seront distribués à tous les participants.

Les inscriptions se font par équipe directement sur l'intranet, dans la limite des places disponibles. Un conseil : ne tardez pas, l'édition précédente affichait complet en moins d'une semaine.

Pizza, café et bonne humeur garantis. On vous attend nombreux !`,
      imageUrl: "https://picsum.photos/seed/epitech-hackathon/1200/630",
      publie: true,
      aLaUne: false,
      vues: 187,
      auteurId: brandon.id,
      categorieId: cat("evenements"),
    },
    {
      titre: "Le club robotique recrute pour son projet de drone autonome",
      slug: "le-club-robotique-recrute-drone-autonome",
      extrait:
        "Ambitieux et ouvert à tous les niveaux, le club robotique lance la construction d'un drone autonome et cherche des membres motivés.",
      contenu: `Le club robotique du campus repart pour une nouvelle année avec un projet phare : la conception d'un drone capable de naviguer en autonomie dans les couloirs de l'école.

Le projet couvre un spectre technique très large : électronique embarquée, vision par ordinateur, algorithmes de navigation et impression 3D pour le châssis. Autant dire qu'il y a de la place pour tous les profils, du débutant curieux à l'expert en systèmes embarqués.

Les réunions ont lieu tous les mercredis à 18h en salle projet B204. Aucun prérequis n'est demandé : les membres expérimentés assurent une montée en compétence progressive des nouveaux arrivants.

Le club vise une démonstration publique en fin d'année, lors de la journée portes ouvertes. Un objectif ambitieux mais réaliste selon son président, qui rappelle que le club avait déjà présenté un bras robotisé fonctionnel l'an dernier.

Pour rejoindre l'aventure, il suffit de passer à une réunion ou de contacter le club sur le Discord de l'école.`,
      imageUrl: "https://picsum.photos/seed/epitech-robot/1200/630",
      publie: true,
      aLaUne: false,
      vues: 95,
      auteurId: theophore.id,
      categorieId: cat("clubs-associations"),
    },
    {
      titre: "Interview : de l'Epitech au CTO d'une startup en 5 ans",
      slug: "interview-de-epitech-au-cto-startup-5-ans",
      extrait:
        "Ancien étudiant du campus, Mehdi revient sur son parcours, ses galères de piscine et son quotidien de CTO.",
      contenu: `Nous avons rencontré Mehdi, diplômé il y a cinq ans, aujourd'hui CTO d'une startup spécialisée dans la logistique urbaine. Entretien sans langue de bois.

Quel souvenir gardes-tu de tes années sur le campus ?

« La piscine, évidemment. On en garde tous des souvenirs mitigés sur le moment, mais avec le recul c'est là que j'ai appris à apprendre. Cette capacité à plonger dans une techno inconnue et à en sortir quelque chose en quelques jours, c'est exactement mon quotidien aujourd'hui. »

Ton conseil pour les étudiants actuels ?

« Faites des projets perso, encore et toujours. Ce qui m'a démarqué en entretien, ce n'est pas mon diplôme, c'est le side project que je maintenais depuis deux ans. Et documentez ce que vous faites : un README propre en dit long sur un développeur. »

Le métier de CTO, c'est comment ?

« Beaucoup moins de code qu'on l'imagine, beaucoup plus d'humain. Mon rôle c'est de faire grandir une équipe de douze développeurs et de prendre des décisions techniques qui engagent la boîte sur des années. La pression est réelle, mais voir l'équipe progresser est une satisfaction immense. »

Merci à Mehdi pour sa disponibilité. Prochaine interview le mois prochain avec une alumni partie travailler au Japon !`,
      imageUrl: "https://picsum.photos/seed/epitech-interview/1200/630",
      publie: true,
      aLaUne: false,
      vues: 156,
      auteurId: justice.id,
      categorieId: cat("interviews"),
    },
    {
      titre: "Cinq spots pour réviser (ou faire semblant) autour du campus",
      slug: "cinq-spots-pour-reviser-autour-du-campus",
      extrait:
        "Marre du labo ? Notre sélection testée et approuvée des meilleurs endroits pour travailler autour de l'école.",
      contenu: `Le labo c'est bien, mais parfois on a besoin de changer d'air. La rédaction a écumé le quartier pour vous dénicher les meilleurs spots de travail. Sélection 100 % testée.

Le café du coin de la rue reste une valeur sûre : wifi correct, prises nombreuses et patron sympathique qui tolère les sessions de quatre heures avec un seul expresso. Évitez juste l'heure du déjeuner.

La médiathèque municipale, à dix minutes à pied, est le spot le plus sous-coté. Silence absolu, grandes tables et climatisation l'été. Le combo gagnant pour les périodes de rush.

Le parc derrière la gare fonctionne très bien aux beaux jours pour les réunions de groupe informelles. Pas de prises évidemment, pensez à charger vos machines.

Le coworking étudiant ouvert l'an dernier propose un tarif spécial école sur présentation de la carte étudiante. Ambiance studieuse et café illimité.

Enfin, pour les nocturnes, le fast-food ouvert 24h/24 a vu naître plus de projets de fin de module qu'on ne saurait le compter. On ne juge pas.

Et vous, c'est quoi votre spot secret ? Dites-le nous en commentaire.`,
      imageUrl: "https://picsum.photos/seed/epitech-spots/1200/630",
      publie: true,
      aLaUne: false,
      vues: 203,
      auteurId: brandon.id,
      categorieId: cat("vie-etudiante"),
    },
    {
      titre: "Projet étudiant : une appli de covoiturage interne au campus",
      slug: "projet-etudiant-appli-covoiturage-campus",
      extrait:
        "Quatre étudiants de troisième année lancent CampusGo, une application de covoiturage réservée aux étudiants de l'école.",
      contenu: `Partis d'un constat simple — des dizaines d'étudiants font le même trajet chaque matin sans se connaître — quatre étudiants de troisième année ont développé CampusGo, une application de covoiturage interne à l'école.

Le fonctionnement est volontairement minimaliste : on indique son trajet domicile-campus et ses horaires, l'algorithme propose des correspondances avec d'autres étudiants, et la messagerie intégrée permet de s'organiser. L'inscription est vérifiée via l'adresse e-mail de l'école pour garantir un entre-soi rassurant.

Côté technique, l'équipe a fait le choix d'une stack moderne : application mobile en React Native, API en Node.js et base PostgreSQL, le tout hébergé sur un petit serveur cloud financé par leurs économies de stage.

Lancée en bêta le mois dernier, l'application compte déjà plus de 80 inscrits et une trentaine de trajets partagés chaque semaine. L'équipe travaille maintenant sur un système de points pour récompenser les conducteurs réguliers.

Une belle preuve que les projets étudiants peuvent répondre à de vrais besoins. On leur souhaite la même trajectoire que les belles réussites issues du campus ces dernières années.`,
      imageUrl: "https://picsum.photos/seed/epitech-covoit/1200/630",
      publie: true,
      aLaUne: false,
      vues: 134,
      auteurId: theophore.id,
      categorieId: cat("projets-etudiants"),
    },
    {
      titre: "Stages : la liste des entreprises qui recrutent ce semestre",
      slug: "stages-entreprises-qui-recrutent-ce-semestre",
      extrait:
        "Le bureau des stages a publié sa liste semestrielle : plus de 40 offres en développement, data, cybersécurité et DevOps.",
      contenu: `Le bureau des stages vient de publier sa traditionnelle liste semestrielle des entreprises partenaires qui recrutent. Avec plus de 40 offres ouvertes, le cru est excellent cette année.

Le développement web reste le secteur le plus demandeur avec une vingtaine d'offres, du grand groupe bancaire à la startup en pré-seed. Les stacks les plus citées : React, Node.js, et de plus en plus de Go côté backend.

La cybersécurité confirme sa montée en puissance avec huit offres, dont plusieurs en équipe SOC et deux en pentest, des postes habituellement réservés aux profils expérimentés.

La data et l'IA ne sont pas en reste : six offres, dont une particulièrement intéressante en MLOps chez un acteur majeur du e-commerce.

Enfin, les profils DevOps et infrastructure cloud restent très recherchés, avec des missions autour de Kubernetes et de l'automatisation.

Toutes les offres sont consultables sur l'intranet, rubrique stages. Le bureau rappelle qu'un CV relu par leurs soins multiplie significativement les chances de décrocher un entretien. Permanences tous les jeudis après-midi.`,
      imageUrl: "https://picsum.photos/seed/epitech-stages/1200/630",
      publie: true,
      aLaUne: false,
      vues: 312,
      auteurId: nisrine.id,
      categorieId: cat("opportunites-stages"),
    },
    {
      titre: "L'équipe esport qualifiée pour les finales nationales !",
      slug: "equipe-esport-qualifiee-finales-nationales",
      extrait:
        "Exploit de la section esport : nos joueurs décrochent leur place en finale nationale étudiante après un parcours sans faute.",
      contenu: `Énorme performance de la section esport de l'école : l'équipe principale vient de se qualifier pour les finales nationales du championnat étudiant, après un parcours de qualification quasi parfait.

Avec sept victoires en huit matchs, nos joueurs ont dominé leur poule régionale de bout en bout. La demi-finale régionale, remportée au terme d'un cinquième match d'anthologie, restera dans les mémoires de tous ceux qui suivaient le stream ce soir-là — plus de 200 spectateurs simultanés, un record pour la section.

Les finales nationales se tiendront en mars et opposeront les huit meilleures équipes étudiantes du pays. Un palier relevé, mais le coach de l'équipe se veut confiant : « On a une vraie profondeur de jeu cette année, et le groupe vit bien. On ne va pas là-bas pour faire de la figuration. »

La section organisera des soirées de visionnage sur le campus pour chaque match des finales. Le journal couvrira évidemment l'événement.

Bravo à toute l'équipe, et rendez-vous en mars pour écrire l'histoire !`,
      imageUrl: "https://picsum.photos/seed/epitech-esport/1200/630",
      publie: true,
      aLaUne: false,
      vues: 178,
      auteurId: harys.id,
      categorieId: cat("esport-gaming"),
    },
    {
      titre: "Ciné-club : le cycle science-fiction démarre ce jeudi",
      slug: "cine-club-cycle-science-fiction-demarre-jeudi",
      extrait:
        "Six films cultes, six jeudis soirs, un amphi et du pop-corn : le ciné-club lance son cycle SF avec un classique indémodable.",
      contenu: `Le ciné-club de l'école lance ce jeudi son grand cycle science-fiction : six films cultes projetés sur six semaines, tous les jeudis à 20h dans le grand amphi.

Le programme, choisi par vote des membres, balaie cinquante ans de SF au cinéma. Le cycle s'ouvre avec un classique indémodable des années 80, et se poursuivra avec des œuvres plus récentes qui ont redéfini le genre. Chaque projection sera suivie d'un débat animé par les membres du club, souvent prolongé au bar d'en face pour les plus motivés.

L'entrée est libre pour tous les étudiants, et le club fournit le pop-corn — une tradition désormais bien établie. Les places de l'amphi partant vite, il est conseillé d'arriver un peu en avance.

Le ciné-club rappelle par ailleurs qu'il recherche des volontaires pour rédiger les fiches de présentation des films et co-animer les débats. Une bonne porte d'entrée pour ceux qui veulent s'impliquer dans la vie associative sans engagement trop lourd.

Rendez-vous jeudi, lumières éteintes à 20h précises.`,
      imageUrl: "https://picsum.photos/seed/epitech-cine/1200/630",
      publie: true,
      aLaUne: false,
      vues: 87,
      auteurId: justice.id,
      categorieId: cat("culture-divertissement"),
    },
    {
      titre: "Brouillon : bilan du premier semestre (en cours de rédaction)",
      slug: "brouillon-bilan-premier-semestre",
      extrait:
        "Article en cours de rédaction sur le bilan du premier semestre : chiffres, événements marquants et perspectives.",
      contenu: `Cet article est un brouillon de démonstration. Il n'est visible que par les rédacteurs et administrateurs dans l'interface d'administration.

Le bilan du premier semestre est en cours de rédaction par l'équipe. Il couvrira les événements marquants, les chiffres de fréquentation du journal et les perspectives pour le semestre à venir.

Restez connectés pour la version finale !`,
      imageUrl: "https://picsum.photos/seed/epitech-bilan/1200/630",
      publie: false,
      aLaUne: false,
      vues: 0,
      auteurId: nisrine.id,
      categorieId: cat("actualites-ecole"),
    },
  ];

  const articlesCrees = [];
  for (const [i, data] of articles.entries()) {
    const article = await prisma.article.create({
      data: {
        ...data,
        createdAt: new Date(Date.now() - (articles.length - i) * 86400000),
      },
    });
    articlesCrees.push(article);
  }

  // Commentaires de démonstration
  const commentaires = [
    {
      articleId: articlesCrees[0].id,
      auteurId: lecteur.id,
      contenu:
        "Enfin des bornes de réservation pour les salles, c'était LA galère de l'an dernier. Merci pour le récap !",
    },
    {
      articleId: articlesCrees[0].id,
      auteurId: brandon.id,
      contenu:
        "Les équipes inter-promotions c'est une super nouvelle, on l'attendait depuis longtemps.",
    },
    {
      articleId: articlesCrees[1].id,
      auteurId: theophore.id,
      contenu:
        "Équipe déjà constituée de notre côté, rendez-vous le 24 ! Le thème ville intelligente ouvre plein de possibilités.",
    },
    {
      articleId: articlesCrees[1].id,
      auteurId: lecteur.id,
      contenu: "Quelqu'un cherche un membre pour compléter son équipe ?",
    },
    {
      articleId: articlesCrees[3].id,
      auteurId: lecteur.id,
      contenu:
        "Le conseil sur les projets perso est tellement vrai. Interview très inspirante, merci !",
    },
    {
      articleId: articlesCrees[4].id,
      auteurId: harys.id,
      contenu:
        "La médiathèque est effectivement le spot ultime, mais chut, il ne fallait pas le dire...",
    },
    {
      articleId: articlesCrees[7].id,
      auteurId: lecteur.id,
      contenu: "Quelle saison ! Tous derrière l'équipe pour les finales 🔥",
    },
  ];
  for (const c of commentaires) {
    await prisma.comment.create({ data: c });
  }

  // Réactions de démonstration
  const tousLesUsers = [nisrine, brandon, justice, theophore, harys, lecteur];
  const types = [
    TypeReaction.LIKE,
    TypeReaction.LOVE,
    TypeReaction.BRAVO,
    TypeReaction.INTERESSANT,
  ];
  for (const [i, article] of articlesCrees.entries()) {
    if (!article.publie) continue;
    const nbReactions = ((i * 7) % 4) + 2;
    for (let j = 0; j < nbReactions && j < tousLesUsers.length; j++) {
      await prisma.reaction.create({
        data: {
          articleId: article.id,
          userId: tousLesUsers[j].id,
          type: types[(i + j) % types.length],
        },
      });
    }
  }

  console.log("✅ Seed terminé :");
  console.log(`   - ${tousLesUsers.length} utilisateurs (mdp : Password123!)`);
  console.log(`   - ${categories.length} catégories`);
  console.log(`   - ${articlesCrees.length} articles`);
  console.log(`   - ${commentaires.length} commentaires`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
