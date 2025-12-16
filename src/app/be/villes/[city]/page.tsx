import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { CITIES, getCityBySlug, getAllCitySlugs } from "../cities";

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// 1. Static Generation for high performance SEO
export async function generateStaticParams() {
    const slugs = getAllCitySlugs();
    return slugs.map((slug) => ({
        city: slug,
    }));
}

// 2. Dynamic Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);
    if (!city) return {};

    return {
        title: `Expertise Solaire à ${city.name} : Rentabilité & Devis 2025`,
        description: `Installation photovoltaïque à ${city.name} (${city.zip}) ? Découvrez les primes wallonnes et calculez votre rentabilité solaire exacte. Devis gratuit.`,
        alternates: {
            canonical: `https://www.solarestim.com/be/villes/${city.slug}`,
        },
        openGraph: {
            title: `Panneaux Solaires à ${city.name} : Guide Complet 2025`,
            description: `Rentabilité, primes et installateurs agréés à ${city.name}. Simulez votre projet en 2 min.`,
            url: `https://www.solarestim.com/be/villes/${city.slug}`,
            type: "article",
        },
    };
}

export default async function CityPage({ params }: PageProps) {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);

    if (!city) {
        notFound();
    }

    // 3. Local Business Schema (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Installation Panneaux Solaires ${city.name}`,
        "provider": {
            "@type": "Organization",
            "name": "Solar Estim Belgique",
            "url": "https://www.solarestim.com/be"
        },
        "serviceType": "Solar Energy System Design",
        "areaServed": {
            "@type": "City",
            "name": city.name,
            "postalCode": city.zip,
            "addressRegion": city.region,
            "addressCountry": "BE"
        },
        "description": `Étude de rentabilité et installation de panneaux photovoltaïques à ${city.name}.`,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Simulation et devis gratuits"
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.8),rgba(15,23,42,0.9)),url('https://images.unsplash.com/photo-1508514177221-188b1cf2f24f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
                <FadeIn className="container relative z-10 px-4 md:px-6 mx-auto text-center" delay={100}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
                        <MapPin className="h-4 w-4" /> Expertise Locale : {city.name} ({city.zip})
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Passez au solaire à <span className="text-brand">{city.name}</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Profitez de l'ensoleillement de votre région pour réduire vos factures.
                        Analyse de rentabilité précise et raccordement au réseau {city.region === "Wallonie" ? "wallon" : "belge"}.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/be/simulateur">
                            <Button size="lg" variant="brand" className="w-full sm:w-auto text-lg font-bold px-8 h-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                Démarrer mon étude gratuite <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* Advisory Content */}
            <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="md:col-span-8 space-y-8">
                            <FadeIn delay={200}>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                    Pourquoi installer des panneaux photovoltaïques à {city.name} ?
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed">
                                    <p>
                                        {city.name}, située en région {city.region}, bénéficie d'un potentiel solaire souvent sous-estimé.
                                        Même avec une météo variable, les panneaux solaires modernes captent le rayonnement diffus pour produire de l'électricité verte toute l'année.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-brand" /> Compteur qui tourne à l'envers et Tarif Prosumer
                                    </h3>
                                    <p>
                                        En Wallonie, le mécanisme du "compteur qui tourne à l'envers" reste un avantage majeur pour les installations existantes, mais les nouvelles installations bénéficient aussi d'un cadre favorable pour l'autoconsommation.
                                        À {city.name}, maximiser votre autoconsommation est la clé pour contourner le tarif Prosumer et rentabiliser votre installation en moins de 7 ans.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-brand" /> Valorisation de votre bien immobilier
                                    </h3>
                                    <p>
                                        Au-delà des économies immédiates sur votre facture d'électricité, installer des panneaux solaires à {city.name} augmente significativement le score PEB de votre habitation.
                                        C'est un investissement pérenne qui valorise votre patrimoine immobilier dans le code postal {city.zip}.
                                    </p>
                                </div>

                                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                                    <Info className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-lg mb-1">Le saviez-vous ?</h4>
                                        <p className="text-blue-800">
                                            Une installation moyenne à {city.name} permet d'économiser jusqu'à 1 200€ par an.
                                            Notre simulateur prend en compte l'orientation précise de votre toiture à {city.name} pour un calcul réaliste.
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-4 space-y-6">
                            <FadeIn delay={300}>
                                <Card className="border-brand border-2 shadow-lg bg-slate-900 text-white">
                                    <CardContent className="p-6 pt-8 text-center space-y-6">
                                        <h3 className="text-2xl font-bold">Prêt à calculer vos gains ?</h3>
                                        <p className="text-slate-300">
                                            Obtenez votre rapport de rentabilité personnalisé pour votre maison à {city.name}.
                                        </p>
                                        <Link href="/be/simulateur" className="block w-full">
                                            <Button size="lg" variant="brand" className="w-full font-bold">
                                                Simuler mon projet
                                            </Button>
                                        </Link>
                                        <p className="text-xs text-slate-400">Gratuit • Sans engagement • Certifié PVGIS</p>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cross Linking Grid */}
            <section className="py-12 bg-white border-t border-slate-200">
                <div className="container px-4 md:px-6 mx-auto">
                    <h3 className="text-center text-lg font-semibold text-slate-900 mb-8">
                        Nos autres zones d'intervention en Wallonie
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {CITIES.filter(c => c.slug !== city.slug).map((c) => (
                            <Link
                                key={c.slug}
                                href={`/be/villes/${c.slug}`}
                                className="text-sm px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-brand hover:text-slate-900 transition-colors"
                            >
                                Panneaux solaires {c.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
