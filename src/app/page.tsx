import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { BookingSection } from "@/components/sections/booking-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WorksSection } from "@/components/sections/works-section";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <div className="relative isolate w-full overflow-x-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(244,199,205,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(231,174,184,0.12),transparent_26%)]" />
        <SiteHeader />
        <main id="contenido">
          <HeroSection />
          <AboutSection />
          <WorksSection />
          <ServicesSection />
          <ProcessSection />
          <BookingSection />
          <FaqSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
