import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Solar-Estim - Simulateur Rentabilité Panneaux Solaires Gratuit",
    template: "%s | Solar Estim",
  },
  description: "Calculez la rentabilité de vos panneaux solaires en 2 minutes. Simulateur gratuit, précis (données PVGIS 2024) et sans inscription. Estimez vos économies dès maintenant.",
  keywords: ["simulateur photovoltaïque", "rentabilité panneaux solaires", "simulation solaire gratuite", "prix installation solaire", "autoconsommation", "panneaux solaires", "devis solaire"],
  authors: [{ name: "Steve Herremans" }],
  creator: "Solar Estim",
  publisher: "Solar Estim",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-4">{children}</main>
          <Footer />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
