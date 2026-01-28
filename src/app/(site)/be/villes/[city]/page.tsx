import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Info, BookOpen, Sun, HelpCircle, Zap, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";
import { CITIES, getCityBySlug, getAllCitySlugs } from "../cities";
import { FAQSection } from "@/components/FAQSection";
import * as React from "react";

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// --- SPINTAX ENGINE (NESTED) ---
function getSeed(str: string): number {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
        seed = (seed << 5) - seed + str.charCodeAt(i);
        seed |= 0;
    }
    return Math.abs(seed);
}

// Recursive Spintax Parser
function parseSpintax(text: string, seed: number): string {
    const regex = /\{([^{}]+)\}/g;
    let match;
    let currentText = text;
    let iteration = 0;

    while ((match = regex.exec(currentText)) !== null && iteration < 5) {
        currentText = currentText.replace(regex, (fullMatch, content) => {
            const options = content.split('|');
            const modifier = content.length + iteration;
            const selected = options[(seed + modifier) % options.length];
            return selected;
        });
        regex.lastIndex = 0;
        if (!currentText.includes('{')) break;
        iteration++;
    }
    return currentText;
}

function spin(template: string, seed: number): string {
    return parseSpintax(template, seed);
}

// --- RENDER COMPONENT FOR BOLD TEXT ---
const RenderSpintax = ({ text }: { text: string }) => {
    // Basic bold parser: **text** -> <strong>text</strong>
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </>
    );
};

// --- DYNAMIC CONTENT BLOCKS ---
const BlockWhy = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {En Belgique|Au cœur de la Wallonie}, à **${city.name}**, {l'énergie solaire|le photovoltaïque} {connaît un essor sans précédent|est plus rentable que jamais} en 2026.
    {Malgré les idées reçues|Contrairement à la croyance populaire}, avec ses **${city.sunshineHours} heures d'ensoleillement** annuelles, ${city.name} {est une ville idéale|dispose de tous les atouts} pour {produire de l'électricité|installer des panneaux}.
    
    {La région|Votre commune} de ${city.name} {encourage|soutient} {activement|fortement} {la transition énergétique|le passage au vert}.
    {En installant des panneaux|En équipant votre toiture}, vous {réduisez votre dépendance|vous libérez} du réseau et {protégez votre pouvoir d'achat|sécurisez vos factures} face aux {fluktuations|hausses} du marché.
    `;

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <RenderSpintax text={spin(`{Pourquoi installer des panneaux|L'intérêt du solaire|Investir dans le photovoltaïque} à ${city.name} ?`, seed)} />
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-justify">
                <p><RenderSpintax text={spin(template, seed)} /></p>
            </div>
        </div>
    );
};

