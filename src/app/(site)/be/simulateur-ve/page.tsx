import { EVSimulator } from "@/components/simulator/EVSimulator";
import { HeroSection } from "@/components/sections/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Simulateur Recharge Solaire Belgique | Solar Estim",
    description: "Estimez le nombre de panneaux solaires nécessaires pour recharger votre voiture électrique en Wallonie et Bruxelles.",
};

export default function EVSimulatorPageBe() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeroSection
                title={<>Roulez au <span className="text-brand">Solaire</span></>}
                subtitle="Wallonie, Bruxelles : Calculez combien de panneaux sont nécessaires pour alimenter votre voiture électrique et réduire votre facture."
                ctaLink="/be/simulateur"
                ctaText="Calculer ma rentabilité"
            />

            <div className="-mt-24 relative z-20 container mx-auto px-4 pb-20">
                <EVSimulator />

                <div className="mt-12 text-center max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Pourquoi faire ce calcul ?</h3>
                    <p className="text-slate-600 mb-8">
                        La recharge d'un véhicule électrique peut doubler votre consommation ménagère.
                        En Belgique, le tarif Prosumer (Wallonie) et le coût de l'énergie rendent l'autoconsommation solaire indispensable pour rentabiliser votre VE.
                    </p>
                </div>
            </div>
        </div>
    );
}
