import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, Zap, ShieldCheck, Leaf } from "lucide-react";
import { AutoLink } from "@/components/content/AutoLink";

export const metadata = {
    title: "Comparateur Solaire : Le Labo Technique | Solar-Estim",
    description: "Analyses techniques indépendantes des panneaux solaires, onduleurs et batteries. Enphase vs SolarEdge, Huawei, SMA. Faites le bon choix pour votre rentabilité.",
    alternates: {
        canonical: '/comparateur',
    },
};

export default function ComparateurIndexContent({ country = "FR" }: { country?: "FR" | "BE" }) {
    const rootPath = country === "BE" ? "/be/comparateur" : "/comparateur";
    const introText = `
        Parce qu'installer des **panneaux solaires** est un projet de vie, nous avons testé et comparé les plus grandes marques pour vous aider à trancher.
        Rendement, garanties, prix : nos experts disent tout. Que vous cherchiez le meilleur **onduleur** ou une **batterie** performante, notre labo technique est là pour vous guider.
    `;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-60">
                    <Image
                        src="/images/comparateur/hub-hero.webp"
                        alt="Hub comparatif SolarEstim : analyses techniques et duels de panneaux solaires 2026"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                <div className="relative z-10 text-center container px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-600 mb-6 text-sm font-medium text-slate-200">
                        <Scale className="w-4 h-4 text-brand" /> Le Labo Technique SolarEstim {country === "BE" ? "Belgique" : ""}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Comparateur Solaire
                    </h1>
                    <div className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed font-light">
                        <AutoLink
                            country={country}
                            text={introText}
                            linkClassName="text-white underline decoration-white/50 hover:decoration-white"
                            boldClassName="text-white font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="container mx-auto px-4 py-16 -mt-20 relative z-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Duel 1: Enphase vs SolarEdge */}
                    <Link href={`${rootPath}/enphase-vs-solaredge`} className="group">
                        <Card className="h-full overflow-hidden border-0 shadow-2xl bg-white hover:shadow-brand/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src="/images/comparateur/enphase-vs-solaredge-hero.webp"
                                    alt="Enphase vs SolarEdge : Le duel technique"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    ONDULEURS
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                                    <h3 className="text-white font-bold text-xl leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        Lire l'analyse complète
                                    </h3>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-bold group-hover:text-brand transition-colors">
                                    Enphase vs SolarEdge : Le choc des onduleurs
                                </CardTitle>
                                <CardDescription className="text-slate-600 mt-2 line-clamp-3">
                                    Micro-onduleurs ou Optimiseurs ? Le match technique pour choisir la meilleure rentabilité sur 25 ans.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button className="w-full bg-slate-900 group-hover:bg-brand text-white transition-colors gap-2">
                                    Voir le duel complet <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Duel 2: Panneaux Premium */}
                    <Link href={`${rootPath}/premium-sunpower-dualsun-meyerburger`} className="group">
                        <Card className="h-full overflow-hidden border-0 shadow-2xl bg-white hover:shadow-brand/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src="/images/comparateur/premium-hero.webp"
                                    alt="Comparatif SunPower vs DualSun vs Meyer Burger"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    PANNEAUX
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                                    <h3 className="text-white font-bold text-xl leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        Voir le classement
                                    </h3>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-bold group-hover:text-amber-600 transition-colors">
                                    SunPower vs DualSun vs Meyer Burger
                                </CardTitle>
                                <CardDescription className="text-slate-600 mt-2 line-clamp-3">
                                    Garantie 40 ans, Hétérojonction ou Bilan Carbone ? Le guide ultime pour choisir ses panneaux Haut de Gamme.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button className="w-full bg-slate-900 group-hover:bg-amber-600 text-white transition-colors gap-2">
                                    Découvrir le vainqueur <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Duel 3: Stockage */}
                    <Link href={`${rootPath}/tesla-powerwall-vs-huawei-luna`} className="group">
                        <Card className="h-full overflow-hidden border-0 shadow-2xl bg-white hover:shadow-brand/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src="/images/comparateur/tesla-vs-huawei-hero.webp"
                                    alt="Comparatif Tesla Powerwall vs Huawei Luna"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    STOCKAGE
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                                    <h3 className="text-white font-bold text-xl leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        Lire le comparatif
                                    </h3>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-bold group-hover:text-emerald-600 transition-colors">
                                    Tesla vs Huawei : Le match des batteries
                                </CardTitle>
                                <CardDescription className="text-slate-600 mt-2 line-clamp-3">
                                    Powerwall tout-puissant ou Luna modulaire ? Découvrez quelle batterie maximise votre autonomie et réduit vos factures.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button className="w-full bg-slate-900 group-hover:bg-emerald-600 text-white transition-colors gap-2">
                                    Voir le duel <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                </div>
            </div>
        </div>
    );
}
