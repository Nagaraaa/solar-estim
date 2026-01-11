import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Info, Sun, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";
import { CITIES_FR, getCityBySlug, getAllCitySlugs } from "../cities";
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

// --- CONTENT BLOCKS ---
const BlockWhy = ({ city, seed }: { city: any, seed: number }) => (
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
            {spin([
                `Pourquoi installer des panneaux solaires à ${city.name} ?`,
                `L'intérêt du photovoltaïque à ${city.name} en 2026`,
                `Rentabilité d'une installation solaire à ${city.name} : Analyse`
            ], seed, 1)}
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed">
            <p>
                {spin([
                    `À ${city.name}, le potentiel photovoltaïque est idéal pour réduire votre facture d'électricité.`,
                    `Les habitants de ${city.name} bénéficient d'un ensoleillement favorable pour l'autoconsommation.`,
                    `Installer des panneaux à ${city.name} est une stratégie gagnante contre la hausse des prix de l'énergie.`
                ], seed, 2)}
                {' '}
                {spin([
                    `En produisant votre propre énergie verte, vous vous protégez contre les hausses tarifaires.`,
                    `Devenez producteur d'électricité et réduisez votre dépendance au réseau public.`,
                    `Valorisez votre toiture tout en faisant des économies immédiates.`
                ], seed, 3)}
            </p>
        </div>
    </div>
);

const BlockPrimes = ({ city, seed }: { city: any, seed: number }) => (
    <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-brand" />
            {spin([
                `Prime à l'autoconsommation et EDF OA`,
                `Aides de l'État et Rachat Surplus`,
                `Les Subventions Solaires à ${city.name}`
            ], seed, 4)}
        </h3>
        <p className="text-slate-600 mt-2">
            {spin([
                `En France, l'État encourage la transition. Vous bénéficiez d'une prime à l'investissement versée en une fois.`,
                `Le dispositif EDF OA vous garantit un tarif d'achat fixe pour votre surplus pendant 20 ans.`,
                `Profitez de la prime à l'autoconsommation (jusqu'à 1110€ pour 3kWc selon périodes) et vendez votre surplus.`
            ], seed, 5)}
        </p>
    </div>
);

const BlockRGE = ({ city, seed }: { city: any, seed: number }) => (
    <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-brand" />
            {spin([
                `Installateurs RGE QualiPV obligatoires`,
                `Pourquoi choisir un artisan RGE à ${city.name} ?`,
                `La certification RGE : Condition des aides`
            ], seed, 6)}
        </h3>
        <p className="text-slate-600 mt-2">
            {spin([
                `Pour bénéficier de ces aides, il est impératif de faire appel à un artisan certifié RGE (Reconnu Garant de l'Environnement).`,
                `Sans installateur RGE, impossible de toucher la prime EDF OA.`,
                `Nos artisans partenaires sur ${city.name} détiennent tous le label QualiPV RGE.`
            ], seed, 7)}
        </p>
    </div>
);

const BlockRentabilite = ({ city, seed }: { city: any, seed: number }) => (
    <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
            <Sun className="h-5 w-5 text-brand" />
            {spin([
                `Rentabilité Zone Ensoleillement ${city.zone}`,
                `Potentiel Solaire : Zone ${city.zone}`,
                `Combien produit une installation à ${city.name} ?`
            ], seed, 8)}
        </h3>
        <p className="text-slate-600 mt-2">
            {spin([
                `Située en zone ${city.zone}, ${city.name} offre un rendement optimal pour les installations bien orientées.`,
                `Même en zone ${city.zone}, les panneaux modernes (IBC, TOPCon) garantissent une forte production.`,
                `Le climat de ${city.name} (Zone ${city.zone}) permet un retour sur investissement rapide, souvent sous les 10 ans.`
            ], seed, 9)}
        </p>
    </div>
);

// --- DYNAMIC INTERNAL LINKS ---
const LEXICON_ARTICLES = [
    { title: "Prix des panneaux solaires 2026", slug: "prix-panneau-solaire-2025", label: "Prix 2026" },
    { title: "Aides de l'État France", slug: "aides-etat-panneaux", label: "Guide des Aides" },
    { title: "Rentabilité Solaire Nord", slug: "rentabilite-nord-france", label: "Étude Rentabilité" },
    { title: "Batterie Virtuelle vs Physique", slug: "batterie-solaire-france-2025", label: "Guide Batteries" },
    { title: "Technologie IBC vs TOPCon", slug: "technologies-solaires-2026-ibc-topcon-hjt", label: "Comparatif Technologies" },
];

const DynamicLexiconLink = ({ seed }: { seed: number }) => {
    const article = LEXICON_ARTICLES[seed % LEXICON_ARTICLES.length];
    return (
        <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium mb-2">Approfondir le sujet :</p>
            <Link href={`/blog/${article.slug}`} className="group flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-brand/5 border border-slate-200 transition-colors">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4 text-brand" />
                </div>
                <span className="text-slate-700 group-hover:text-brand font-semibold">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};


// 1. Static Generation
export async function generateStaticParams() {
    const slugs = getAllCitySlugs();
    return slugs
        .filter(slug => slug !== 'montpellier')
        .map((slug) => ({
            city: slug,
        }));
}

// 2. Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);
    if (!city) return {};

    // Simple Spintax for meta
    const seed = getSeed(city.slug);
    const title = spin([
        `Panneaux Solaires à ${city.name} : Prime & Rentabilité 2026`,
        `Installation Photovoltaïque ${city.name} : Prix et Aides 2026`,
        `${city.name} : Devis Panneaux Solaires et Primes`
    ], seed, 10);

    return {
        title: title,
        description: `Installation photovoltaïque à ${city.name} (${city.zip}) ? Tout sur la Prime à l'autoconsommation, le tarif d'achat EDF OA et les installateurs RGE.`,
        alternates: {
            canonical: `https://www.solarestim.com/villes/${city.slug}`,
        },
    };
}

