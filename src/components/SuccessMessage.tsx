import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function SuccessMessage() {
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
                        Un expert Solar Estim va analyser votre dossier et vous recontactera personnellement sous <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">24 heures</span>.
                    </p>
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
