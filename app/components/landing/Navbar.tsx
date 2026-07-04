"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ScrollLink from "./ScrollLink";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav id="site-navbar" className="sticky top-0 z-10 border-b border-border-soft bg-surface-1">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="font-display text-xl font-bold tracking-tight text-text-strong">
          Edu<span className="text-brand">Slide</span>
        </div>
        <ul className="hidden gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <ScrollLink
                href={link.href}
                className="text-sm text-text-muted transition-colors hover:text-text-strong"
              >
                {link.label}
              </ScrollLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/login"
            className="hidden text-sm text-text-muted transition-colors hover:text-text-strong sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover sm:px-5"
          >
            Start free trial
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-strong hover:bg-surface-2 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border-soft px-6 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <ScrollLink
                  href={link.href}
                  className="block py-2 text-sm text-text-muted transition-colors hover:text-text-strong"
                >
                  {link.label}
                </ScrollLink>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block py-2 text-sm text-text-muted transition-colors hover:text-text-strong"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
