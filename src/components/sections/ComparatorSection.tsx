"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function ComparatorSection() {
    return (
        <section className="py-8 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full"
            >
                <div className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-500">

                    {/* Visual Side (Interactive) */}
                    <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden bg-slate-900 border-b md:border-b-0 md:border-r border-slate-100">
                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="h-full w-full relative"
                        >
                            <Image
                                src="/images/comparateur/enphase-vs-solaredge-hero.webp"
                                alt="Duel Enphase vs SolarEdge"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-90" />
                        </motion.div>

                        {/* Floating Badge */}
                        <div className="absolute top-6 left-6 z-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide shadow-lg"
                            >
                                <Scale className="w-3.5 h-3.5 text-amber-400" />
                                GUIDE 2026
                            </motion.div>
                        </div>

                        {/* Bottom Context Info - Only visible on desktop/large cards to avoid crowding mobile */}
                        <div className="absolute bottom-0 left-0 p-6 w-full z-10 hidden sm:block">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight drop-shadow-md">
                                Micro-onduleur vs Optimiseur
                            </h3>
                            <div className="flex flex-wrap gap-3 text-slate-200 text-xs md:text-sm font-medium">
                                <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 backdrop-blur-sm border border-white/10">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Rendement
                                </span>
                                <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 backdrop-blur-sm border border-white/10">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sécurité
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center relative bg-white">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">
                                    Ne choisissez pas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">au hasard.</span>
                                </h2>
                                <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                                    Micro-onduleurs ou Optimiseurs ? Un mauvais choix peut réduire votre production de <strong className="text-slate-900">20%</strong>.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    size="lg"
                                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all h-12 text-sm md:text-base w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href="/comparateur/enphase-vs-solaredge">
                                        Voir le Duel <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="rounded-full px-6 border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-slate-700 h-12 text-sm md:text-base w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href="/comparateur">Tous les tests</Link>
                                </Button>
                            </div>

                            <p className="text-xs text-slate-400 font-medium pt-4 border-t border-slate-50 mt-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Mis à jour pour les normes 2026
                            </p>
                        </div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
