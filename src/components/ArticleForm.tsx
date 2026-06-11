"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Categorie = { id: string; nom: string };

type ArticleExistant = {
  id: string;
  titre: string;
  extrait: string;
  contenu: string;
  imageUrl: string | null;
  categorieId: string;
  publie: boolean;
  aLaUne: boolean;
};

const classChamp =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-blue-900";

export default function ArticleForm({
  categories,
  article,
}: {
  categories: Categorie[];
  article?: ArticleExistant;
}) {
  const router = useRouter();
  const [valeurs, setValeurs] = useState({
    titre: article?.titre ?? "",
    extrait: article?.extrait ?? "",
    contenu: article?.contenu ?? "",
    imageUrl: article?.imageUrl ?? "",
    categorieId: article?.categorieId ?? categories[0]?.id ?? "",
    publie: article?.publie ?? false,
    aLaUne: article?.aLaUne ?? false,
  });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  function champ<K extends keyof typeof valeurs>(cle: K, valeur: (typeof valeurs)[K]) {
    setValeurs((v) => ({ ...v, [cle]: valeur }));
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch(
        article ? `/api/articles/${article.id}` : "/api/articles",
        {
          method: article ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(valeurs),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? "Une erreur est survenue");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={enregistrer} className="space-y-5">
      <div>
        <label htmlFor="titre" className="mb-1 block text-sm font-semibold">
          Titre
        </label>
        <input
          id="titre"
          type="text"
          value={valeurs.titre}
          onChange={(e) => champ("titre", e.target.value)}
          required
          minLength={5}
          maxLength={150}
          placeholder="Un titre accrocheur…"
          className={classChamp}
        />
      </div>

      <div>
        <label htmlFor="extrait" className="mb-1 block text-sm font-semibold">
          Extrait <span className="font-normal text-slate-400">(affiché sur les cartes, 300 caractères max)</span>
        </label>
        <textarea
          id="extrait"
          value={valeurs.extrait}
          onChange={(e) => champ("extrait", e.target.value)}
          required
          minLength={10}
          maxLength={300}
          rows={2}
          placeholder="Résumé en une ou deux phrases…"
          className={classChamp}
        />
      </div>

      <div>
        <label htmlFor="contenu" className="mb-1 block text-sm font-semibold">
          Contenu <span className="font-normal text-slate-400">(séparez les paragraphes par une ligne vide)</span>
        </label>
        <textarea
          id="contenu"
          value={valeurs.contenu}
          onChange={(e) => champ("contenu", e.target.value)}
          required
          minLength={50}
          rows={14}
          placeholder="Le corps de l'article…"
          className={classChamp}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm font-semibold">
            Image de couverture <span className="font-normal text-slate-400">(URL, optionnelle)</span>
          </label>
          <input
            id="imageUrl"
            type="url"
            value={valeurs.imageUrl}
            onChange={(e) => champ("imageUrl", e.target.value)}
            placeholder="https://…"
            className={classChamp}
          />
        </div>
        <div>
          <label htmlFor="categorie" className="mb-1 block text-sm font-semibold">
            Catégorie
          </label>
          <select
            id="categorie"
            value={valeurs.categorieId}
            onChange={(e) => champ("categorieId", e.target.value)}
            required
            className={classChamp}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={valeurs.publie}
            onChange={(e) => champ("publie", e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Publier immédiatement
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={valeurs.aLaUne}
            onChange={(e) => champ("aLaUne", e.target.checked)}
            className="h-4 w-4 accent-amber-500"
          />
          ⭐ Mettre à la une
        </label>
      </div>

      {erreur && (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {erreur}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={envoi}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {envoi ? "Enregistrement…" : article ? "Enregistrer les modifications" : "Créer l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
