import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ComparatorSection } from "@/components/sections/ComparatorSection";

export const metadata = {
    title: "Rentabilité Solaire Belgique 2026 | Simulateur Gratuit Wallonie",
    description: "Calculez votre rentabilité photovoltaïque en Wallonie et Bruxelles. Mise à jour 2026 : Tarif Prosumer, Certificats Verts, et Primes. Simulateur précis et gratuit.",
    alternates: {
        canonical: 'https://www.solarestim.com/be',
        languages: {
            'fr-BE': 'https://www.solarestim.com/be',
            'fr-FR': 'https://www.solarestim.com/',
        },
    },
};

export default function BelgiumHome() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={<>Rentabilité Solaire en Belgique : <span className="text-brand">Le Guide 2026</span></>}
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

