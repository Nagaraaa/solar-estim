import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24 min-h-screen flex flex-col items-center">

            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header Profile */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <User className="w-10 h-10 text-slate-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Pourquoi j'ai créé SolarEstim ?
                        </h1>
                        <p className="text-lg text-slate-500 font-medium mt-2">
                            Une approche honnête du solaire.
                        </p>
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                    <CardContent className="p-8 md:p-10 space-y-6 text-slate-700 leading-relaxed text-lg">

                        <p>
                            <span className="font-bold text-slate-900">Bonjour, je suis Steve.</span>
                        </p>

                        <p>
                            Comme beaucoup de propriétaires, j'ai envisagé d'installer des panneaux solaires. Et comme vous, je me suis heurté à un mur : <span className="italic">démarchage téléphonique agressif, devis illisibles et promesses de rentabilité parfois douteuses.</span>
                        </p>

                        <p>
                            Ne trouvant pas de réponse neutre, j'ai décidé de créer ma propre solution.
                        </p>

                        <hr className="border-slate-100 my-6" />

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                Une approche différente
                            </h2>
                            <p>
                                Je ne suis pas un commercial qui veut vous vendre une marque à tout prix. Je suis le créateur de cet outil indépendant.
                            </p>
                            <p>
                                J'ai conçu <span className="font-bold text-brand text-yellow-600">SolarEstim</span> pour qu'il se connecte directement aux bases de données scientifiques officielles (PVGIS de la Commission Européenne).
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                            <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider mb-2">Ma promesse est simple</h3>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-900">Transparence :</span> Un calcul mathématique basé sur l'ensoleillement réel de votre toiture.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-900">Gratuité :</span> L'utilisation du simulateur est 100% gratuite.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-900">Liberté :</span> Vous obtenez vos chiffres d'abord. Si le résultat est positif, libre à vous de demander une mise en relation avec un artisan vérifié. Sinon, vous aurez économisé du temps et de l'argent.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <p className="font-handwriting text-2xl text-slate-400 rotate-2 mt-4 text-center">
                            Bonne simulation !
                        </p>

                    </CardContent>
                </Card>

                {/* Footer Action */}
                <div className="flex justify-center">
                    <Link href="/simulateur">
                        <Button variant="outline" className="gap-2 h-12 px-6 border-slate-300 hover:bg-slate-50 text-slate-600">
                            <ChevronLeft className="w-4 h-4" /> Retour au simulateur
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
