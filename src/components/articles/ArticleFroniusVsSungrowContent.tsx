import { AutoLink } from "@/components/content/AutoLink";
import { TrustSection } from "@/components/sections/TrustSection";
import Image from "next/image";
import { Check, X, Trophy, Zap, Shield, Battery } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ArticleFroniusVsSungrowContent({ country = "FR" }: { country?: "FR" | "BE" }) {
    const isBe = country === "BE";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
                <Image
                    src="/images/blog/fronius-sungrow-hero.png"
                    alt="Comparatif Fronius Gen24 vs Sungrow SHxxT : Le duel des onduleurs hybrides 2026"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
                <div className="relative z-10 container px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 text-brand border border-brand/30 text-sm font-bold mb-6 backdrop-blur-sm">
                        <Zap className="w-4 h-4" /> DUEL HYBRIDE 2026
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                        Fronius vs Sungrow
                    </h1>
                    <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                        L'autrichien <span className="font-bold text-white">Fronius Gen24</span> affronte le géant chinois <span className="font-bold text-white">Sungrow</span>.
                        Fiabilité européenne ou rapport qualité-prix imbattable ? Le verdict de notre labo.
                    </p>
                </div>
            </div>

            <div className="container px-4 py-12 mx-auto max-w-5xl">
                {/* Introduction */}
                <div className="prose prose-lg prose-slate max-w-none mb-12">
                    <p className="lead text-xl text-slate-600 font-medium">
                        C'est le match que tous les installateurs attendaient. D'un côté, **Fronius**, la référence absolue en matière de qualité de fabrication, made in Austria. De l'autre, **Sungrow**, le numéro 1 mondial qui casse les prix avec des machines ultra-performantes.
                    </p>
                    <p>
                        En 2026, avec l'essor des <AutoLink country={country} text="batteries domestiques" /> (surtout en Belgique avec le <AutoLink country={country} text="Tarif Prosumer" />), le choix de l'<AutoLink country={country} text="onduleur hybride" /> est devenu crucial. Il ne s'agit plus seulement de convertir du courant, mais de piloter intelligemment votre maison et de vous protéger des coupures (Back-up).
                    </p>
                </div>

                {/* Round 1: Performance & Backup */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="border-l-4 border-l-red-600 shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-red-600" /> Fronius Gen24 Plus
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>PV Point (De série) :</strong> Une prise de secours alimentée même sans batterie ! Génial en cas de coupure (jusqu'à 3kW).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Full Backup (Option) :</strong> Alimente toute la maison (nécessite un coffret additionnel coûteux).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Refroidissement Actif :</strong> Un ventilateur (parfois bruyant) qui garantit la longévité des composants.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-orange-500" /> Sungrow SHxxT
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Backup Intégré (Gratuit) :</strong> La fonction de bascule automatique (20ms) est incluse de base. C'est un énorme avantage prix.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Puissance Monstre :</strong> Encaisse des pics de démarrage moteur (pompes à chaleur) impressionnants.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Passif (Silencieux) :</strong> Pas de ventilateur, silence absolu, mais chauffe un peu plus.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Round 2: Battery Compatibility */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Le Match des Batteries</h2>
                    <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                        <p className="mb-6 text-lg">
                            C'est souvent ici que tout se joue. Un onduleur hybride ne fonctionne pas avec n'importe quelle batterie.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-red-600 mb-2">Fronius aime BYD</h4>
                                <p className="text-slate-600">
                                    Le couple **Fronius + BYD HVS/HVM** (batterie LFP) est légendaire. C'est la configuration la plus testée et la plus fiable du marché européen depuis 5 ans. Vous ne pouvez pas vous tromper.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-500 mb-2">Sungrow aime... Sungrow</h4>
                                <p className="text-slate-600">
                                    Sungrow propose sa propre batterie (modulaire et empilable, façon Lego). L'avantage ? **Un seul interlocuteur** pour la garantie. Si ça bug, on ne peut pas dire "c'est la faute de la batterie". Installation ultra-rapide (plug & play).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Round 3: App & Software */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">L'Expérience Utilisateur (App)</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="font-bold text-xl">Solar.web (Fronius)</h3>
                            <p className="text-slate-600">
                                L'interface est austère mais extrêmement riche en données. Pour les "geeks" qui veulent analyser chaque courbe de <AutoLink country={country} text="MPPT" />, c'est le paradis. La version Premium (payante après 1 an) offre des analyses poussées.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-xl">iSolarCloud (Sungrow)</h3>
                            <p className="text-slate-600">
                                Une app ultra-moderne, visuelle et fluide (refaite en 2025/2026). Elle plaira davantage au grand public. On voit les flux d'énergie en temps réel avec de belles animations. Moins technique, plus "Apple".
                            </p>
                        </div>
                    </div>
                </div>

                {/* Verdict Section */}
                <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden mb-16">
                    <div className="relative z-10">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Le Verdict 2026</h2>

                        <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
                            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                <h3 className="font-bold text-xl text-yellow-400 mb-2">Vainqueur "Qualité Totale" : Fronius</h3>
                                <p className="text-slate-300">
                                    Si vous avez le budget et que vous voulez une machine faite pour durer 20 ans, riparable en Europe, choisissez le Gen24. Le "PV Point" est une rassurance géniale.
                                </p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                <h3 className="font-bold text-xl text-yellow-400 mb-2">Vainqueur "Rapport Qualité/Prix" : Sungrow</h3>
                                <p className="text-slate-300">
                                    Pour 20% à 30% moins cher, vous avez des prestations similaires voire supérieures sur le Backup. Une machine de guerre industrielle, ultra-efficace.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link href={isBe ? "/be/simulateur" : "/simulateur"}>
                                <Button size="lg" variant="brand" className="font-bold text-lg px-8">
                                    Comparer les devis avec ces onduleurs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold mb-6 text-center">Questions Fréquentes</h3>
                    <div className="space-y-4">
                        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span>Peut-on ajouter une batterie plus tard ?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 p-4 pt-0 border-t border-slate-100 mt-2 bg-white">
                                    Oui, les deux onduleurs sont 'Battery Ready'. Vous pouvez installer l'onduleur aujourd'hui et ajouter la batterie dans 2 ans sans changer l'appareil.
                                </div>
                            </details>
                        </div>
                        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span>Quelle est la durée de garantie ?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 p-4 pt-0 border-t border-slate-100 mt-2 bg-white">
                                    Fronius offre généralement 2 ans + extension gratuite à 10 ans si enregistré en ligne. Sungrow offre souvent 10 ans de base. Vérifiez toujours les conditions de votre installateur.
                                </div>
                            </details>
                        </div>
                        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span>Est-ce compatible avec les panneaux bi-faciaux ?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 p-4 pt-0 border-t border-slate-100 mt-2 bg-white">
                                    Absolument. Les deux modèles gèrent de forts courants d'entrée, parfaits pour les nouveaux panneaux haute puissance (500Wc+).
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>

            <TrustSection />
        </div>
    );
}
