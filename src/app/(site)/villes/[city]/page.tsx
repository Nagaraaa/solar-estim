import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Info, Sun, BookOpen, HelpCircle, Zap, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";
import { CITIES_FR, getCityBySlug, getAllCitySlugs } from "../cities";
import { FAQSection } from "@/components/FAQSection";
import { BreadcrumbStructuredData } from "@/components/seo/BreadcrumbStructuredData";
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

// Recursive Spintax Parser: {A|B|{C|D}}
function parseSpintax(text: string, seed: number): string {
    const regex = /\{([^{}]+)\}/g;
    let match;
    let currentText = text;
    let iteration = 0;

    // Handle nested spintax by multiple passes (up to 5 levels deep)
    while ((match = regex.exec(currentText)) !== null && iteration < 5) {
        currentText = currentText.replace(regex, (fullMatch, content) => {
            const options = content.split('|');
            // Use a changing seed modifier based on content length to avoid "same choice" everywhere
            const modifier = content.length + iteration;
            const selected = options[(seed + modifier) % options.length];
            return selected;
        });
        // Reset regex to check for newly exposed braces or remaining ones
        regex.lastIndex = 0;
        // If no more braces, break early
        if (!currentText.includes('{')) break;
        iteration++;
    }
    return currentText;
}

// Wrapper for clean usage
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

// --- CONTENT BLOCKS (EXPLODED SPINTAX) ---

const BlockWhy = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {À|Pour votre projet à|Dans la ville de} ${city.name} (${city.zip}), {l'installation de panneaux solaires|le photovoltaïque|l'énergie solaire} {est une solution incontournable|représente un investissement stratégique|devient une nécessité} en 2026.
    {Avec|Grâce à} un ensoleillement de **${city.sunshineHours} heures par an**, {votre toiture|votre maison|votre habitation} {bénéficie d'un potentiel|dispose d'un gisement solaire|offre un rendement} {exceptionnel|très favorable|idéal} pour {l'autoconsommation|réduire vos factures|produire votre électricité}.
    
    {En effet|Concrètement}, {le département ${city.department === "Rhône" || city.department === "Nord" ? "du" : "de"} ${city.department}|cette région|votre secteur géographique} {se prête parfaitement|est parfaitement adapté|convient idéalement} à la production d'énergie verte.
    {Ne subissez plus|Protégez-vous contre|Oubliez} {la hausse des prix de l'énergie|l'inflation énergétique|les augmentations du tarif de l'électricité} en {devenant producteur|produisant vos propres kWh|passant à l'autonomie partielle}.
    `;

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <RenderSpintax text={spin(`{Pourquoi passer au solaire|Les avantages du photovoltaïque|Vivre et investir} à ${city.name} ?`, seed)} />
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-justify">
                <p><RenderSpintax text={spin(template, seed)} /></p>
                <p>
                    <RenderSpintax text={spin(`{De plus|Par ailleurs|En outre}, {la valeur verte|la plus-value immobilière} de votre bien à ${city.name} {augmentera|sera valorisée|progressera} {significativement|durablement} avec une installation {certifiée|aux normes|performante}.`, seed + 1)} />
                </p>
            </div>
        </div>
    );
};

const BlockPrimes = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {Les habitants de|Les propriétaires à} ${city.name} {sont éligibles|ont droit|peuvent prétendre} {à l'ensemble des aides de l'État|aux dispositifs nationaux de soutien|aux subventions gouvernementales} pour la rénovation énergétique.
    {La prime à l'autoconsommation|La prime à l'investissement}, {versée en une fois|attribuée dès la première année}, {permet de financer|réduit le coût de} {une partie de vos travaux|votre installation}.
    
    {En parallèle|De plus|Ajoutez à cela}, le {mécanisme|système} **EDF OA (Obligation d'Achat)** {garantit|sécurise|assure} la vente de votre surplus d'électricité {pendant 20 ans|sur deux décennies|à un tarif fixe} {à un prix subventionné|contractuel}.
    {C'est une opportunité unique|Un levier financier puissant} pour {rentabiliser|amortir} vos panneaux à ${city.name} {plus rapidement|en un temps record}.
    `;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-brand" />
                <RenderSpintax text={spin(`{Primes et Aides|Subventions Solaires|Financement} à ${city.name}`, seed + 2)} />
            </h3>
            <div className="text-slate-600 mt-2 space-y-2">
                <p><RenderSpintax text={spin(template, seed + 3)} /></p>
            </div>
        </div>
    );
};

