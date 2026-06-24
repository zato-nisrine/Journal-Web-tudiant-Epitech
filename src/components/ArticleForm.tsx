"use client";

import { useState } from "react";
import Image from "next/image";
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
  "w-full border border-ink bg-surface p-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

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
  const [uploadEnCours, setUploadEnCours] = useState(false);
  const [erreurImage, setErreurImage] = useState("");

  function champ<K extends keyof typeof valeurs>(cle: K, valeur: (typeof valeurs)[K]) {
    setValeurs((v) => ({ ...v, [cle]: valeur }));
  }

  async function televerser(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setErreurImage("");
    setUploadEnCours(true);
    try {
      const data = new FormData();
      data.append("fichier", fichier);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) {
        setErreurImage(json.erreur ?? "Le téléversement a échoué");
        return;
      }
      champ("imageUrl", json.url);
    } catch {
      setErreurImage("Le téléversement a échoué");
    } finally {
      setUploadEnCours(false);
      e.target.value = ""; // permet de re-sélectionner le même fichier
    }
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
          Extrait <span className="font-normal text-muted">(affiché sur les cartes, 300 caractères max)</span>
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
          Contenu <span className="font-normal text-muted">(séparez les paragraphes par une ligne vide)</span>
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
          <label className="mb-1 block text-sm font-semibold">
            Image de couverture <span className="font-normal text-muted">(optionnelle)</span>
          </label>
          {valeurs.imageUrl ? (
            <div className="flex items-center gap-4">
              <Image
                src={valeurs.imageUrl}
                alt="Aperçu de la couverture"
                width={128}
                height={80}
                unoptimized
                className="h-20 w-32 border border-ink object-cover"
              />
              <button
                type="button"
                onClick={() => champ("imageUrl", "")}
                className="text-sm font-medium text-accent hover:underline"
              >
                Retirer l&apos;image
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center border border-dashed border-ink bg-surface px-4 py-6 text-center text-sm text-muted transition-colors hover:border-accent hover:text-accent">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={televerser}
                disabled={uploadEnCours}
                className="hidden"
              />
              {uploadEnCours
                ? "Téléversement…"
                : "Choisir une image (JPG, PNG, WebP, GIF — 5 Mo max)"}
            </label>
          )}
          {erreurImage && <p className="mt-1 text-sm text-accent">{erreurImage}</p>}
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
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Publier immédiatement
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={valeurs.aLaUne}
            onChange={(e) => champ("aLaUne", e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Mettre à la une
        </label>
      </div>

      {erreur && (
        <p className="border-l-2 border-accent bg-accent/5 p-3 text-sm font-medium text-accent">
          {erreur}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={envoi}
          className="kicker bg-ink px-5 py-2.5 text-xs text-paper transition-colors hover:bg-accent disabled:opacity-50"
        >
          {envoi ? "Enregistrement…" : article ? "Enregistrer les modifications" : "Créer l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-muted hover:text-accent"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
