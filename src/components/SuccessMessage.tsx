import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AffiliatePartnerCard } from "@/components/ui/AffiliatePartnerCard";

interface SuccessMessageProps {
    cityName?: string;
}

export function SuccessMessage({ cityName = "votre ville" }: SuccessMessageProps) {
    return (
        <Card className="border-0 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 animate-pulse"></div>
                <div className="flex justify-center mb-6 relative z-10">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold mb-2 relative z-10 tracking-tight">Félicitations !</h3>
                <p className="text-green-100 text-lg relative z-10 font-medium">
                    Votre demande a bien été transmise.
                </p>
            </div>
            <CardContent className="p-10 bg-slate-50 text-center space-y-6">
                <div className="space-y-2">
                    <p className="text-xl text-slate-800 font-semibold">
                        Merci pour votre confiance.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Votre rapport détaillé vient d'être généré. Vous allez le recevoir par <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">email</span> dans quelques instants.
                    </p>
                </div>

                <div className="text-left mt-4">
                    <AffiliatePartnerCard cityName={cityName} />

                    <div className="mt-4 text-center">
                        <Link href="/guide/guide-solaire-vehicule-electrique-2026" className="text-xs text-slate-500 hover:text-brand flex items-center justify-center gap-1 transition-colors">
                            Pour aller plus loin, lisez notre Guide Solaire & Mobilité 2026 <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                <div className="w-16 h-1 bg-slate-200 mx-auto rounded-full"></div>

                <div className="text-sm text-slate-400">
                    Surveillez votre téléphone et vos emails (y compris les spams).<br />
                    L'équipe Solar Estim
                </div>
            </CardContent>
        </Card>
    );
}