const BlockRGE = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {Pour bénéficier de ces aides|Pour débloquer ces primes}, {il est obligatoire|il est impératif|la condition sine qua non est} de {faire appel|choisir|sélectionner} un installateur **RGE (Reconnu Garant de l'Environnement)** {intervenant à ${city.name}|local|certifié}.
    {Nos partenaires|Les experts Solar Estim|Nos artisans référencés} {dans le ${city.department}|sur le secteur de ${city.name}} {disposent tous|sont tous titulaires} des qualifications **QualiPV**, {gage de qualité|assurance de conformité|garantie de sécurité}.
    
    {Ne prenez pas de risques|Évitez les malfaçons} : {une installation solaire|un chantier photovoltaïque} à ${city.name} {doit être réalisé|demande une expertise|nécessite un savoir-faire} {technique pointu|professionnel}.
    `;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-brand" />
                <RenderSpintax text={spin(`{Trouver un Installateur RGE|Artisans Certifiés|Entreprises Qualifiées} à ${city.name}`, seed + 4)} />
            </h3>
            <p className="text-slate-600 mt-2">
                <RenderSpintax text={spin(template, seed + 5)} />
            </p>
        </div>
    );
};

const BlockRentabilite = ({ city, seed }: { city: any, seed: number }) => {
    const isSud = city.sunshineHours > 2200;
    const template = `
    {Située en|Avec sa position en} zone **${city.zone}**, ${city.name} {profite d'un|bénéficie d'un|jouit d'un} {climat|ensoleillement} {favorable|propice} avec **${city.sunshineHours} heures de soleil** par an.
    ${isSud
            ? `{C'est une performance idéale|Un score excellent} qui permet {d'atteindre|de viser} une rentabilité {maximale|optimale}.`
            : `{Malgré une météo parfois variable|Même sans être dans le sud}, {la lumière diffuse|le rayonnement} suffit à {garantir|assurer} une production {élevée|rentable} grâce aux {panneaux modernes|technologies actuelles}.`
        }
    
    {Votre retour sur investissement|La période d'amortissement|Le ROI} à ${city.name} est estimé {entre 6 et 9 ans|rapidement|sous la barre des 10 ans}, {selon votre autoconsommation|en fonction de vos habitudes|selon la puissance installée}.
    `;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                <Sun className="h-5 w-5 text-brand" />
                <RenderSpintax text={spin(`{Rentabilité Solaire|Production Photovoltaïque|Gains Estiminés} à ${city.name}`, seed + 6)} />
            </h3>
            <p className="text-slate-600 mt-2">
                <RenderSpintax text={spin(template, seed + 7)} />
            </p>
        </div>
    );
};

const BlockMobility = ({ city, seed }: { city: any, seed: number }) => {
    const template = `
    {À ${city.name}|Pour les habitants de ${city.name}|Dans la région de ${city.name}}, l'ensoleillement {optimal|généreux|favorable} de ${city.sunshineHours} heures par an est une aubaine pour les propriétaires de véhicules électriques.
    {En installant des panneaux solaires|Grâce à une installation photovoltaïque}, vous pouvez {charger votre voiture gratuitement|faire le plein de votre VE à 0€|rouler à l'énergie solaire} une grande partie de l'année.
    De plus, les nouvelles bornes [Borne Bidirectionnelle](/lexique/borne-bidirectionnelle) permettent d'utiliser la batterie de votre voiture pour alimenter votre maison via le [V2H](/lexique/v2h) lors des soirées à ${city.name}, {augmentant|boostant|maximisant} votre indépendance énergétique.
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
                            Combien de panneaux pour rouler gratuit à {city.name} ?
                        </div>
                        <Link href="/simulateur-ve">
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

// --- DYNAMIC LOCAL FAQ ---
const LocalFAQ = ({ city, seed }: { city: any, seed: number }) => {
    // Generate questions based on city data/department
    const q1 = spin(`{Quel est le prix|Combien coûte|Quel budget pour} une installation solaire à ${city.name} ?`, seed);
    const r1 = spin(`Le prix {moyen|constaté} à ${city.name} {varie|oscille} entre **7 000€ et 9 000€** pour {3 kWc|une centrale de 3 000 Wc}, prime déduite. Ce montant {dépend|fluctue selon} {de la complexité du toit|du type de tuiles} et du choix du matériel (Micro-onduleurs ou onduleur central).`, seed + 1);

    const q2 = spin(`{Y a-t-il des aides|Existe-t-il des primes} locales {dans le ${city.department === "Rhône" || city.department === "Nord" ? "département du" : "département de"} ${city.department}|en région} pour le solaire ?`, seed + 2);
    const r2 = spin(`{Actuellement|À ce jour}, {les principales aides|l'essentiel du soutien} {provient de l'État|est national} (Prime à l'autoconsommation, TVA réduite). Certaines collectivités {autour de ${city.name}|locales} {peuvent proposer|offrent parfois} des aides ponctuelles, il est {conseillé|recommandé} de vérifier auprès de la mairie de ${city.name} ou du département ${city.department === "Rhône" || city.department === "Nord" ? "du" : "de"} ${city.department}.`, seed + 3);

    const q3 = spin(`{Faut-il|Est-il nécessaire de} nettoyer ses panneaux solaires à ${city.name} ?`, seed + 4);
    const r3 = spin(`{Oui|Absolument}, {l'entretien|le nettoyage} est {recommandé|conseillé} {tous les ans|une fois par an}, surtout à ${city.name} {pour éliminer|afin d'enlever} {les poussières|les dépôts|le pollen}. Un panneau propre {produit|génère} jusqu'à **{5%|10%} d'énergie en plus** {sur l'année|annuellement}.`, seed + 5);

    return (
        <section className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="text-brand h-6 w-6" />
                Questions Fréquentes à {city.name}
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

    const seed = getSeed(city.slug);
    // Spintax for meta title
    const title = spin(`{Panneaux Solaires à ${city.name} : Guide 2026|Installation Solaire ${city.name} (${city.zip}) : Prix & Aides|${city.name} : Rentabilité Panneaux Photovoltaïques}`, seed);

    // Spintax for meta description with data injection
    const description = spin(`{Projet solaire à|Vous habitez} ${city.name} (${city.department}) ? {Découvrez|Tout savoir sur} la rentabilité avec **${city.sunshineHours}h de soleil/an**, les {aides|primes} de l'État et {les tarifs|le coût} d'installation. {Devis gratuit|Simulation en ligne}.`, seed + 1);

    return {
        title: title,
        description: description,
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
    const isSud = city.sunshineHours > 2200; // Updated logic based on real data
    const savingsAmount = Math.round(city.sunshineHours * 0.55); // More precise formula

    const headerImage = isSud ? "/images/villes/sud-archetype.png" : "/images/villes/nord-archetype.png";
    const headerAlt = isSud
        ? `Panneaux solaires sur toiture tuiles à ${city.name} (${city.department}), région ensoleillée.`
        : `Installation photovoltaïque sur toiture ardoise à ${city.name} (${city.department}).`;

    // --- SPINTAX INTRO ---
    // Massive spintax for Intro
    const introTemplate = `
    {Calculez|Estimez|Simulez} {votre rentabilité solaire|vos économies d'énergie|votre potentiel photovoltaïque} à **${city.name}** {grâce à notre outil|avec notre simulateur précis|en quelques clics}.
    {Profitez de|Valorisez} les **${city.sunshineHours} heures d'ensoleillement** {du département ${city.department === "Rhône" || city.department === "Nord" ? "du" : "de"} ${city.department}|de votre région} pour {réduire votre facture|devenir autonome|passer au vert}.
    {Découvrez|Accédez à} {toutes les aides|les subventions|les primes} 2026 et {trouvez|contactez} {les meilleurs installateurs|un artisan RGE|un pro} {local|près de chez vous}.
    `;
    const introText = spin(introTemplate, seed);


    // --- SELECTION STRUCTURE (A, B, C) ---
    const structureType = seed % 3; // 0, 1, 2

    // --- RENDER ---
    const breadcrumbs = [
        { name: "Accueil", url: "/" },
        { name: "Villes de France", url: "/villes" },
        { name: city.department, url: "/villes" },
        { name: city.name, url: `/villes/${city.slug}` }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <BreadcrumbStructuredData items={breadcrumbs} />
            {/* Hero Section */}
            <section className="relative py-12 lg:py-20 overflow-hidden bg-slate-900 text-white">
                <Image
                    src={headerImage}
                    alt={headerAlt}
                    fill
                    priority
                    className="object-cover object-center opacity-20"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/70" />

                <div className="container relative z-10 px-4 md:px-6 mx-auto">
                    {/* BREADCRUMBS */}
                    <nav className="flex items-center text-sm text-slate-400 mb-8 space-x-2 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                        <span>&gt;</span>
                        <Link href="/villes" className="hover:text-white transition-colors">Villes de France</Link>
                        <span>&gt;</span>
                        <span className="text-slate-400">{city.department}</span>
                        <span>&gt;</span>
                        <span className="text-brand font-medium">{city.name}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FadeIn delay={100} className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
                                <MapPin className="h-4 w-4" /> Solaire {city.department} : {city.name} ({city.zip})
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-none">
                                <RenderSpintax text={spin(`{Passez au solaire à|Votre installation à|Panneaux Solaires à}`, seed)} /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-yellow-200 block mt-2">{city.name}</span>
                            </h1>

                            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                                <RenderSpintax text={introText} />
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/simulateur">
                                    <Button size="lg" variant="brand" className="w-full sm:w-auto text-base font-bold px-8 h-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                        Calculer ma prime {city.name} <ArrowRight className="ml-2 h-5 w-5" />
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
                                        <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Ensoleillement {city.name}</div>
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

                                {/* Block Mobility (Always visible at the end) */}
                                <BlockMobility city={city} seed={seed} />

                                {/* Dynamic Lexicon Link */}
                                <DynamicLexiconLink seed={seed} />

                                {/* NEW: Local FAQ */}
                                <LocalFAQ city={city} seed={seed} />

                            </FadeIn>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-4 space-y-6">
                            <FadeIn delay={300}>
                                <Card className="border-brand border-2 shadow-lg bg-slate-900 text-white sticky top-24">
                                    <CardContent className="p-6 pt-8 text-center space-y-6">
                                        <h3 className="text-2xl font-bold">Votre Étude à {city.name}</h3>
                                        <p className="text-slate-300">
                                            <RenderSpintax text={spin("{Découvrez le montant de vos aides|Obtenez votre rapport solaire|Vérifiez votre éligibilité} et {calculez votre rentabilité précise|la production de votre toiture|vos futurs revenus}.", seed + 20)} />
                                        </p>
                                        <Link href="/simulateur" className="block w-full">
                                            <Button size="lg" variant="brand" className="w-full font-bold">
                                                Lancer la simulation
                                            </Button>
                                        </Link>
                                        <p className="text-xs text-slate-400">
                                            Données {city.department} • Certifié PVGIS
                                        </p>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATIC FAQ SECTION (Global) */}
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
