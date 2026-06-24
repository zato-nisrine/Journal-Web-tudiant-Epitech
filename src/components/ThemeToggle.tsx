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
      className="kicker p-1 text-[11px] leading-none text-muted transition-colors hover:text-accent"
    >
      <span className="dark:hidden">Nuit</span>
      <span className="hidden dark:inline">Jour</span>
    </button>
  );
}
