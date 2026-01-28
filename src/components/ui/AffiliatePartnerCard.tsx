import { ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AffiliatePartnerCardProps {
    cityName: string;
    className?: string;
}

export function AffiliatePartnerCard({ cityName, className }: AffiliatePartnerCardProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300",
            className
        )}>
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50 pointer-events-none" />

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">

                {/* Content Section */}
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Partenaire Sécurité</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                        🛡️ Sécurisez votre future installation à <span className="text-blue-600">{cityName}</span>
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        Une installation solaire est un investissement précieux pour votre patrimoine.
                        Pour accompagner nos utilisateurs à {cityName}, nous avons sélectionné <span className="font-semibold text-slate-900">IMOU</span>, leader mondial de la sécurité intelligente.
                        Surveillez vos panneaux et votre domicile en temps réel sur votre smartphone.
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 max-w-fit">
                        <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                        Idéal pour surveiller la recharge de votre futur véhicule électrique.
                    </div>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col items-center sm:items-end gap-3 shrink-0 w-full sm:w-auto">
                    <Button
                        asChild
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-6 shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 text-base"
                    >
                        <a
                            href="https://www.awin1.com/cread.php?awinmid=122426&awinaffid=2696906&ued=https%3A%2F%2Fstore.imou.com%2F"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            Découvrir la gamme sécurité
                            <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </Button>
                    <p className="text-[10px] text-slate-400 text-center sm:text-right max-w-[200px] leading-tight opacity-70">
                        Lien affilié : Solar-Estim perçoit une commission sur les ventes partenaires, ce qui nous permet de maintenir ce simulateur gratuit.
                    </p>
                </div>
            </div>
        </div>
    );
}
