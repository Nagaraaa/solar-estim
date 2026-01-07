import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ComparatorSection } from "@/components/sections/ComparatorSection";

export const metadata = {
    title: "Rentabilité Solaire Belgique 2025 | Simulateur Gratuit Wallonie",
    description: "Simulateur photovoltaïque pour la Belgique. Calculez votre rentabilité avec ou sans batterie, le tarif prosumer et les primes régionales. Données précises.",
    alternates: {
        canonical: "https://www.solarestim.com/be",
    },
};

export default function HomeBe() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={<>Rentabilité Solaire en Belgique : <span className="text-brand">Le Guide 2025</span></>}
                subtitle="Wallonie, Bruxelles, Flandre : Calculez votre rentabilité selon votre région."
                ctaLink="/be/simulateur"
            />

            <FeatureSection variant="BE" />

            <ComparatorSection country="BE" />

            <BlogPreviewSection country="BE" />

            <CtaSection ctaLink="/be/simulateur" />
        </div>
    );
}

