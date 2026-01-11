
import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { CITIES_FR } from "./cities";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Toutes nos villes en France - Solar Estim",
    description: "Découvrez le potentiel solaire de votre ville en France. Estimation de production, rentabilité et installateurs locaux.",
    alternates: {
        canonical: "https://www.solarestim.com/villes",
    },
};

export default function CitiesIndexPage() {
    // Group cities by department (first 2 digits of zip)
    const citiesByDept = CITIES_FR.reduce((acc, city) => {
        const dept = city.zip.substring(0, 2);
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(city);
        return acc;
    }, {} as Record<string, typeof CITIES_FR>);

    const sortedDepts = Object.keys(citiesByDept).sort();

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="bg-slate-900 text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Où souhaitez-vous installer des panneaux solaires ?
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Solar Estim accompagne les propriétaires dans toute la France. Trouvez votre ville ci-dessous pour découvrir le potentiel solaire de votre région et les aides disponibles localement.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    {sortedDepts.map((dept) => (
                        <FadeIn key={dept} className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2 flex items-center gap-2">
                                <span className="bg-brand/10 text-brand px-3 py-1 rounded text-lg font-mono">
                                    Département {dept}
                                </span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {citiesByDept[dept].map((city) => (
                                    <Link
                                        key={city.slug}
                                        href={`/villes/${city.slug}`}
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
                    ))}
                </div>
            </div>
        </div>
    );
}
