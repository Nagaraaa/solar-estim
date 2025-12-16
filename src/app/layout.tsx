import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Solar-Estim - Simulateur Photovoltaïque",
    template: "%s | Solar Estim - Simulateur Photovoltaïque",
  },
  description: "Calculez la rentabilité de vos panneaux solaires en 2 minutes. Simulateur gratuit, précis (données PVGIS) et sans inscription obligatoire.",
  keywords: ["panneau solaire", "rentabilité photovoltaïque", "simulateur solaire gratuit", "devis solaire"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
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
