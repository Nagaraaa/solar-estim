import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Info, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";
import { CITIES, getCityBySlug, getAllCitySlugs } from "../cities";
import { FAQSection } from "@/components/FAQSection";
import { faqs } from "@/data/faqs";

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// --- SPINTAX HELPER ---
function getSeed(str: string): number {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
        seed = (seed << 5) - seed + str.charCodeAt(i);
        seed |= 0;
    }
    return Math.abs(seed);
}

function spin(options: string[], seed: number, index: number): string {
    const combinedSeed = seed + index;
    return options[combinedSeed % options.length];
}

// --- DYNAMIC INTERNAL LINKS (BE) ---
const LEXICON_ARTICLES = [
    { title: "Certification RESCert Obligatoire", slug: "rescert-installateur-photovoltaique", label: "Info RESCert" },
    { title: "Comprendre le Tarif Prosumer", slug: "tarif-prosumer-wallonie-2025", label: "Guide Prosumer" },
    { title: "Primes Région Wallonne 2026", slug: "primes-solaire-belgique-2025", label: "Primes 2026" },
    { title: "Technologie IBC vs TOPCon", slug: "technologies-solaires-2026-ibc-topcon-hjt-be", label: "Comparatif Tech" },
];

const DynamicLexiconLink = ({ seed }: { seed: number }) => {
    const article = LEXICON_ARTICLES[seed % LEXICON_ARTICLES.length];
    return (
        <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium mb-2">Pour aller plus loin :</p>
            <Link href={`/be/blog/${article.slug}`} className="group flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-brand/5 border border-slate-200 transition-colors">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4 text-brand" />
                </div>
                <span className="text-slate-700 group-hover:text-brand font-semibold">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};

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

    const seed = getSeed(city.slug);
    const title = spin([
        `Expertise Solaire à ${city.name} : Rentabilité & Devis 2026`,
        `Installation Photovoltaïque ${city.name} : Guide Complet 2026`,
        `Panneaux Solaires ${city.name} : Prix et Primes Wallonie`
    ], seed, 10);

    return {
        title: title,
        description: `Installation photovoltaïque à ${city.name} (${city.zip}) ? Découvrez les primes, la rentabilité réelle et les meilleurs installateurs locaux (Mise à jour 2026).`,
        alternates: {
            canonical: `https://www.solarestim.com/be/villes/${city.slug}`,
        },
        openGraph: {
            title: `Panneaux Solaires à ${city.name} : Guide Complet 2026`,
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

    const seed = getSeed(city.slug);

    // --- SPINTAX INTRO ---
    const introText = spin([
        `Profitez de l'ensoleillement de votre région pour réduire vos factures. Analyse de rentabilité précise et raccordement au réseau ${city.region === "Wallonie" ? "wallon" : "belge"}.`,
        `Même en Belgique, le solaire est rentable. Découvrez le potentiel de votre toiture à ${city.name} avec notre outil de simulation certifié.`,
        `Propriétaires à ${city.name}, ne subissez plus les hausses d'énergie. Produisez votre électricité verte dès 2026.`
    ], seed, 0);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
                <Image
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=80"
                    alt={`Panneaux solaires ${city.name}`}
                    fill
                    priority
                    className="object-cover object-center opacity-20"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/90" />
                <FadeIn className="container relative z-10 px-4 md:px-6 mx-auto text-center" delay={100}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
                        <MapPin className="h-4 w-4" /> Expertise Locale : {city.name} ({city.zip})
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        {spin([
                            `Passez au solaire à <span class="text-brand">${city.name}</span>`,
                            `Votre projet photovoltaïque à <span class="text-brand">${city.name}</span>`,
                            `L'énergie solaire à <span class="text-brand">${city.name}</span>`
                        ], seed, 11).replace(/<span class="text-brand">/g, '<span className="text-brand">')}
                    </h1>
                    {/* Cleaner H1 Override for JSX */}
                    <h1 className="absolute opacity-0">Passez au solaire à {city.name}</h1>
                    <div className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        {spin(['Passez au solaire à', 'Votre projet solaire à', 'L\'énergie solaire à'], seed, 12)} <span className="text-brand">{city.name}</span>
                    </div>

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        {introText}
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
                                    {spin([
                                        `Pourquoi installer des panneaux photovoltaïques à ${city.name} ?`,
                                        `Rentabilité solaire à ${city.name} : Ce qu'il faut savoir`,
                                        `Vivre à ${city.name} : L'avantage du solaire en 2026`
                                    ], seed, 13)}
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
                                        À {city.name}, maximiser votre autoconsommation est la clé pour contourner le <Link href="/be/blog/tarif-prosumer-wallonie-2025" className="text-brand underline decoration-brand/30 hover:decoration-brand/100">tarif Prosumer</Link> et rentabiliser votre installation en moins de 7 ans.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-brand" /> Valorisation et Certification RESCert
                                    </h3>
                                    <p>
                                        Au-delà des économies immédiates sur votre facture d'électricité, installer des panneaux solaires à {city.name} augmente significativement le score PEB de votre habitation.
                                        C'est un investissement pérenne qui valorise votre patrimoine immobilier dans le code postal {city.zip}.
                                    </p>
                                </div>

                                {/* Dynamic Lexicon Link */}
                                <DynamicLexiconLink seed={seed} />

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

            {/* DYNAMIC FAQ SECTION */}
            <FAQSection city={city.name} country="BE" />

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
