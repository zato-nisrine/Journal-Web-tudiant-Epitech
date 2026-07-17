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
      className="rounded-full p-2 text-muted transition-colors hover:bg-rule/40 hover:text-accent"
    >
      {/* Icône lune : visible en mode clair, pour passer en mode sombre */}
      <svg
        className="dark:hidden"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
      {/* Icône soleil : visible en mode sombre, pour repasser en mode clair */}
      <svg
        className="hidden dark:inline"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
}