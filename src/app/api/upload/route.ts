import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { v2 as cloudinary } from "cloudinary";
import { getSession, peutRediger } from "@/lib/auth";

export const runtime = "nodejs";

const TAILLE_MAX = 5 * 1024 * 1024; // 5 Mo
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// POST /api/upload — téléverse une image de couverture (REDACTEUR ou ADMIN)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Authentification requise" }, { status: 401 });
  }
  if (!peutRediger(session.role)) {
    return NextResponse.json(
      { erreur: "Seuls les rédacteurs et administrateurs peuvent téléverser" },
      { status: 403 }
    );
  }

  const form = await req.formData().catch(() => null);
  const fichier = form?.get("fichier");
  if (!(fichier instanceof File)) {
    return NextResponse.json({ erreur: "Aucun fichier reçu" }, { status: 400 });
  }

  const extension = TYPES[fichier.type];
  if (!extension) {
    return NextResponse.json(
      { erreur: "Format non supporté (JPG, PNG, WebP ou GIF uniquement)" },
      { status: 400 }
    );
  }
  if (fichier.size > TAILLE_MAX) {
    return NextResponse.json(
      { erreur: "Image trop lourde (5 Mo maximum)" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await fichier.arrayBuffer());
  const nom = `${randomUUID()}.${extension}`;

  // Si Cloudinary est configuré via les variables d'environnement, on l'utilise
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const dataUri = `data:${fichier.type};base64,${buffer.toString("base64")}`;
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "journal",
        public_id: nom.replace(/\.[^/.]+$/, ""),
        resource_type: "image",
      });
      return NextResponse.json({ url: result.secure_url }, { status: 201 });
    } catch (err) {
      console.error("Cloudinary upload error", err);
      return NextResponse.json({ erreur: "Échec de l'upload vers Cloudinary" }, { status: 500 });
    }
  }

  // En production (Vercel), le système de fichiers est en lecture seule :
  // si un stockage objet est configuré, on l'utilise. Sinon, écriture locale.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${nom}`, buffer, {
      access: "public",
      contentType: fichier.type,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  }

  const dossier = path.join(process.cwd(), "public", "uploads");
  await mkdir(dossier, { recursive: true });
  await writeFile(path.join(dossier, nom), buffer);

  return NextResponse.json({ url: `/uploads/${nom}` }, { status: 201 });
}
