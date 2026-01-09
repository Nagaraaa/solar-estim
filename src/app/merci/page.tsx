import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata = {
    title: "Demande reçue | Solar Estim",
    description: "Votre demande d'étude solaire a bien été prise en compte.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MerciPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <FadeIn>
                <div className="max-w-xl w-full text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Demande reçue avec succès !
                        </h1>
                        <p className="text-xl text-slate-600">
                            Votre dossier d'étude solaire est maintenant entre les mains de nos experts.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-left space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-brand/10 p-2 rounded-lg shrink-0">
                                <Mail className="h-6 w-6 text-brand" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Vérifiez vos emails</h3>
                                <p className="text-slate-600 text-sm mt-1">
                                    Vous allez recevoir votre rapport de rentabilité détaillé dans moins de 5 minutes. Pensez à vérifier vos spams.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link href="/">
                            <Button variant="outline" size="lg" className="gap-2">
                                <Home className="h-4 w-4" />
                                Retour à l'accueil
                            </Button>
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
