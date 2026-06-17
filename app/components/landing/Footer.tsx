import { Globe, Mail, MessageCircle } from "lucide-react";
import ScrollLink from "./ScrollLink";

const productLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#security" },
];

const socials = [
  { icon: Mail, href: "mailto:hello@eduslide.app", label: "Email" },
  { icon: MessageCircle, href: "#", label: "Support chat" },
  { icon: Globe, href: "#", label: "Website" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface-1">
      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-xl font-bold tracking-tight text-text-strong">
              Edu<span className="text-brand">Slide</span>
            </div>
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-text-muted">
              Privacy-first AI that turns documents into ready-to-present
              slides.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft bg-surface-2 text-text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-strong">
              Product
            </div>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <ScrollLink
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-strong">
              Legal
            </div>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-strong">
              Get started
            </div>
            <p className="mb-4 text-sm leading-relaxed text-text-muted">
              Free for your first 10 decks. No credit card required.
            </p>
            <button className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover">
              Start free trial
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-border-soft pt-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-text-muted">
            © 2026 EduSlide. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Made for educators, by educators.
          </p>
        </div>
      </div>
    </footer>
  );
}
