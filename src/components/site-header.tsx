"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { BRAND_NAME, navigationItems, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandLead, ...brandTail] = BRAND_NAME.split(" ");

  return (
    <header className="border-b border-soft-border/80 bg-[rgba(255,253,252,0.9)]">
      <Container className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5 sm:gap-4 sm:py-3 lg:flex lg:justify-between">
        <a
          href="#inicio"
          aria-label={`Ir al inicio de ${BRAND_NAME}`}
          className="flex min-w-0 items-center gap-2.5 overflow-hidden pr-2 sm:gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-soft-border bg-white shadow-[0_12px_30px_rgba(110,92,92,0.08)] sm:h-12 sm:w-12">
            <Image
              src={siteConfig.logoSrc}
              alt={siteConfig.logoAlt}
              fill
              sizes="(min-width: 640px) 48px, 40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 leading-none">
            <p className="truncate font-display text-[1.7rem] tracking-[-0.05em] text-foreground sm:text-2xl">
              {brandLead}
            </p>
            <p className="mt-1 hidden text-[0.68rem] uppercase tracking-[0.26em] text-muted sm:block">
              {brandTail.join(" ")}
            </p>
          </div>
        </a>

        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <nav aria-label="Navegación principal">
            <ul className="flex items-center gap-6 text-sm text-muted">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ButtonLink
            href={siteConfig.booking.url}
            target="_blank"
            aria-label={`${siteConfig.booking.ctaLabel} en una nueva pestaña`}
            className="min-h-11 px-5"
          >
            {siteConfig.booking.ctaLabel}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-transparent bg-foreground text-warm-white shadow-[0_10px_24px_rgba(87,71,71,0.14)] transition-colors hover:bg-[#2b2929] sm:border-soft-border sm:bg-white sm:text-foreground sm:shadow-[0_10px_24px_rgba(87,71,71,0.05)] sm:hover:border-sakura-strong lg:hidden"
          aria-label={menuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span
              className={cn(
                "block h-px w-4 bg-current transition-transform",
                menuOpen && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-4 bg-current transition-opacity",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-px w-4 bg-current transition-transform",
                menuOpen && "-translate-y-[5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-soft-border/70 bg-[rgba(255,253,252,0.96)] transition-all duration-300 lg:hidden",
          menuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-2 py-4">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <ButtonLink
            href={siteConfig.booking.url}
            target="_blank"
            aria-label={`${siteConfig.booking.ctaLabel} en una nueva pestaña`}
            className="mt-2"
            onClick={() => setMenuOpen(false)}
          >
            {siteConfig.booking.ctaLabel}
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
