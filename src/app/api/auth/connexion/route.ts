import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { connexionSchema } from "@/lib/validations";

// POST /api/auth/connexion — se connecter
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = connexionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erreur: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Message volontairement identique pour ne pas révéler si l'e-mail existe
  const erreurIdentifiants = NextResponse.json(
    { erreur: "E-mail ou mot de passe incorrect" },
    { status: 401 }
  );

  if (!user) return erreurIdentifiants;

  const valide = await bcrypt.compare(password, user.passwordHash);
  if (!valide) return erreurIdentifiants;

  await createSession(user.id, user.role);
  return NextResponse.json({
    utilisateur: { id: user.id, nom: user.nom, email: user.email, role: user.role },
  });
}
