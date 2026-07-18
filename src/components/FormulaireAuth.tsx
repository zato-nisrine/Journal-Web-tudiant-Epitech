"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const classChamp =
  "w-full border border-ink bg-surface p-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

export default function FormulaireAuth({ mode }: { mode: "connexion" | "inscription" }) {
  const router = useRouter();
  const inscription = mode === "inscription";
  const [valeurs, setValeurs] = useState({ nom: "", email: "", password: "" });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          inscription
            ? valeurs
            : { email: valeurs.email, password: valeurs.password }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? "Une erreur est survenue");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="border-2 border-ink bg-surface p-8">
        <h1 className="border-b border-rule pb-3 font-display text-3xl font-black">
          {inscription ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {inscription
            ? "Rejoignez la communauté du journal pour commenter et réagir."
            : "Content de vous revoir !"}
        </p>

        <form onSubmit={soumettre} className="mt-6 space-y-4">
          {inscription && (
            <div>
              <label htmlFor="nom" className="mb-1 block text-sm font-semibold">
                Nom
              </label>
              <input
                id="nom"
                type="text"
                value={valeurs.nom}
                onChange={(e) => setValeurs({ ...valeurs, nom: e.target.value })}
                required
                minLength={2}
                maxLength={60}
                placeholder="Prénom Nom"
                className={classChamp}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={valeurs.email}
              onChange={(e) => setValeurs({ ...valeurs, email: e.target.value })}
              required
              placeholder="prenom.nom@epitech.eu"
              className={classChamp}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={valeurs.password}
              onChange={(e) => setValeurs({ ...valeurs, password: e.target.value })}
              required
              minLength={inscription ? 8 : 1}
              placeholder={inscription ? "8 caractères minimum" : "••••••••"}
              autoComplete={inscription ? "new-password" : "current-password"}
              className={classChamp}
            />
          </div>

          {erreur && (
            <p className="border-l-2 border-accent bg-accent/5 p-3 text-sm font-medium text-accent">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={envoi}
            className="kicker w-full bg-accent2 py-3 text-xs text-paper transition-colors hover:bg-accent2-hover disabled:opacity-50"
          >
            {envoi
              ? "Un instant…"
              : inscription
                ? "Créer mon compte"
                : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {inscription ? (
            <>
              Déjà un compte ?{" "}
              <Link href="/connexion" className="font-semibold text-accent hover:underline">
                Se connecter
              </Link>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="font-semibold text-accent hover:underline">
                S&apos;inscrire
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
