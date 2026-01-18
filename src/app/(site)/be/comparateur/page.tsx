import ComparateurIndexContent from "@/components/content/ComparateurIndexContent";

export const metadata = {
    title: "Comparateur Solaire Belgique : Le Labo Technique | Solar-Estim",
    description: "Analyses techniques indépendantes pour la Belgique. Tarif Prosumer, Panneau SolarEdge vs Enphase. Faites le bon choix pour votre rentabilité.",
    alternates: {
        canonical: 'https://www.solarestim.com/be/comparateur',
        languages: {
            'fr-FR': 'https://www.solarestim.com/comparateur',
            'fr-BE': 'https://www.solarestim.com/be/comparateur',
        },
    },
};

export default function ComparateurIndexBE() {
    return <ComparateurIndexContent country="BE" />;
}