const BlockPrimes = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {À ${city.name}|Pour les résidents de ${city.name}}, {le cadre fiscal|la législation} {reste favorable|est avantageuse} en 2026.
    {Si la fin du compteur qui tourne à l'envers|Bien que le système de compensation} {évolue|change}, {l'autoconsommation|consommer sa propre production} {devient la norme|est la clé de la rentabilité}.
    
    {En région ${city.region}|Dans le ${city.zip}}, {éviter le tarif Prosumer|minimiser la taxe prosumer} grâce à {une batterie|du stockage} ou {une gestion intelligente|un pilotage} de l'énergie {est désormais possible|est très simple}.
    `;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-brand" />
                <RenderSpintax text={spin(`{Réglementation et Tarif Prosumer|Cadre Légal et Primes} à ${city.name}`, seed + 2)} />
            </h3>
            <div className="text-slate-600 mt-2 space-y-2">
                <p><RenderSpintax text={spin(template, seed + 3)} /></p>
            </div>
        </div>
    );
};

const BlockMobility = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {À ${city.name}|Pour les habitants de ${city.name}|Dans la région de ${city.name}}, l'ensoleillement {optimal|généreux|favorable} de ${city.sunshineHours} heures par an est une aubaine pour les propriétaires de véhicules électriques.
    {En installant des panneaux solaires|Grâce à une installation photovoltaïque}, vous pouvez {charger votre voiture gratuitement|faire le plein de votre VE à 0€|rouler à l'énergie solaire} une grande partie de l'année.
    De plus, les nouvelles bornes [Borne Bidirectionnelle](/be/lexique/borne-bidirectionnelle) permettent d'utiliser la batterie de votre voiture pour alimenter votre maison via le [V2H](/be/lexique/v2h) lors des soirées à ${city.name}, {augmentant|boostant|maximisant} votre indépendance énergétique.
    `;

    return (
        <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <RenderSpintax text={spin(`{Solaire & Voiture Électrique|Roulez au Solaire|Recharge VE Gratuite} à ${city.name}`, seed + 10)} />
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-justify">
                        <RenderSpintax text={spin(template, seed + 11)} />
                    </p>
                </div>
                <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-3">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                        <CarFront className="w-10 h-10 text-brand mx-auto mb-3" />
                        <div className="text-sm font-medium text-slate-500 mb-4">
                            Votre autonomie solaire à {city.name} ?
                        </div>
                        <Link href="/be/simulateur-ve">
                            <Button className="w-full bg-brand hover:bg-brand/90 text-slate-900 font-bold">
                                Calculer mon autonomie <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DYNAMIC LOCAL FAQ (BE specific) ---
const LocalFAQ = ({ city, seed }: { city: any, seed: number }) => {
    const q1 = spin(`{Quel est le rendement|Quelle production attendre} de panneaux solaires à ${city.name} ?`, seed);
    const r1 = spin(`À ${city.name}, une installation {moyenne|standard} de 4 kWc (environ 10 panneaux) produit {entre 3 600 et 4 200|environ 3 800} kWh par an grâce aux **${city.sunshineHours}h d'ensoleillement**. Cela couvre {souvent|généralement} la consommation d'une famille de 4 personnes.`, seed + 1);

    const q2 = spin(`{Est-il rentable|Vaut-il la peine} d'installer une batterie à ${city.name} ?`, seed + 2);
    const r2 = spin(`{Oui|Absolument}, en région ${city.region}, {la batterie domestique|le stockage} permet {d'augmenter|de maximiser} votre autoconsommation et {de réduire|d'éviter} l'impact du **Tarif Prosumer**. À ${city.name}, c'est souvent un calcul {gagnant|judicieux}.`, seed + 3);

    const q3 = spin(`{Comment choisir|Qui sont} les meilleurs installateurs à ${city.name} ?`, seed + 4);
    const r3 = spin(`Il est {crucial|essentiel} de choisir un installateur **certifié RESCert** actif dans la zone de ${city.name} (${city.zip}). Cela vous garantit {une installation aux normes|la conformité RGIE} et l'accès aux {primes éventuelles|aides disponibles}.`, seed + 5);

    return (
        <section className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="text-brand h-6 w-6" />
                Vos questions sur le solaire à {city.name}
            </h3>
            <div className="space-y-4">
                <Card className="border-l-4 border-l-brand border-y-0 border-r-0 rounded-none shadow-sm bg-slate-50/50">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-semibold text-slate-800"><RenderSpintax text={q1} /></CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3 px-4 text-sm text-slate-600">
                        <RenderSpintax text={r1} />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-brand border-y-0 border-r-0 rounded-none shadow-sm bg-slate-50/50">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-semibold text-slate-800"><RenderSpintax text={q2} /></CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3 px-4 text-sm text-slate-600">
                        <RenderSpintax text={r2} />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-brand border-y-0 border-r-0 rounded-none shadow-sm bg-slate-50/50">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-semibold text-slate-800"><RenderSpintax text={q3} /></CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3 px-4 text-sm text-slate-600">
                        <RenderSpintax text={r3} />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
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
    // Spintax meta title
    const title = spin(`{Expertise Solaire à ${city.name} : Rentabilité & Devis 2026|Installation Photovoltaïque ${city.name} : Guide Complet 2026|Panneaux Solaires ${city.name} : Prix et Primes Wallonie}`, seed);

    // Spintax meta description
    const description = spin(`{Vous vivez à|Votre maison à} ${city.name} (${city.zip}) ? {Découvrez|Simulez} votre rentabilité avec **${city.sunshineHours}h de soleil**, les {primes|aides} wallonnes et le tarif Prosumer. {Devis gratuit|Étude offerte}.`, seed + 1);

    return {
        title: title,
        description: description,
        alternates: {
            canonical: `https://www.solarestim.com/be/villes/${city.slug}`,
        },
        openGraph: {
            title: title,
            description: description,
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
    // Logic for BE savings (approximate)
    const savingsAmount = Math.round(city.sunshineHours * 0.5);

    // --- SPINTAX INTRO ---
    const introTemplate = `
    {Profitez de|Exploitez} **${city.sunshineHours}h d'ensoleillement** à ${city.name} pour {réduire vos factures|baisser vos coûts d'énergie}.
    {Une analyse précise|Notre simulateur} prend en compte votre toiture à ${city.name} et le réseau ${city.region === "Wallonie" ? "wallon" : "belge"}.
    {Ne subissez plus|Anticipez} les hausses d'énergie et {devenez autonome|produisez votre électricité} dès 2026 à ${city.name}.
    `;
    const introText = spin(introTemplate, seed);


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-12 lg:py-20 overflow-hidden bg-slate-900 text-white">
                <Image
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=80"
                    alt={`Panneaux solaires ${city.name}`}
                    fill
                    priority
                    className="object-cover object-center opacity-20"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/70" />

                <div className="container relative z-10 px-4 md:px-6 mx-auto">
                    {/* BREADCRUMBS */}
                    <nav className="flex items-center text-sm text-slate-400 mb-8 space-x-2 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Link href="/be" className="hover:text-white transition-colors">Accueil</Link>
                        <span>&gt;</span>
                        <Link href="/be/villes" className="hover:text-white transition-colors">Villes de Belgique</Link>
                        <span>&gt;</span>
                        <span className="text-brand font-medium">{city.name}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FadeIn delay={100} className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
                                <MapPin className="h-4 w-4" /> Expertise Locale : {city.name} ({city.zip})
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-none">
                                <RenderSpintax text={spin(`{Passez au solaire à|Votre projet photovoltaïque à|L'énergie solaire à}`, seed)} /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-yellow-200 block mt-2">{city.name}</span>
                            </h1>

                            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                                <RenderSpintax text={introText} />
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/be/simulateur">
                                    <Button size="lg" variant="brand" className="w-full sm:w-auto text-base font-bold px-8 h-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                        Démarrer mon étude {city.name} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>

                        {/* Right Side: Data Cards */}
                        <FadeIn delay={300} className="w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md mx-auto lg:ml-auto">
                                <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700 flex items-center gap-5 hover:bg-slate-800/60 transition-colors group">
                                    <div className="bg-brand/10 p-4 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Sun className="h-8 w-8 text-brand" />
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Ensoleillement</div>
                                        <div className="text-3xl font-bold text-white">
                                            {city.sunshineHours} h<span className="text-sm font-normal text-slate-500 ml-1">/an</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700 flex items-center gap-5 hover:bg-slate-800/60 transition-colors group">
                                    <div className="bg-emerald-500/10 p-4 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl font-bold text-emerald-400">€</span>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Gain Estimé</div>
                                        <div className="text-3xl font-bold text-white">
                                            ~{savingsAmount} €<span className="text-sm font-normal text-slate-500 ml-1">/an</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Advisory Content */}
            <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="md:col-span-8 space-y-8">
                            <FadeIn delay={200}>
                                <BlockWhy city={city} seed={seed} />
                                <BlockPrimes city={city} seed={seed} />
                                <BlockMobility city={city} seed={seed} />

                                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed">
                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-brand" /> <RenderSpintax text={spin("{Valorisation et Certification|Qualité et Expertise} RESCert", seed + 10)} />
                                    </h3>
                                    <p>
                                        <RenderSpintax text={spin(`Au-delà des économies {immédiates|directes} sur votre facture d'électricité, installer des panneaux solaires à ${city.name} augmente {significativement|durablement} le score PEB de votre habitation. C'est un investissement {pérenne|stratégique} qui {valorise|augmente la valeur de} votre patrimoine immobilier dans le code postal ${city.zip}.`, seed + 11)} />
                                    </p>
                                </div>

                                {/* Dynamic Lexicon Link */}
                                <DynamicLexiconLink seed={seed} />

                                <LocalFAQ city={city} seed={seed} />

                                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                                    <Info className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-lg mb-1">Le saviez-vous ?</h4>
                                        <p className="text-blue-800">
                                            <RenderSpintax text={spin(`Une installation moyenne à ${city.name} permet d'économiser jusqu'à {1 200€|1 000€} par an. Notre simulateur prend en compte l'orientation précise de votre toiture à ${city.name} pour un calcul réaliste.`, seed + 20)} />
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-4 space-y-6">
                            <FadeIn delay={300}>
                                <Card className="border-brand border-2 shadow-lg bg-slate-900 text-white sticky top-24">
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
