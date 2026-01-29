"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowRight, Car } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface MiniEVSimulatorProps {
    country: 'FR' | 'BE';
}

export function MiniEVSimulator({ country }: MiniEVSimulatorProps) {
    const [km, setKm] = useState<number | "">("");
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        if (!km || km < 0) return;

        // Constants
        const CONSUMPTION_KWH_KM = 0.20; // 20 kWh/100km
        const PANEL_POWER_MWP = 0.435; // 435 Wp

        // Annual Production Estimate (Conservative averages)
        // FR: ~1100 kWh/kWp/year
        // BE: ~950 kWh/kWp/year
        const YIELD = country === 'FR' ? 1100 : 950;
        const DAILY_YIELD_PER_KWP = YIELD / 365;

        // Calculation
        const dailyConsumption = Number(km) * CONSUMPTION_KWH_KM;
        const requiredKwp = dailyConsumption / DAILY_YIELD_PER_KWP;
        const panels = Math.ceil(requiredKwp / PANEL_POWER_MWP);

        setResult(panels);
    };

    return (
        <Card className="my-8 border-brand/20 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Header / Info */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand/20 rounded-lg text-brand">
                                <Car className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Simulateur Solaire & VE</h3>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Découvrez combien de panneaux solaires sont nécessaires pour parcourir vos trajets quotidiens gratuitement grâce au soleil {country === 'FR' ? 'de France' : 'de Belgique'}.
                        </p>
                    </div>

                    {/* Inputs & Action */}
                    <div className="flex-1 w-full max-w-sm bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                        {!result ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="daily-km" className="text-sm font-medium text-slate-200">
                                        Distance quotidienne (km)
                                    </label>
                                    <Input
                                        id="daily-km"
                                        type="number"
                                        placeholder="Ex: 40"
                                        value={km}
                                        onChange={(e) => setKm(Number(e.target.value))}
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-brand"
                                        onKeyDown={(e) => e.key === 'Enter' && calculate()}
                                    />
                                </div>
                                <Button onClick={calculate} className="w-full bg-brand text-slate-900 hover:bg-brand/90 font-bold">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Calculer
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-slate-300 mb-2 text-sm">Pour {km} km/jour, il vous faut environ :</p>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="text-5xl font-bold text-brand">{result}</span>
                                    <span className="text-xl font-medium text-white">Panneaux</span>
                                </div>
                                <Link
                                    href={`/${country === 'BE' ? 'be/' : ''}simulateur-ve`}
                                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm"
                                >
                                    Lancer la simulation complète <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                                <button
                                    onClick={() => setResult(null)}
                                    className="mt-3 text-xs text-slate-400 hover:text-white underline decoration-dashed underline-offset-4"
                                >
                                    Refaire un calcul
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
