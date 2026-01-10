"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Battery, Sun, Zap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorControlsProps {
    address: string;
    monthlyBill: number;
    slope: number;
    azimuth: number;
    withBattery: boolean;
    onUpdate: (updates: Partial<{ slope: number; azimuth: number; withBattery: boolean }>) => void;
    isBusy?: boolean;
}

export function SimulatorControls({
    address,
    monthlyBill,
    slope,
    azimuth,
    withBattery,
    onUpdate,
    isBusy
}: SimulatorControlsProps) {
    return (
        <div className="space-y-6">
            {/* My Home Summary */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-start gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-slate-900 line-clamp-2 text-sm">{address}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-brand shrink-0" />
                    <div>
                        <p className="font-bold text-slate-900">{monthlyBill} € <span className="text-slate-500 font-normal">/ mois</span></p>
                    </div>
                </div>
            </div>

            {/* Roof Configuration */}
            <div className="space-y-6">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Configuration Toiture
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label className="text-slate-600">Inclinaison</Label>
                        <span className="text-sm font-bold text-brand bg-brand/10 px-2 rounded">{slope}°</span>
                    </div>
                    <Slider
                        value={[slope]}
                        onValueChange={(vals) => onUpdate({ slope: vals[0] })}
                        max={90}
                        step={1}
                        className={cn(isBusy && "opacity-50")}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label className="text-slate-600">Orientation</Label>
                        <span className="text-sm font-bold text-brand bg-brand/10 px-2 rounded">{azimuth}°</span>
                    </div>
                    <Slider
                        value={[azimuth]}
                        onValueChange={(vals) => onUpdate({ azimuth: vals[0] })}
                        max={180}
                        min={-180}
                        step={5}
                        className={cn(isBusy && "opacity-50")}
                    />
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Battery Selection Cards */}
            <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Battery className="w-4 h-4" /> Stockage Batterie
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {/* Option 1: No Battery */}
                    <div
                        onClick={() => onUpdate({ withBattery: false })}
                        className={cn(
                            "cursor-pointer p-4 rounded-lg border-2 transition-all flex items-center gap-3",
                            !withBattery
                                ? "border-brand bg-brand/5 shadow-sm"
                                : "border-slate-100 hover:border-slate-300 bg-white"
                        )}
                    >
                        <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", !withBattery ? "border-brand" : "border-slate-300")}>
                            {!withBattery && <div className="w-2 h-2 rounded-full bg-brand" />}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900">Standard</p>
                            <p className="text-xs text-slate-500">Optimisé pour la rentabilité rapide.</p>
                        </div>
                    </div>

                    {/* Option 2: With Battery */}
                    <div
                        onClick={() => onUpdate({ withBattery: true })}
                        className={cn(
                            "cursor-pointer p-4 rounded-lg border-2 transition-all flex items-center gap-3",
                            withBattery
                                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                : "border-slate-100 hover:border-slate-300 bg-white"
                        )}
                    >
                        <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", withBattery ? "border-emerald-500" : "border-slate-300")}>
                            {withBattery && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900 flex flex-wrap items-center gap-2">
                                Avec Batterie
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">RECOMMANDÉ</span>
                            </p>
                            <p className="text-xs text-slate-500">Stockez votre surplus pour le soir.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
