import { Container } from "@/components/container";
import { navigationItems, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-soft-border bg-white/55 py-8">
      <Container className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-3xl tracking-[-0.04em] text-foreground">
            {siteConfig.brandName}
          </p>
          <p className="mt-1 text-sm text-muted">{siteConfig.city}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
