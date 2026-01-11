
import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { CITIES } from "./cities";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Villes couvertes en Belgique - Solar Estim",
    description: "Installation de panneaux solaires en Wallonie et à Bruxelles. Trouvez votre ville pour une estimation personnalisée.",
    alternates: {
        canonical: "https://www.solarestim.com/be/villes",
    },
};

export default function CitiesIndexPageBe() {
    // Group cities by province/region based on zip
    // 1000-1299: Bruxelles
    // 1300-1499: Brabant Wallon
    // 4000-4999: Liège
    // 5000-5999: Namur
    // 6000-6599: Hainaut (Charleroi)
    // 6600-6999: Luxembourg
    // 7000-7999: Hainaut (Mons/Tournai)

    // Simplification: Group by first digit roughly or just list all

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="bg-slate-900 text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Votre expert solaire en Belgique
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Nous intervenons partout en Wallonie et à Bruxelles. Sélectionnez votre commune pour voir les données d'ensoleillement et de rentabilité spécifiques.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {CITIES.map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/be/villes/${city.slug}`}
                                    className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-brand hover:shadow-md transition-all flex items-center gap-3"
                                >
                                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-brand/10 transition-colors">
                                        <MapPin className="h-5 w-5 text-slate-400 group-hover:text-brand" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 group-hover:text-brand transition-colors">
                                            {city.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {city.zip}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
