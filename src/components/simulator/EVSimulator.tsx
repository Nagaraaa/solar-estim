'use client';

import { useState, useEffect } from 'react';
import { getVehicles } from '@/app/actions/vehicleActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
    Zap, Info, BatteryCharging, Sun, ArrowRight, Gauge, Leaf, PlugZap, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from 'next/navigation';

export function EVSimulator() {
    const pathname = usePathname();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
    const [annualKm, setAnnualKm] = useState<number>(15000);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVehicles().then(data => {
            setVehicles(data);
            setLoading(false);
        });
    }, []);

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    // Calculation Engine
    const calculateImpact = () => {
        if (!selectedVehicle) return null;

        const { consumption_wltp, real_world_factor, charging_efficiency } = selectedVehicle;

        // 1. Real Consumption
        const realConsumption = consumption_wltp * (real_world_factor || 1.15);

        // 2. Grid Consumption
        const gridConsumptionPer100 = realConsumption / (charging_efficiency || 0.88);

        const dailyKm = annualKm / 365;

        // Energy needed at the WALL
        const dailyEnergyNeeded = (dailyKm / 100) * gridConsumptionPer100;
        const annualEnergyNeeded = dailyEnergyNeeded * 365;

        // Panel Impact (425W Panel @ 1100 kWh/kWc => ~467 kWh/year)
        const productionPerPanel = 0.425 * 1100;
        const panelsNeeded = Math.ceil(annualEnergyNeeded / productionPerPanel);
        const savingsEst = Math.round(annualEnergyNeeded * 0.25); // ~0.25€/kWh network cost

        return {
            annualEnergyNeeded: Math.round(annualEnergyNeeded),
            panelsNeeded,
            savingsEst,
            realConsoPer100: realConsumption.toFixed(1),
            efficiencyPct: Math.round((charging_efficiency || 0.88) * 100),
            gridConsoPer100: gridConsumptionPer100.toFixed(1)
        };
    };

    const result = calculateImpact();

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/50 rounded-2xl">
                <div className="grid md:grid-cols-12 min-h-[500px]">

                    {/* LEFT: Inputs (Dark Sidebar Style) */}
                    <div className="md:col-span-5 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                    <BatteryCharging className="text-brand w-6 h-6" />
                                    Simulateur VE
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Estimez l'impact de votre véhicule sur votre consommation électrique.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-slate-200">Votre Véhicule</Label>
                                    <Select onValueChange={setSelectedVehicleId} value={selectedVehicleId}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 h-12">
                                            <SelectValue placeholder="Choisir un modèle..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {vehicles.map(v => (
                                                <SelectItem key={v.id} value={v.id} className="focus:bg-slate-700 focus:text-white">
                                                    <div className="flex items-center gap-2">
                                                        {v.image_url && (
                                                            <div className="w-6 h-6 rounded-sm overflow-hidden bg-white shrink-0">
                                                                <img src={v.image_url} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-brand">{v.brand}</span>
                                                        <span className="opacity-90">{v.model}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedVehicle?.is_bidirectional && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/30 gap-1.5 py-1">
                                                <Zap className="w-3 h-3 fill-green-500" />
                                                Compatible V2G / V2H
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-slate-200">Distance Annuelle</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={annualKm}
                                            onChange={(e) => setAnnualKm(Number(e.target.value))}
                                            className="bg-slate-800 border-slate-700 text-white h-12 pr-16 text-lg font-medium"
                                        />
                                        <span className="absolute right-4 top-3 text-slate-400">km/an</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 px-1">
                                        <span>5 000</span>
                                        <span>50 000</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5000"
                                        max="50000"
                                        step="1000"
                                        value={annualKm}
                                        onChange={(e) => setAnnualKm(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="relative z-10 pt-8 border-t border-slate-800/50 mt-auto">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Info className="w-4 h-4 shrink-0" />
                                <p className="leading-snug">
                                    Le coût de recharge à domicile est 3x moins cher qu'en station publique.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Results (Clean Dashboard) */}
                    <div className="md:col-span-7 p-8 bg-slate-50 flex flex-col relative">
                        {/* Watermark Icon */}
                        <Sun className="absolute -top-10 -right-10 w-64 h-64 text-slate-200/50 pointer-events-none rotate-12" />

                        {!selectedVehicle ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                <CarFrontIcon className="w-16 h-16 text-slate-300" />
                                <p className="text-slate-500 font-medium">Sélectionnez un véhicule pour commencer</p>
                            </div>
                        ) : result ? (
                            <div className="h-full flex flex-col animate-in fade-in duration-500 space-y-6">

                                {/* Vehicle Visual with Reflection */}
                                <div className="relative w-full h-32 md:h-48 mb-6 flex items-center justify-center group perspective-1000">
                                    {selectedVehicle.image_url ? (
                                        <>
                                            <div className="relative z-10 w-auto h-full max-w-full drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 rounded-xl overflow-hidden ring-1 ring-white/10">
                                                <img
                                                    src={selectedVehicle.image_url}
                                                    alt={selectedVehicle.model}
                                                    className="h-full w-auto object-cover"
                                                />
                                            </div>
                                            {/* Reflection Effect */}
                                            <div className="absolute -bottom-6 z-0 w-auto h-full max-w-full opacity-20 scale-y-[-1] mask-image-gradient rounded-xl overflow-hidden">
                                                <img
                                                    src={selectedVehicle.image_url}
                                                    alt=""
                                                    className="h-full w-auto object-cover bg-gradient-to-t from-white to-transparent"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 w-1/2 h-4 bg-black/40 blur-xl rounded-[100%]"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-slate-200/50 rounded-xl flex items-center justify-center border-2 border-slate-200 border-dashed">
                                            <CarFrontIcon className="w-16 h-16 text-slate-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Header Result */}
                                <div className="relative z-10 px-6">
                                    <h3 className="text-slate-500 font-medium mb-1 uppercase tracking-wider text-xs">Impact Solaire Estimé</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight drop-shadow-sm">{result.panelsNeeded}</span>
                                        <span className="text-xl text-slate-800 font-bold">panneaux recommandés</span>
                                    </div>
                                    <p className="text-brand font-bold mt-1 flex items-center gap-2 text-sm">
                                        <Leaf className="w-4 h-4" />
                                        Pour rouler 100% solaire
                                    </p>
                                </div>

                                {/* Main Visual - Battery/Energy Bar */}
                                <div className="mx-6 bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-4 relative overflow-hidden ring-1 ring-slate-200/50">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-bold text-slate-700">Énergie Requise</span>
                                        <span className="text-2xl font-bold text-slate-900">{result.annualEnergyNeeded} <small className="text-xs font-normal text-slate-500">kWh/an</small></span>
                                    </div>

                                    {/* Custom Progress Bar */}
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                                        <div
                                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-brand to-amber-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                            style={{ width: `${Math.min((result.annualEnergyNeeded / 8000) * 100, 100)}%` }}
                                        />
                                    </div>

                                    {/* Expert Word - Dynamic Synthesis */}
                                    <div className="bg-blue-50/50 rounded-lg p-3 text-sm text-slate-700 border border-blue-100 flex gap-3 items-start">
                                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <p className="leading-snug">
                                            <span className="font-semibold text-blue-900">Le mot de l'expert :</span>
                                            <br />
                                            "Votre <span className="font-bold">{selectedVehicle.model}</span> consomme réellement <span className="font-bold">{result.realConsoPer100} kWh/100km</span>.
                                            Pour vos <span className="font-bold">{annualKm.toLocaleString()} km</span>, il nous faut produire <span className="font-bold">{result.annualEnergyNeeded} kWh/an</span>."
                                        </p>
                                    </div>
                                </div>

                                {/* Transparency Details - Faded for Hierarchy */}
                                <div className="mx-6 bg-slate-50/50 rounded-lg p-4 border border-slate-100/50 text-xs space-y-2 opacity-75 hover:opacity-100 transition-opacity duration-300 group/details">
                                    <div className="flex items-center gap-2 font-medium text-slate-400 mb-2 uppercase tracking-wide text-[10px]">
                                        <Gauge className="w-3 h-3" />
                                        Détails techniques
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-slate-500">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-1 cursor-help transition-colors hover:text-slate-900">
                                                        <span>Consommation WLTP</span>
                                                        <HelpCircle className="w-3 h-3" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">Donnée constructeur théorique (norme standard). Souvent optimiste par rapport à la réalité.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="text-right font-medium font-mono">{selectedVehicle.consumption_wltp} kWh/100km</span>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-1 cursor-help transition-colors hover:text-amber-600">
                                                        <span>Facteur Réalité</span>
                                                        <HelpCircle className="w-3 h-3" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">Coefficient de sécurité (x{selectedVehicle.real_world_factor || 1.15}) appliqué pour refléter la conduite réelle (clim, chauffage, autoroute) par rapport aux tests théoriques.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="text-right font-medium text-amber-600 font-mono">x{selectedVehicle.real_world_factor || 1.15}</span>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-1 cursor-help transition-colors hover:text-red-500">
                                                        <span>Pertes de Charge</span>
                                                        <HelpCircle className="w-3 h-3" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">L'énergie perdue sous forme de chaleur lors de la conversion du courant (AC/DC) pendant la recharge.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="text-right font-medium text-red-500 font-mono">{100 - result.efficiencyPct}%</span>

                                            <div className="col-span-2 border-t border-slate-200 my-1"></div>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-1 cursor-help transition-colors hover:text-slate-900">
                                                        <span className="font-semibold text-slate-700">Conso. Réelle à la prise</span>
                                                        <HelpCircle className="w-3 h-3 text-slate-400" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">C'est ce que votre compteur électrique voit vraiment passer pour recharger la voiture.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="text-right font-bold text-slate-900 font-mono">{result.gridConsoPer100} kWh/100km</span>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="px-6 pt-2 mt-auto pb-6">
                                    <Button asChild className="w-full h-14 text-lg bg-brand hover:bg-brand/90 text-slate-900 font-bold shadow-xl shadow-brand/20 transition-all hover:scale-[1.02]">
                                        <Link
                                            href={{
                                                pathname: pathname?.startsWith('/be') ? '/be/simulateur' : '/simulateur',
                                                query: {
                                                    ev_kwh: result.annualEnergyNeeded,
                                                    ev_model_name: selectedVehicle.model,
                                                    ev_id: selectedVehicle.id,
                                                    ev_distance: annualKm
                                                }
                                            }}
                                        >
                                            Intégrer à ma simulation complète
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Link>
                                    </Button>
                                    <div className="flex flex-col items-center gap-1 mt-4">
                                        <p className="text-center text-xs text-slate-400">
                                            Obtenez une étude de rentabilité précise incluant votre maison.
                                        </p>
                                        <Link href="/guide/guide-solaire-vehicule-electrique-2026" className="text-[10px] text-slate-400 underline hover:text-brand transition-colors">
                                            Pourquoi ces calculs sont-ils si précis ? [Lire notre méthodologie]
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        ) : null}
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Simple Icon Component for Empty State
function CarFrontIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H12c-.6 0-1.2.9-1.2 1.3 0 .4.6 1.7.6 1.7S8.7 9.4 7.2 9.1c-1.5-.3-2.2 2.9-2.2 2.9v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
        </svg>
    )
}
