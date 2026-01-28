'use client';

import { useState, useEffect } from 'react';
import { getVehicles } from '@/app/actions/vehicleActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Zap, Info, BatteryCharging } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EVSimulator() {
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

        const { consumption_kwh_100km, real_world_factor, charging_efficiency } = selectedVehicle;

        // Formula: Needs = (Km / 100) * Consumption_WLTP * RealFactor / Efficiency
        // RealFactor (default 0.85): Accounts for weather, driving style vs WLTP
        // Efficiency (default 0.90): Accounts for inverter/charger losses

        // Use defaults if missing in DB (fallback for legacy data)
        const factor = real_world_factor || 1.0;
        const efficiency = charging_efficiency || 0.90;
        const consoKwh = consumption_kwh_100km || 15; // default fallback

        const dailyKm = annualKm / 365;

        // Energy needed at the WALL (what the meter sees)
        const dailyEnergyNeeded = (dailyKm / 100) * consoKwh * (1 / factor) / efficiency;
        const annualEnergyNeeded = dailyEnergyNeeded * 365;

        // Impact on Panels (assuming ~420W panel producing ~1.1kWh/Wc avg in FR => ~460kWh/panel/yr? 
        // Let's use a standard production factor: 1100 kWh / kWc / year
        // Panel = 425W
        const productionPerPanel = 0.425 * 1100; // ~467 kWh/year
        const panelsNeeded = Math.ceil(annualEnergyNeeded / productionPerPanel);

        return {
            annualEnergyNeeded: Math.round(annualEnergyNeeded),
            panelsNeeded,
            dailyEnergyNeeded: dailyEnergyNeeded.toFixed(1)
        };
    };

    const result = calculateImpact();

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                    <BatteryCharging className="text-brand" />
                    Simulateur de Charge Véhicule
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Votre Véhicule</Label>
                        <Select onValueChange={setSelectedVehicleId} value={selectedVehicleId}>
                            <SelectTrigger>
                                <SelectValue placeholder={loading ? "Chargement..." : "Choisir un modèle"} />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles.map(v => (
                                    <SelectItem key={v.id} value={v.id}>
                                        {v.brand} {v.model} ({v.year})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedVehicle?.is_bidirectional && (
                            <div className="mt-2">
                                <Link href="/lexique/borne-bidirectionnelle" target="_blank" className="inline-flex items-center hover:opacity-80 transition-opacity">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 gap-1 cursor-pointer">
                                        <Zap className="w-3 h-3 fill-green-500" />
                                        Compatible V2G / V2H
                                    </Badge>
                                </Link>
                                <p className="text-[10px] text-slate-500 mt-1 ml-1">
                                    Ce véhicule peut alimenter votre maison.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Kilométrage Annuel</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={annualKm}
                                onChange={(e) => setAnnualKm(Number(e.target.value))}
                                className="pr-12"
                            />
                            <span className="absolute right-3 top-2.5 text-sm text-slate-400">km</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {result && selectedVehicle && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Consommation Supplémentaire</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    +{result.annualEnergyNeeded} <span className="text-sm font-normal text-slate-600">kWh/an</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Panneaux à ajouter</p>
                                <p className="text-2xl font-bold text-brand">
                                    +{result.panelsNeeded} <span className="text-sm font-normal text-slate-600">Panneaux</span>
                                </p>
                                <p className="text-[10px] text-slate-400">(Base 425Wc)</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                            <Info className="w-3 h-3" />
                            Calcul basé sur une conso réelle de {(selectedVehicle.consumption_kwh_100km / (selectedVehicle.real_world_factor || 0.85)).toFixed(1)} kWh/100km
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
