import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";

import { ComparatorSection } from "@/components/sections/ComparatorSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { Zap, ArrowRight, CarFront } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export const metadata = {
    title: "Simulateur Rentabilité Panneaux Solaires | France & Belgique (Gratuit)",
    description: "Calculez vos économies photovoltaïques en 2 min. Simulateur précis pour la Wallonie, Bruxelles et toute la France. Basé sur les données PVGIS. Sans inscription obligatoire.",
    alternates: {
        canonical: 'https://www.solarestim.com/',
        languages: {
            'fr-FR': 'https://www.solarestim.com/',
            'fr-BE': 'https://www.solarestim.com/be',
        },
    },
};

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={<>Estimez la rentabilité de vos panneaux solaires en <span className="text-brand">France et Belgique</span></>}
                subtitle="Un calcul précis basé sur l'ensoleillement réel de votre toiture (Données scientifiques PVGIS)."
                ctaLink="/simulateur"
            />

            {/* FEATURED GUIDE BLOCK */}
            <section className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="md:w-1/3 min-h-[200px] md:min-h-0 relative">
                        <img
                            src="/images/guides/solar-ev-hero.jpg"
                            alt="Maison solaire avec voiture électrique"
                            className="absolute inset-0 w-full h-full object-cover object-[center_75%]"
                        />
                    </div>
                    <div className="p-8 md:p-8 md:w-2/3 flex flex-col justify-center">
                        <div>
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                Dossier 2026
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
                                Solaire & Véhicule Électrique : Le guide de l'indépendance
                            </h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Découvrez comment transformer votre voiture en batterie domestique et rouler gratuitement grâce au soleil.
                            </p>
                            <a href="/guide/guide-solaire-vehicule-electrique-2026" className="text-brand font-bold hover:underline flex items-center gap-2 group">
                                Lire le dossier complet
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <FeatureSection variant="FR" />

            {/* EV TOOLS SECTION */}
            <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand/10 to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <span className="inline-block px-3 py-1 bg-brand/20 text-brand text-xs font-bold rounded-full mb-4 uppercase tracking-wider border border-brand/20">
                            Nouveau
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Optimisez votre <span className="text-brand">mobilité solaire</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Calculez combien de panneaux sont nécessaires pour rouler gratuitement grâce au soleil.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-slate-200">Rechargez votre batterie à 0€</span>
                                </div>
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-slate-200">Simulez votre autonomie réelle</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full md:w-auto flex justify-center md:justify-end">
                            <Link href="/simulateur-ve">
                                <Button size="lg" className="bg-brand hover:bg-brand/90 text-slate-900 font-bold h-14 px-8 text-lg w-full md:w-auto shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all">
                                    Lancer le calcul
                                    <CarFront className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <ComparatorSection />

            <BlogPreviewSection country="FR" />

            <TrustSection />

            <CtaSection ctaLink="/simulateur" />
        </div>
    );
}
