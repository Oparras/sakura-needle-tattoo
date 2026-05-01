import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { BRAND_NAME, siteConfig } from "@/config/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  title: {
    default: `${BRAND_NAME} | Tatuajes personalizados en Madrid`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: siteConfig.description,
  keywords: [
    "tatuajes personalizados Madrid",
    "tatuadora Madrid",
    "estudio boutique tattoo",
    "mini tattoos Madrid",
    "Sakura Needle Tattoo",
  ],
  applicationName: BRAND_NAME,
  category: "beauty",
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${BRAND_NAME} | Tatuajes personalizados en Madrid`,
    description: siteConfig.description,
    type: "website",
    locale: "es_ES",
    siteName: BRAND_NAME,
    url: siteConfig.siteUrl,
    images: [
      {
        url: siteConfig.logoSrc,
        width: 1024,
        height: 1024,
        alt: siteConfig.logoAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Estudio boutique en Madrid`,
    description: siteConfig.description,
    images: [siteConfig.logoSrc],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
