import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Info, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";
import { CITIES_FR, getCityBySlug, getAllCitySlugs } from "../cities";

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// Random Intro Helper
function getRandomIntro(cityName: string) {
    const intros = [
        `Calculez votre rentabilité solaire à ${cityName} et découvrez les aides de l'État disponibles.`,
        `Estimez vos économies solaires précises pour votre maison à ${cityName} grâce à notre simulateur.`,
        `Le guide solaire complet pour les propriétaires à ${cityName} : prix, primes et rentabilité.`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
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
        title: `Panneaux Solaires à ${city.name} : Prime EDF OA & Rentabilité`,
        description: `Installation photovoltaïque à ${city.name} (${city.zip}) ? Tout sur la Prime à l'autoconsommation, le tarif d'achat EDF OA et les installateurs RGE.`,
        alternates: {
            canonical: `https://www.solarestim.com/villes/${city.slug}`,
        },
        openGraph: {
            title: `Solaire à ${city.name} : Le Guide 2025 (Aides & Prix)`,
            description: `Rentabilité, prime à l'autoconsommation et installateurs RGE à ${city.name}. Simulez votre projet.`,
            url: `https://www.solarestim.com/villes/${city.slug}`,
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

    const introText = getRandomIntro(city.name);

    // 3. Local Business Schema (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": `Installation Panneaux Solaires ${city.name}`,
                "provider": {
                    "@type": "Organization",
                    "name": "Solar Estim France",
                    "url": "https://www.solarestim.com"
                },
                "serviceType": "Solar Energy System Design",
                "areaServed": {
                    "@type": "City",
                    "name": city.name,
                    "postalCode": city.zip,
                    "addressCountry": "FR"
                },
                "description": `Étude de rentabilité et installation de panneaux photovoltaïques à ${city.name}.`,
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR",
                    "description": "Simulation et devis gratuits"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `Est-il rentable d'installer des panneaux solaires à ${city.name} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Absolument. En zone ${city.zone}, l'ensoleillement permet une rentabilité excellente. Grâce à la hausse des prix de l'électricité et à la vente du surplus, le retour sur investissement est rapide.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Quelles sont les aides pour le photovoltaïque à ${city.name} (${city.zip}) ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Vous êtes éligible à la Prime à l'autoconsommation versée par EDF OA et au Tarif d'achat subventionné pour la vente de votre surplus d'électricité (obligation d'achat sur 20 ans).`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Comment trouver un installateur RGE à ${city.name} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Nous collaborons uniquement avec des installateurs certifiés RGE QualiPV locaux, actifs à ${city.name}, pour garantir la conformité de votre installation et l'accès aux aides.`
                        }
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
                <Image
                    src="https://images.unsplash.com/photo-1508514177221-188b1cf2f24f?auto=format&fit=crop&w=2000&q=80"
                    alt={`Panneaux solaires ${city.name}`}
                    fill
                    priority
                    className="object-cover object-center opacity-20"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/90" />
                <FadeIn className="container relative z-10 px-4 md:px-6 mx-auto text-center" delay={100}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
                        <MapPin className="h-4 w-4" /> Installation Solaire : {city.name} ({city.zip})
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Passez au solaire à <span className="text-brand">{city.name}</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        {introText} Profitez de l'ensoleillement {city.zone === 'Sud' ? 'exceptionnel du Sud' : 'de votre région'} pour devenir indépendant.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/simulateur">
                            <Button size="lg" variant="brand" className="w-full sm:w-auto text-lg font-bold px-8 h-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                Calculer ma prime EDF OA <ArrowRight className="ml-2 h-5 w-5" />
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
                                    Pourquoi installer des panneaux solaires à {city.name} ?
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed">
                                    <p>
                                        À {city.name}, le potentiel photovoltaïque est idéal pour réduire votre facture d'électricité.
                                        En produisant votre propre énergie verte, vous vous protégez contre les hausses tarifaires.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-brand" /> Prime à l'autoconsommation et EDF OA
                                    </h3>
                                    <p>
                                        En France, l'État encourage la transition. Vous bénéficiez d'une prime à l'investissement versée en une fois, et d'un tarif d'achat garanti par EDF OA pour chaque kWh que vous injectez sur le réseau.
                                        C'est une sécurité financière sur 20 ans.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-brand" /> Installateurs RGE QualiPV
                                    </h3>
                                    <p>
                                        Pour bénéficier de ces aides, il est impératif de faire appel à un artisan certifié <strong>RGE (Reconnu Garant de l'Environnement)</strong>.
                                        Nos partenaires à {city.name} disposent de toutes les qualifications requises pour valider votre dossier EDF.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <Sun className="h-5 w-5 text-brand" /> Rentabilité Zone Ensoleillement {city.zone}
                                    </h3>
                                    <p>
                                        Située en zone {city.zone}, {city.name} offre un rendement optimal pour les installations bien orientées.
                                        Notre simulateur prend en compte les données météo précises de {city.name} pour estimer votre production annuelle.
                                    </p>
                                </div>

                                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                                    <Info className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-lg mb-1">Bon à savoir</h4>
                                        <p className="text-blue-800">
                                            La TVA est réduite à 10% (voire 5.5% pour certaines configurations) pour les installations inférieures à 3kWc.
                                            Profitez-en pour équiper votre toiture à {city.name} au meilleur prix.
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
                                        <h3 className="text-2xl font-bold">Votre Étude à {city.name}</h3>
                                        <p className="text-slate-300">
                                            Découvrez le montant de vos aides et votre rentabilité financière précise.
                                        </p>
                                        <Link href="/simulateur" className="block w-full">
                                            <Button size="lg" variant="brand" className="w-full font-bold">
                                                Lancer la simulation
                                            </Button>
                                        </Link>
                                        <p className="text-xs text-slate-400">100% Gratuit • Réponse immédiate</p>
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
                        Nos experts solaires en France
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {CITIES_FR.filter(c => c.slug !== city.slug).map((c) => (
                            <Link
                                key={c.slug}
                                href={`/villes/${c.slug}`}
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
