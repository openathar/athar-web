"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Navigation wie in der COMPUTE-Vorlage: oben unsichtbar ueber dem Hero,
 * beim Scrollen schrumpft sie zur Glas-Kapsel mit Rand und Schatten.
 *
 * Der Zustand ist ein einziges Boolean an der Sollbruchstelle (Header- oder
 * Kapsel-Modus), damit die Transition nicht zwei Klassen gegeneinander
 * animiert. Gemessen wird mit einem Raster statt `scrollY > 40`, damit ein
 * Trackpad nicht an jeder Grenze hin- und herpendelt.
 */
export function NavShell({
  links,
  brand,
  trailing,
  cta,
  menuLabel,
  closeLabel,
}: {
  links: { href: string; label: string }[];
  brand: ReactNode;
  trailing: ReactNode;
  cta: { href: string; label: string };
  menuLabel: string;
  closeLabel: string;
}) {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.querySelector("[data-nav-sentinel]");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setCondensed(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        condensed ? "pt-4" : "pt-0"
      }`}
    >
      <nav
        aria-label={menuLabel}
        className={`mx-auto flex items-center gap-x-6 px-5 transition-all duration-500 ease-out ${
          condensed
            ? "max-w-[74rem] rounded-full border border-rule bg-surface/80 px-8 py-2.5 shadow-lg backdrop-blur-xl"
            : "max-w-[80rem] border-b border-transparent bg-transparent py-6"
        }`}
      >
        {brand}

        <ul className="mx-auto hidden items-center gap-x-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="mono text-muted transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ms-auto lg:ms-0">{trailing}</div>

        <a
          href={cta.href}
          className="mono hidden whitespace-nowrap rounded-full bg-accent px-5 py-2 text-paper transition hover:opacity-90 lg:inline-block"
        >
          {cta.label}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="p-2 text-ink lg:hidden"
        >
          <span className="sr-only">{open ? closeLabel : menuLabel}</span>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            {open ? (
              <path d="M4 4 L18 18 M18 4 L4 18" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M3 6 H19 M3 11 H19 M3 16 H19" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="ba-glass mt-3 border border-rule lg:hidden">
          <ul className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display block py-3 text-2xl text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={cta.href}
                onClick={() => setOpen(false)}
                className="mono mt-2 block bg-accent px-5 py-3 text-center text-paper"
              >
                {cta.label}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}