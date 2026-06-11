import { z } from "zod";

export const inscriptionSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(60, "Le nom ne peut pas dépasser 60 caractères"),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe est trop long"),
});

export const connexionSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const articleSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(150, "Le titre ne peut pas dépasser 150 caractères"),
  extrait: z
    .string()
    .trim()
    .min(10, "L'extrait doit contenir au moins 10 caractères")
    .max(300, "L'extrait ne peut pas dépasser 300 caractères"),
  contenu: z
    .string()
    .trim()
    .min(50, "Le contenu doit contenir au moins 50 caractères"),
  imageUrl: z
    .string()
    .trim()
    .url("URL d'image invalide")
    .or(z.literal(""))
    .optional(),
  categorieId: z.string().min(1, "La catégorie est requise"),
  publie: z.boolean().optional().default(false),
  aLaUne: z.boolean().optional().default(false),
});

export const commentaireSchema = z.object({
  contenu: z
    .string()
    .trim()
    .min(2, "Le commentaire est trop court")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
});

export const reactionSchema = z.object({
  type: z.enum(["LIKE", "LOVE", "BRAVO", "INTERESSANT"]),
});

export const roleSchema = z.object({
  role: z.enum(["ADMIN", "REDACTEUR", "LECTEUR"]),
});
