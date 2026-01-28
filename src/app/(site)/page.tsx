import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";

import { ComparatorSection } from "@/components/sections/ComparatorSection";
import { TrustSection } from "@/components/sections/TrustSection";


export const metadata = {
    title: "Simulateur Rentabilité Panneaux Solaires | France & Belgique (Gratuit)",
    description: "Calculez vos économies photovoltaïques en 2 min. Simulateur précis pour la Wallonie, Bruxelles et toute la France. Basé sur les données PVGIS. Sans inscription obligatoire.",
    alternates: {
        canonical: 'https://www.solarestim.com/',
        languages: {
            'fr-FR': 'https://www.solarestim.com/',
            'fr-BE': 'https://www.solarestim.com/be',
        },
    },
};

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={<>Estimez la rentabilité de vos panneaux solaires en <span className="text-brand">France et Belgique</span></>}
                subtitle="Un calcul précis basé sur l'ensoleillement réel de votre toiture (Données scientifiques PVGIS)."
                ctaLink="/simulateur"
            />

            {/* FEATURED GUIDE BLOCK */}
            <section className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="md:w-1/3 h-48 md:h-full relative min-h-[200px]">
                        <img
                            src="/images/guides/solar-ev-hero.jpg"
                            alt="Maison solaire avec voiture électrique"
                            className="absolute inset-0 w-full h-full object-cover object-[center_75%]"
                        />
                    </div>
                    <div className="p-6 md:p-8 md:w-2/3">
                        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                            Dossier 2026
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Solaire & Véhicule Électrique : Le guide de l'indépendance
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Découvrez comment transformer votre voiture en batterie domestique et rouler gratuitement grâce au soleil.
                        </p>
                        <a href="/guide/guide-solaire-vehicule-electrique-2026" className="text-brand font-bold hover:underline flex items-center gap-2">
                            Lire le dossier complet →
                        </a>
                    </div>
                </div>
            </section>

            <FeatureSection variant="FR" />

            <ComparatorSection />

            <BlogPreviewSection country="FR" />

            <TrustSection />

            <CtaSection ctaLink="/simulateur" />
        </div>
    );
}
