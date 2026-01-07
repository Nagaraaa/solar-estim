import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export function ComparatorSection() {
    return (
        <section className="py-16 bg-slate-50 border-y border-slate-200">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                            <Scale className="w-4 h-4" /> NOUVEAU
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                            Ne choisissez pas votre matériel au hasard.
                        </h2>
                        <p className="text-lg text-slate-600">
                            Micro-onduleurs ou Optimiseurs ? Panneaux SunPower ou DualSun ?
                            Nos experts comparent pour vous les technologies les plus vendues en France et en Belgique.
                            <br />
                            <strong>Un mauvais choix d'onduleur peut coûter 20% de production.</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 shadow-lg" asChild>
                                <Link href="/comparateur/enphase-vs-solaredge">
                                    Comparatif : Enphase vs SolarEdge
                                </Link>
                            </Button>
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 shadow-lg" asChild>
                                <Link href="/comparateur/premium-sunpower-dualsun-meyerburger">
                                    Duel Premium : SunPower vs DualSun
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                                <Link href="/comparateur">Voir tous les tests</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Visual / Card Preview */}
                    <div className="flex-1 w-full max-w-md lg:max-w-lg relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-amber-100 rounded-full blur-3xl opacity-50" />
                        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="relative h-48 bg-slate-800">
                                <Image
                                    src="/images/comparateur/enphase-vs-solaredge-hero.webp"
                                    alt="Enphase vs SolarEdge"
                                    fill
                                    className="object-cover opacity-90"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                                    <div className="text-white font-bold text-lg">Le verdict d'expert 2026</div>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                                        <Zap className="w-4 h-4 text-amber-500" /> Performance
                                    </div>
                                    <div className="text-sm text-slate-500">Ombrage & Chaleur</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                                        <ShieldCheck className="w-4 h-4 text-green-500" /> Garantie
                                    </div>
                                    <div className="text-sm text-slate-500">12 ans vs 25 ans</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
