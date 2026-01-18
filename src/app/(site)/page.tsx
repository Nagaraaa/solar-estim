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

            <FeatureSection variant="FR" />

            <ComparatorSection />

            <BlogPreviewSection country="FR" />

            <TrustSection />

            <CtaSection ctaLink="/simulateur" />
        </div>
    );
}
