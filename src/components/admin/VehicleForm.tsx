'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createVehicle, updateVehicle } from '@/app/actions/vehicleActions';
import { Loader2 } from 'lucide-react';

interface VehicleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle?: any; // If present, edit mode
}

const initialState = {
    success: false,
    error: '',
};

export function VehicleForm({ open, onOpenChange, vehicle }: VehicleFormProps) {
    const isEditing = !!vehicle;
    // We need to wrap the action to pass the ID if editing
    const action = isEditing ? updateVehicle.bind(null, vehicle.id) : createVehicle;

    // useActionState (React 19) or useFormState (older Next)
    // Assuming React 19 / Next 15+ based on project analysis (React 19.2.1)
    const [state, formAction, isPending] = useActionState(action, initialState);

    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
        }
    }, [state.success, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier un véhicule" : "Ajouter un véhicule"}</DialogTitle>
                    <DialogDescription>
                        Détails techniques pour le simulateur solaire.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="grid gap-4 py-4">
                    {state.error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marque</Label>
                            <Input id="brand" name="brand" placeholder="Tesla" defaultValue={vehicle?.brand} required />
                            {state.fieldErrors?.brand && <span className="text-xs text-red-500">{state.fieldErrors.brand}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Modèle</Label>
                            <Input id="model" name="model" placeholder="Model Y" defaultValue={vehicle?.model} required />
                            {state.fieldErrors?.model && <span className="text-xs text-red-500">{state.fieldErrors.model}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Année</Label>
                            <Input id="year" name="year" type="number" defaultValue={vehicle?.year || new Date().getFullYear()} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="battery_capacity_kwh">Batterie (kWh)</Label>
                            <Input id="battery_capacity_kwh" name="battery_capacity_kwh" type="number" step="0.1" defaultValue={vehicle?.battery_capacity_kwh} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="range_wltp_km">Autonomie (WLTP)</Label>
                            <Input id="range_wltp_km" name="range_wltp_km" type="number" defaultValue={vehicle?.range_wltp_km} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="consumption_kwh_100km">Conso (kWh/100km)</Label>
                            <Input id="consumption_kwh_100km" name="consumption_kwh_100km" type="number" step="0.1" defaultValue={vehicle?.consumption_kwh_100km} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max_charge_power_kw">Charge Max (kW)</Label>
                            <Input id="max_charge_power_kw" name="max_charge_power_kw" type="number" step="0.1" defaultValue={vehicle?.max_charge_power_kw} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="real_world_factor">Facteur Réel (0.5 - 1.0)</Label>
                            <Input id="real_world_factor" name="real_world_factor" type="number" step="0.01" defaultValue={vehicle?.real_world_factor || 0.85} />
                            <p className="text-[10px] text-slate-500">Ratio Autonomie Réelle / WLTP</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="charging_efficiency">Efficacité Charge (0.5 - 1.0)</Label>
                            <Input id="charging_efficiency" name="charging_efficiency" type="number" step="0.01" defaultValue={vehicle?.charging_efficiency || 0.90} />
                            <p className="text-[10px] text-slate-500">Pertes Borne/Onduleur</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Switch id="is_bidirectional" name="is_bidirectional" defaultChecked={vehicle?.is_bidirectional} />
                            <Label htmlFor="is_bidirectional">Compatible V2G / V2H</Label>
                        </div>
                        {state.fieldErrors?.is_bidirectional && <span className="text-xs text-red-500">{state.fieldErrors.is_bidirectional}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url">URL Image (Optionnel)</Label>
                        <Input id="image_url" name="image_url" placeholder="https://..." defaultValue={vehicle?.image_url} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Créer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
