"use client";

import { Zap, PiggyBank, Leaf } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

interface FeatureSectionProps {
    variant: 'FR' | 'BE';
}

export function FeatureSection({ variant }: FeatureSectionProps) {
    const isBe = variant === 'BE';

    return (
        <section id="comment-ca-marche" className="py-24 bg-slate-50">
            <div className="container px-4 md:px-6 mx-auto">
                <FadeIn>
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Pourquoi utiliser Solar-Estim {isBe ? "Belgique " : ""}?
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Une approche transparente et scientifique pour votre projet solaire.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <FadeIn delay={100}>
                        <div className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-amber-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="inline-flex p-4 bg-brand/10 rounded-2xl text-brand-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Précision Scientifique</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Basé sur les données satellites <strong className="text-brand">PVGIS</strong> de la Commission Européenne pour une estimation fiable à 95%.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Feature 2 */}
                    <FadeIn delay={200}>
                        <div className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="inline-flex p-4 bg-emerald-100 rounded-2xl text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <PiggyBank className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Calcul de Rentabilité</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Nous analysons votre facture actuelle pour estimer vos économies réelles et votre <strong className="text-emerald-600">ROI sur 20 ans</strong>.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Feature 3 */}
                    <FadeIn delay={300}>
                        <div className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="inline-flex p-4 bg-blue-100 rounded-2xl text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Leaf className="h-8 w-8" />
                            </div>
                            {isBe ? (
                                <>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">Installateurs Certifiés</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Accédez à un réseau d'artisans <strong className="text-blue-600">RESCert</strong> vérifiés près de chez vous pour concrétiser votre projet.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">Spécialisé France</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Prise en compte des spécificités locales : <strong className="text-blue-600">EDF OA</strong>, tarifs de rachat et primes régionales.
                                    </p>
                                </>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
