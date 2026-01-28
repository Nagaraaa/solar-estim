import { getVehicles } from "@/app/actions/vehicleActions";
import VehicleList from "./VehicleList";

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
    const vehicles = await getVehicles();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Catalogue Véhicules</h1>
                    <p className="text-slate-500 mt-2">Gérez les modèles de voitures électriques pour le simulateur.</p>
                </div>
            </div>

            <VehicleList initialVehicles={vehicles} />
        </div>
    );
}
