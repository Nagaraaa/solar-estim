import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Simulateur Rentabilité Panneaux Solaires | France & Belgique (Gratuit)",
    template: "%s | Solar Estim",
  },
  description: "Calculez vos économies photovoltaïques en 2 min. Simulateur précis pour la Wallonie, Bruxelles et toute la France. Basé sur les données PVGIS. Sans inscription obligatoire.",
  keywords: ["rentabilité panneaux solaires belgique", "calcul production photovoltaïque", "simulateur solaire wallonie", "prix installation panneau solaire", "rendement solaire france", "simulateur photovoltaïque", "rentabilité panneaux solaires", "simulation solaire gratuite", "autoconsommation", "panneaux solaires", "devis solaire"],
  authors: [{ name: "Steve Herremans" }],
  creator: "Solar Estim",
  publisher: "Solar Estim",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  metadataBase: new URL("https://www.solarestim.com"),
  alternates: {
    canonical: "/",
    languages: {
      'fr-FR': '/',
      'fr-BE': '/be',
    },
  },
  openGraph: {
    title: "Solar-Estim : Simulateur Gratuit de Rentabilité Panneaux Solaires",
    description: "Calculez en 2 minutes la rentabilité de votre installation photovoltaïque avec une précision de 95 % grâce aux données officielles PVGIS. Simulation gratuite, sans engagement !",
    url: 'https://www.solarestim.com/',
    siteName: 'Solar Estim',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Solar Estim Simulateur Gratuit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Solar-Estim : Simulateur Gratuit de Rentabilité Panneaux Solaires",
    description: "Calculez en 2 minutes la rentabilité de votre installation photovoltaïque avec une précision de 95 % grâce aux données officielles PVGIS.",
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { headers } from "next/headers";
import CountrySelectorModal from "@/components/layout/CountrySelectorModal";
import { NonceProvider } from "@/components/providers/NonceProvider";
import { AdminAwareLayout } from "@/components/layout/AdminAwareLayout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const detectedCountry = headersList.get('x-detected-country') || 'FR';

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <NonceProvider nonce={headersList.get("x-nonce") || undefined}>
            <AdminAwareLayout
              header={<Header />}
              footer={<Footer />}
              mobileCta={<StickyMobileCTA />}
              others={
                <>
                  <CountrySelectorModal detectedCountry={detectedCountry} />
                  <CookieConsent />
                </>
              }
            >
              {children}
            </AdminAwareLayout>
          </NonceProvider>
        </div>
      </body>
    </html>
  );
}
