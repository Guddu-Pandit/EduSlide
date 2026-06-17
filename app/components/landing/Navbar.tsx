const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-border-soft bg-surface-1 px-6 py-4 sm:px-10">
      <div className="font-display text-xl font-bold tracking-tight text-text-strong">
        Edu<span className="text-brand">Slide</span>
      </div>
      <ul className="hidden gap-7 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text-strong"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <button className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover">
        Start free trial
      </button>
    </nav>
  );
}
