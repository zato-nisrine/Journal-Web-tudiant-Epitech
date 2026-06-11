"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const classChamp =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-blue-900";

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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-2xl font-black tracking-tight">
          {inscription ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
            <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={envoi}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {envoi
              ? "Un instant…"
              : inscription
                ? "Créer mon compte"
                : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {inscription ? (
            <>
              Déjà un compte ?{" "}
              <Link href="/connexion" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Se connecter
              </Link>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                S&apos;inscrire
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
