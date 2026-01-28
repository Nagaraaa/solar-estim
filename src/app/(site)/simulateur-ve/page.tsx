import { EVSimulator } from '@/components/simulator/EVSimulator';
import { HeroSection } from '@/components/sections/HeroSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Simulateur Véhicule Électrique | Solar-Estim',
    description: 'Estimez le nombre de panneaux solaires nécessaires pour recharger votre voiture électrique gratuitement.',
};

export default function EVSimulatorPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeroSection
                title={<>Simulateur <span className="text-brand">Véhicule Électrique</span></>}
                subtitle="Découvrez combien de panneaux solaires il vous faut pour rouler à l'énergie solaire."
                ctaLink="/simulateur"
                ctaText="Simulation Solaire Complète"
            />

            <div className="-mt-24 relative z-20 container mx-auto px-4 pb-20">
                <EVSimulator />

                <div className="mt-12 text-center max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Pourquoi faire ce calcul ?</h3>
                    <p className="text-slate-600 mb-8">
                        La recharge d'un véhicule électrique peut doubler votre consommation électrique.
                        Le solaire est la solution la plus rentable pour compenser ce coût, avec un kWh produit à environ 0,08€ (contre 0,25€+ sur le réseau).
                    </p>
                </div>
            </div>
        </div>
    )
}
