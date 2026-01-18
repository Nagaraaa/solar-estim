import ComparateurIndexContent from "@/components/content/ComparateurIndexContent";


export const metadata = {
    title: "Comparateur Panneaux Solaires & Batteries | Tests Techniques",
    description: "Comparatifs techniques indépendants : Enphase vs SolarEdge, Huawei vs Tesla. Données réelles pour faire le meilleur choix.",
    alternates: {
        canonical: 'https://www.solarestim.com/comparateur',
        languages: {
            'fr-FR': 'https://www.solarestim.com/comparateur',
            'fr-BE': 'https://www.solarestim.com/be/comparateur',
        },
    },
};

export default function ComparateurIndex() {
    return <ComparateurIndexContent country="FR" />;
}
