import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Euro, Loader2, Zap, CarFront } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { getVehicles } from "@/app/actions/vehicleActions";

interface ConsumptionStepProps {
    form: UseFormReturn<any>;
    onBack: () => void;
    loading: boolean;
}

export function ConsumptionStep({ form, onBack, loading }: ConsumptionStepProps) {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const hasEv = form.watch("hasEv");
    const evModel = form.watch("evModel");
    const evDistance = form.watch("evDistance");
    const evKwh = form.watch("ev_kwh_estimated");

    // Fetch vehicles only if EV switch is toggled
    useEffect(() => {
        if (hasEv && vehicles.length === 0) {
            getVehicles().then(setVehicles);
        }
    }, [hasEv, vehicles.length]);

    // Calculate estimated EV consumption
    useEffect(() => {
        if (hasEv && evModel && evDistance && vehicles.length) {
            const v = vehicles.find(v => v.id === evModel);
            if (v) {
                const realConfig = v.real_world_factor || 1.15;
                const efficiency = v.charging_efficiency || 0.88;
                const realConso = v.consumption_wltp * realConfig;
                const gridConsoPer100 = realConso / efficiency;
                const annualKwh = (evDistance / 100) * gridConsoPer100;
                form.setValue("ev_kwh_estimated", Math.round(annualKwh));
                form.setValue("ev_model_name", `${v.brand} ${v.model}`);
            }
        } else if (!hasEv) {
            form.setValue("ev_kwh_estimated", 0);
            form.setValue("ev_model_name", undefined);
        }
    }, [hasEv, evModel, evDistance, vehicles, form]);

    return (
        <div className="space-y-8">
            <FormField
                control={form.control}
                name="monthlyBill"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Montant de votre facture d'électricité (mensuel)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Euro className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                    type="number"
                                    placeholder="Ex: 150"
                                    className="pl-10 h-12 text-lg"
                                    {...field}
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <CarFront className="w-5 h-5 text-brand" />
                            Véhicule Électrique
                        </Label>
                        <p className="text-sm text-slate-500">Avez-vous un véhicule électrique à charger ?</p>
                    </div>
                    <FormField
                        control={form.control}
                        name="hasEv"
                        render={({ field }) => (
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        )}
                    />
                </div>

                {hasEv && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="evModel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modèle du véhicule</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white text-slate-900 border-slate-200 dark:bg-white dark:text-slate-900 dark:border-slate-200">
                                                    <SelectValue placeholder="Choisir un modèle..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-[200px] dark:bg-white dark:text-slate-900 dark:border-slate-200">
                                                {vehicles.map(v => (
                                                    <SelectItem key={v.id} value={v.id}>
                                                        {v.brand} {v.model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="evDistance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kilométrage annuel (km)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" className="bg-white pr-12" {...field} />
                                                <span className="absolute right-3 top-2.5 text-sm text-slate-400">km</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {evKwh > 0 && (
                            <div className="flex items-center gap-2 text-sm text-brand font-bold bg-brand/10 p-3 rounded-lg border border-brand/20">
                                <Zap className="w-4 h-4 fill-brand" />
                                Impact estimé : +{evKwh} kWh/an à produire
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="w-full sm:flex-1 h-12"
                >
                    Retour
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 h-12 bg-brand text-slate-900 font-bold hover:bg-brand/90"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Calculer ma rentabilité"}
                </Button>
            </div>
        </div>
    );
}
