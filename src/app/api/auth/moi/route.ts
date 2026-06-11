import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET /api/auth/moi — utilisateur connecté (ou null)
export async function GET() {
  const utilisateur = await getCurrentUser();
  return NextResponse.json({ utilisateur });
}
