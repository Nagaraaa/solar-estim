'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { Plus, CarFront, Battery, Zap, Trash2, Edit } from "lucide-react";
import { deleteVehicle } from "@/app/actions/vehicleActions";

interface VehicleListProps {
    initialVehicles: any[];
}

export default function VehicleList({ initialVehicles }: VehicleListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<any>(null);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
            await deleteVehicle(id);
        }
    };

    return (
        <>
            <div className="flex justify-end mb-6 -mt-16">
                <Button onClick={() => { setEditingVehicle(null); setIsAddOpen(true); }} className="bg-brand text-slate-900 hover:bg-brand/90 font-medium">
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter un véhicule
                </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Véhicule</th>
                            <th className="px-6 py-4">Batterie Net</th>
                            <th className="px-6 py-4">Conso WLTP</th>
                            <th className="px-6 py-4">Tech</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {initialVehicles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Aucun véhicule trouvé. Ajoutez-en un pour commencer.
                                </td>
                            </tr>
                        ) : (
                            initialVehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                                <CarFront className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{v.brand} {v.model}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Battery className="w-4 h-4 text-slate-400" />
                                            {v.battery_usable} kWh
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {v.consumption_wltp} kWh/100km
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {v.is_bidirectional && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    <Zap className="w-3 h-3 mr-1 fill-green-500" />
                                                    V2G
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingVehicle(v); setIsAddOpen(true); }}>
                                                <Edit className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id, `${v.brand} ${v.model}`)}>
                                                <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Shared Modal for Create/Edit */}
            <VehicleForm
                open={isAddOpen}
                onOpenChange={(val) => {
                    setIsAddOpen(val);
                    if (!val) setEditingVehicle(null);
                }}
                vehicle={editingVehicle}
            />
        </>
    );
}
