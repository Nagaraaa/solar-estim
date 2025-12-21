import { Zap, PiggyBank, Leaf } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

interface FeatureSectionProps {
    variant: 'FR' | 'BE';
}

export function FeatureSection({ variant }: FeatureSectionProps) {
    const isBe = variant === 'BE';

    return (
        <section id="comment-ca-marche" className="py-20 bg-white">
            <FadeIn className="container px-4 md:px-6 mx-auto" delay={200}>
                <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">
                    Pourquoi utiliser Solar-Estim {isBe ? "Belgique " : ""}?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Common Feature 1 */}
                    <div className="flex flex-col items-center text-center space-y-4 hover:bg-slate-50 p-6 rounded-xl transition-colors duration-300">
                        <div className="p-4 bg-brand/10 rounded-full text-brand-foreground hover:scale-110 transition-transform">
                            <Zap className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold">Précision Scientifique</h3>
                        <p className="text-slate-600">
                            Basé sur les données satellites PVGIS de la Commission Européenne pour une estimation fiable à 95%.
                        </p>
                    </div>

                    {/* Common Feature 2 */}
                    <div className="flex flex-col items-center text-center space-y-4 hover:bg-slate-50 p-6 rounded-xl transition-colors duration-300">
                        <div className="p-4 bg-success/10 rounded-full text-success hover:scale-110 transition-transform">
                            <PiggyBank className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold">Calcul de Rentabilité</h3>
                        <p className="text-slate-600">
                            Nous analysons votre facture actuelle pour estimer vos économies réelles et votre retour sur investissement.
                        </p>
                    </div>

                    {/* Specific Feature 3 */}
                    <div className="flex flex-col items-center text-center space-y-4 hover:bg-slate-50 p-6 rounded-xl transition-colors duration-300">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600 hover:scale-110 transition-transform">
                            <Leaf className="h-10 w-10" />
                        </div>
                        {isBe ? (
                            <>
                                <h3 className="text-xl font-bold">Installateurs Certifiés</h3>
                                <p className="text-slate-600">
                                    Accédez à un réseau d'artisans RESCert vérifiés près de chez vous pour concrétiser votre projet.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold">Spécialisé Wallonie & France</h3>
                                <p className="text-slate-600">
                                    Prise en compte des spécificités locales : compteur qui tourne à l'envers, tarifs de rachat et primes régionales.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}
