import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { inscriptionSchema } from "@/lib/validations";

// POST /api/auth/inscription — créer un compte (rôle LECTEUR par défaut)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = inscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erreur: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { nom, email, password } = parsed.data;

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    return NextResponse.json(
      { erreur: "Un compte existe déjà avec cette adresse e-mail" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { nom, email, passwordHash },
    select: { id: true, nom: true, email: true, role: true },
  });

  await createSession(user.id, user.role);
  return NextResponse.json({ utilisateur: user }, { status: 201 });
}