export default async function CityPage({ params }: PageProps) {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);

    if (!city) {
        notFound();
    }

    // --- VARIABLES & LOGIC ---
    const seed = getSeed(city.slug);
    const isSud = city.zone === 'Sud';
    const sunshineHours = isSud ? 2400 : 1600;
    const savingsAmount = Math.round(sunshineHours * 0.5);

    const headerImage = isSud ? "/images/villes/sud-archetype.png" : "/images/villes/nord-archetype.png";
    const headerAlt = isSud
        ? `Panneaux solaires sur toiture tuiles à ${city.name}, région ensoleillée.`
        : `Installation photovoltaïque sur toiture ardoise à ${city.name}, rendement optimisé.`;

    // --- SPINTAX INTRO ---
    const introText = spin([
        `Calculez votre rentabilité solaire à ${city.name} et découvrez les aides de l'État disponibles.`,
        `Estimez vos économies solaires précises pour votre maison à ${city.name} grâce à notre simulateur.`,
        `Le guide solaire complet pour les propriétaires à ${city.name} : prix, primes et rentabilité.`
    ], seed, 0);

    // --- SELECTION STRUCTURE (A, B, C) ---
    // Alternance basée sur le seed modulo 3
    const structureType = seed % 3; // 0, 1, 2

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-12 lg:py-20 overflow-hidden bg-slate-900 text-white">
                <Image
                    src={headerImage}
                    alt={headerAlt}
                    fill
                    priority
                    className="object-cover object-center opacity-30"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/90" />
                <FadeIn className="container relative z-10 px-4 md:px-6 mx-auto text-center" delay={100}>
                    {/* BREADCRUMBS */}
                    <nav className="flex justify-center items-center text-sm text-slate-400 mb-6 space-x-2">
                        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                        <span>&gt;</span>
                        <Link href="/villes" className="hover:text-white transition-colors">Villes de France</Link>
                        <span>&gt;</span>
                        <span className="text-brand font-medium">{city.name}</span>
                    </nav>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
                        <MapPin className="h-4 w-4" /> Installation Solaire : {city.name} ({city.zip})
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        {spin([
                            "Passez au solaire à",
                            "Votre installation solaire à",
                            "Panneaux Photovoltaïques à"
                        ], seed, 11)} <span className="text-brand">{city.name}</span>
                    </h1>

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        {introText}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/simulateur">
                            <Button size="lg" variant="brand" className="w-full sm:w-auto text-lg font-bold px-8 h-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                Calculer ma prime EDF OA <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Dynamic Data Block */}
                    <div className="mt-8 grid grid-cols-2 max-w-2xl mx-auto gap-4 md:gap-8">
                        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700">
                            <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Ensoleillement</div>
                            <div className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                                <Sun className="h-6 w-6 text-brand" /> {sunshineHours} h<span className="text-base font-normal text-slate-400">/an</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700">
                            <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Gain Estimé</div>
                            <div className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                                ~{savingsAmount} €<span className="text-base font-normal text-slate-400">/an</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Advisory Content - STRUCTURE VARIATION */}
            <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="md:col-span-8 space-y-8">
                            <FadeIn delay={200}>
                                {structureType === 0 && (
                                    <>
                                        <BlockWhy city={city} seed={seed} />
                                        <BlockPrimes city={city} seed={seed} />
                                        <BlockRGE city={city} seed={seed} />
                                        <BlockRentabilite city={city} seed={seed} />
                                    </>
                                )}
                                {structureType === 1 && (
                                    <>
                                        <BlockRentabilite city={city} seed={seed} />
                                        <BlockWhy city={city} seed={seed} />
                                        <BlockPrimes city={city} seed={seed} />
                                        <BlockRGE city={city} seed={seed} />
                                    </>
                                )}
                                {structureType === 2 && (
                                    <>
                                        <BlockRGE city={city} seed={seed} />
                                        <BlockPrimes city={city} seed={seed} />
                                        <BlockRentabilite city={city} seed={seed} />
                                        <BlockWhy city={city} seed={seed} />
                                    </>
                                )}

                                {/* Dynamic Lexicon Link */}
                                <DynamicLexiconLink seed={seed} />

                            </FadeIn>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-4 space-y-6">
                            <FadeIn delay={300}>
                                <Card className="border-brand border-2 shadow-lg bg-slate-900 text-white">
                                    <CardContent className="p-6 pt-8 text-center space-y-6">
                                        <h3 className="text-2xl font-bold">Votre Étude à {city.name}</h3>
                                        <p className="text-slate-300">
                                            {spin([
                                                "Découvrez le montant de vos aides et votre rentabilité financière précise.",
                                                "Obtenez votre rapport solaire détaillé et gratuit en 2 minutes.",
                                                "Vérifiez votre éligibilité aux primes 2026."
                                            ], seed, 20)}
                                        </p>
                                        <Link href="/simulateur" className="block w-full">
                                            <Button size="lg" variant="brand" className="w-full font-bold">
                                                Lancer la simulation
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* DYNAMIC FAQ SECTION */}
            <FAQSection city={city.name} country="FR" />

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
                                Panneaux {c.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
