import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Role } from "@prisma/client";
import { prisma } from "./prisma";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = "session";
const DUREE_SESSION_JOURS = 7;

export type SessionPayload = {
  userId: string;
  role: Role;
};

export async function createSession(userId: string, role: Role) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DUREE_SESSION_JOURS}d`)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * DUREE_SESSION_JOURS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { userId: payload.userId as string, role: payload.role as Role };
  } catch {
    return null;
  }
}

/**
 * Utilisateur courant (sans le hash du mot de passe).
 * Mis en cache par requête via React cache.
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, nom: true, email: true, role: true, createdAt: true },
  });
});

export function peutRediger(role: Role | undefined | null): boolean {
  return role === "ADMIN" || role === "REDACTEUR";
}

export function estAdmin(role: Role | undefined | null): boolean {
  return role === "ADMIN";
}
