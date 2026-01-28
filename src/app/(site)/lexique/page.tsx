import Link from "next/link";
import { getAllDefinitions } from "@/lib/lexicon";
import { LexiconFilterableGrid } from "@/components/lexicon/LexiconFilterableGrid";

export const metadata = {
    title: "Lexique Solaire : Le Dictionnaire du Photovoltaïque | Solar-Estim",
    description: "Comprenez tous les termes techniques du solaire (kWc, Onduleur, Tarif Prosumer) avant de lancer votre installation.",
    alternates: {
        canonical: 'https://www.solarestim.com/lexique',
        languages: {
            'fr-FR': 'https://www.solarestim.com/lexique',
            'fr-BE': 'https://www.solarestim.com/be/lexique',
        },
    },
};

export default async function LexiconIndex() {
    const terms = await getAllDefinitions('FR');

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Le Lexique Solaire</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Le solaire peut paraître complexe. Nous avons traduit le jargon technique en français simple pour vous aider à comprendre votre future installation avant de simuler sa rentabilité.
                </p>
            </div>

            <LexiconFilterableGrid terms={terms} country="FR" />

        </div>
    );
}
