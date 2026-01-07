import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export function ComparatorSection() {
    return (
        <section className="py-16 bg-slate-50 border-y border-slate-200">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">

                    {/* Visual Side */}
                    <div className="lg:w-1/2 relative h-64 lg:h-auto bg-slate-800">
                        <Image
                            src="/images/comparateur/enphase-vs-solaredge-hero.webp"
                            alt="Enphase vs SolarEdge"
                            fill
                            className="object-cover opacity-90"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
                            <div className="text-white">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-semibold mb-3 backdrop-blur-sm">
                                    <Scale className="w-3 h-3" /> NOUVEAU
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Le verdict d'expert 2026</h3>
                                <div className="flex gap-4 text-sm text-slate-300">
                                    <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-400" /> Performance</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-400" /> Garantie</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-6">
                        <h2 className="text-3xl font-extrabold text-slate-900">
                            Ne choisissez pas au hasard.
                        </h2>
                        <p className="text-lg text-slate-600">
                            Micro-onduleurs ou Optimiseurs ? Panneaux SunPower ou DualSun ?
                            <span className="block mt-2 font-medium text-slate-900">
                                Un mauvais choix d'onduleur peut coûter 20% de production.
                            </span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto" asChild>
                                <Link href="/comparateur/enphase-vs-solaredge">
                                    Comparatif Onduleurs
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                                <Link href="/comparateur">Voir tous les tests</Link>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
