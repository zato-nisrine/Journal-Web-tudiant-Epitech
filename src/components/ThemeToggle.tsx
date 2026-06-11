"use client";

export default function ThemeToggle() {
  // L'icône affichée est pilotée par la classe `dark` du <html> via Tailwind,
  // ce qui évite tout écart d'hydratation entre serveur et client.
  function basculer() {
    const sombre = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", sombre ? "dark" : "light");
  }

  return (
    <button
      onClick={basculer}
      aria-label="Changer de thème"
      title="Changer de thème"
      className="rounded-full p-2 text-lg leading-none transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </button>
  );
}
