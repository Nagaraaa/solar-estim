import { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "./cities";
import { FadeIn } from "@/components/ui/fade-in";
import { MapPin, Sun, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Villes de Belgique : Installation Panneaux Solaires",
    description: "Découvrez le potentiel solaire de votre ville en Belgique (Wallonie, Bruxelles). Liste des installateurs agréés et primes régionales 2026.",
    alternates: {
        canonical: "https://www.solarestim.com/be/villes",
    },
};

export default function CitiesIndexPageBe() {
    // Group cities by Region
    const citiesByRegion = CITIES.reduce((acc, city) => {
        if (!acc[city.region]) acc[city.region] = [];
        acc[city.region].push(city);
        return acc;
    }, {} as Record<string, typeof CITIES>);

    const regions = ["Wallonie", "Bruxelles", "Flandre"];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container px-4 mx-auto text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Nos Zones d'Intervention en <span className="text-brand">Belgique</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Solar Estim accompagne les propriétaires dans toute la Belgique. Trouvez votre ville ci-dessous pour découvrir le potentiel solaire de votre région et les aides disponibles localement.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* City List */}
            <section className="py-16">
                <div className="container px-4 mx-auto max-w-5xl">
                    <FadeIn delay={200}>
                        {regions.map((region) => {
                            const regionCities = citiesByRegion[region];
                            if (!regionCities || regionCities.length === 0) return null;

                            return (
                                <div key={region} className="mb-12 last:mb-0">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                                        <div className="bg-brand/10 p-2 rounded-full">
                                            <Sun className="h-6 w-6 text-brand" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Région {region}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {regionCities.map((city) => (
                                            <Link
                                                key={city.slug}
                                                href={`/be/villes/${city.slug}`}
                                                className="group bg-white border border-slate-200 p-4 rounded-lg hover:border-brand hover:shadow-md transition-all flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <MapPin className="h-4 w-4 text-slate-400 group-hover:text-brand shrink-0" />
                                                    <span className="font-medium text-slate-700 group-hover:text-slate-900 truncate">
                                                        {city.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400 font-mono group-hover:text-brand/80">
                                                    {city.zip}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </FadeIn>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="container px-4 mx-auto text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        Votre localité n'est pas listée ?
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                        Nous couvrons l'ensemble de la Wallonie et la région de Bruxelles-Capitale. Testez votre éligibilité dès maintenant.
                    </p>
                    <Link href="/be/simulateur">
                        <Button size="lg" variant="brand" className="font-bold text-lg px-8">
                            Calculer ma rentabilité <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
