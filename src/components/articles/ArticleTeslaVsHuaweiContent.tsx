import Image from "next/image";
import Link from "next/link";
import { SmartMarkdown } from "@/components/content/SmartMarkdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, Battery, Sliders, Smartphone, ShieldCheck } from "lucide-react";

export default function ArticleTeslaVsHuaweiContent({ country = "FR" }: { country?: "FR" | "BE" }) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="/images/comparateur/tesla-vs-huawei-hero.webp"
                        alt="Comparatif batterie domestique Tesla Powerwall vs Huawei Luna 2000"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 text-brand-light border border-brand/30 mb-6 text-sm font-medium">
                        <Battery className="w-4 h-4" /> Comparatif Stockage 2026 {country === "BE" ? "Belgique" : ""}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Tesla Powerwall vs Huawei Luna : <br />
                        <span className="text-brand-light">Le match des batteries</span> domestiques
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 font-light">
                        Le match de la décennie. Le géant de la Silicon Valley face au leader technologique chinois. Simplicité tout-en-un ou flexibilité modulaire ?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-8 text-lg shadow-lg shadow-brand/25" asChild>
                            <Link href="#verdict">Voir le verdict directement</Link>
                        </Button>
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 text-lg font-semibold" asChild>
                            <Link href="/simulateur">Simuler mon autonomie</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">

                {/* Intro */}
                <div className="prose prose-lg prose-slate mx-auto mb-16 first-letter:text-5xl first-letter:font-bold first-letter:text-brand first-letter:mr-1">
                    <SmartMarkdown country={country} text={`
                        Stocker son énergie solaire, c'est le rêve de l'indépendance énergétique.
                        
                        Pourquoi donner votre électricité gratuite au réseau le jour pour la racheter très chère la nuit ?
                        Avec une batterie, vous consommez votre propre soleil, même à 21h.
                        
                        Deux mastodontes dominent ce marché naissant :
                        *   **Tesla**, avec son **Powerwall** iconique, mise sur la simplicité "Apple-like".
                        *   **Huawei**, avec sa **Luna 2000**, mise sur une intelligence modulaire impressionnante.
                        
                        J'ai installé et configuré les deux. Voici ce que les fiches techniques ne vous disent pas sur leur **Cycle de vie** et leur usage réel.
                    `} />
                </div>

                {/* Section 1: Concept & Design */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Sliders className="w-8 h-8 text-brand" />
                        1. Philosophie : Tout-en-un vs Lego
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <Card className="border-t-4 border-t-red-600 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-red-600 text-2xl">Tesla Powerwall 3</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate">
                                <SmartMarkdown country={country} text={`
                                    **Le Monolithe de Puissance.**
                                    C'est une grosse brique de 13.5 kWh. Point.
                                    
                                    *   **Onduleur intégré :** Le Powerwall 3 contient son propre onduleur hybride.
                                    *   **Design :** Sublime, épuré, waterproof. On l'installe souvent dans le garage ou dehors bien en vue.
                                    *   **Philosophie :** "Ça juste marche." Pas de configuration complexe.
                                `} />
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-slate-800 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-slate-800 text-2xl">Huawei Luna 2000</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate">
                                <SmartMarkdown country={country} text={`
                                    **La Tour Évolutive.**
                                    C'est une **Batterie Incrémentale**.
                                    
                                    *   **Flexible :** Vous commencez avec un module de 5 kWh. Besoin de plus ? Vous "clipsez" un autre bloc de 5 kWh au-dessus. Jusqu'à 15 kWh par tour.
                                    *   **Indépendance des modules :** Chaque bloc de 5 kWh a son propre optimiseur d'énergie. Une vieille batterie ne bride pas une neuve.
                                    *   **Philosophie :** "Investissement progressif."
                                `} />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Focus FR / BE Block */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* Focus France */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🇫🇷</span>
                            <h3 className="font-bold text-blue-900 text-lg">Focus France</h3>
                        </div>
                        <p className="text-blue-800 text-sm mb-4">
                            Si vous possédez déjà une Tesla (Model 3, Y...), le <strong>Powerwall</strong> est une évidence. L'écosystème est unifié : votre voiture et votre maison discutent.
                            La fonction "Charge sur Solaire" permet de charger la voiture uniquement avec le surplus, sans aucune configuration complexe.
                        </p>
                    </div>

                    {/* Focus Belgique */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🇧🇪</span>
                            <h3 className="font-bold text-red-900 text-lg">Focus Belgique</h3>
                        </div>
                        <p className="text-red-800 text-sm mb-4">
                            Pour effacer le <strong>Tarif Prosumer</strong>, il ne faut pas sur-dimensionner inutilement la batterie.
                            La modularité de Huawei est parfaite : commencez avec 5 kWh ou 10 kWh juste pour couvrir vos soirées. Si demain vous achetez une pompe à chaleur, ajoutez un bloc de 5 kWh. Ajustez de 5 à 30 kWh selon vos besoins réels.
                        </p>
                    </div>
                </div>

                {/* Section 2: Technology Details */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-brand" />
                        2. Performance et Technologie
                    </h2>

                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl mb-8 group">
                        <Image
                            src="/images/comparateur/tesla-vs-huawei-tech.webp"
                            alt="Schéma technique flux énergie maison batterie autonomie solaire"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 backdrop-blur-sm">
                            <p className="font-medium text-center">L'autonomie maximale : Quand votre maison vit au rythme du soleil.</p>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate text-justify">
                        <SmartMarkdown country={country} text={`
                            Les deux utilisent la technologie **LFP** (Lithium Fer Phosphate), bien plus sûre et durable que le vieux NMC (Lithium-Ion classique de téléphone). Pas de risque d'emballement thermique.
                            
                            **Profondeur de décharge (DOD) :**
                            *   **Tesla et Huawei** permettent un **DOD** de 100%. Vous utilisez 13.5 kWh sur les 13.5 kWh achetés. Pas de capacité "fantôme" réservée.
                            
                            **Le cas du Backup (Coupure de courant) :**
                            *   **Tesla :** C'est sa grande force. Le **Blackout Backup** est natif et surpuissant. Il peut redémarrer toute la maison (même la clim ou la pompe à chaleur).
                            *   **Huawei :** Nécessite l'ajout de la "Backup Box". C'est souvent un backup partiel (frigo + lumière + internet) et moins puissant (monophasé souvent).
                        `} />
                    </div>
                </section>

                {/* Section 3: App & Ecosystem */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Smartphone className="w-8 h-8 text-brand" />
                        3. L'Application : Le cerveau du système
                    </h2>

                    <div className="prose prose-lg prose-slate">
                        <SmartMarkdown country={country} text={`
                            **Tesla App :** Sans surprise, c'est le top.
                            L'interface est fluide, sexy, addictive. Si vous avez une voiture Tesla, tout est dans la même appli. La fonction "Storm Watch" charge la batterie à fond si une tempête est détectée par la météo locale. Génial.
                            
                            **Huawei FusionSolar :** Plus "ingénieur".
                            C'est très complet, on voit tout (tensions, cellules...). C'est puissant mais moins "fun" pour un utilisateur lambda. Par contre, l'intégration avec les optimiseurs de panneaux Huawei est totale.
                        `} />
                    </div>
                </section>

                {/* Verdict Section */}
                <section id="verdict" className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-10 rotate-12">
                        <Image
                            src="/images/comparateur/tesla-vs-huawei-verdict.webp"
                            alt="Verdict comparatif batteries solaires 2026"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 mb-8 relative z-10">
                        Notre Verdict : Tout dépend de votre projet
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-red-600" /> Choisissez Tesla Powerwall si...
                            </h3>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> Vous voulez une grosse autonomie (13.5 kWh) tout de suite.</li>
                                <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> Vous craignez les coupures de courant (Backup Total).</li>
                                <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> Vous aimez l'écosystème Tesla.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-slate-800" /> Choisissez Huawei Luna si...
                            </h3>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex gap-2"><span className="text-slate-800 font-bold">•</span> Vous voulez commencer "petit" (5 ou 10 kWh) et voir après.</li>
                                <li className="flex gap-2"><span className="text-slate-800 font-bold">•</span> Vous avez déjà un onduleur Huawei SUN2000.</li>
                                <li className="flex gap-2"><span className="text-slate-800 font-bold">•</span> Budget initial serré (le module 5 kWh est plus accessible).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <p className="text-lg text-slate-600 mb-6">
                            L'ajout d'une batterie doit être calculé précisément pour être rentable.
                            <br /><strong>Simulez votre autoconsommation avec et sans batterie gratuitement.</strong>
                        </p>
                        <Button size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-12 py-6 text-xl shadow-xl shadow-brand/20 w-full md:w-auto animate-pulse" asChild>
                            <Link href="/simulateur">Calculer ma rentabilité Batterie</Link>
                        </Button>
                    </div>
                </section>

                <div className="mt-16 pt-8 border-t border-slate-200 text-slate-500 text-sm">
                    <p className="italic mb-4">Analyse technique indépendante (2026). Les capacités et garanties peuvent évoluer selon les firmwares constructeurs.</p>
                    <div className="flex gap-4">
                        <a href="https://www.tesla.com/fr_fr/powerwall" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">Tesla Powerwall Officiel &rarr;</a>
                        <a href="https://solar.huawei.com/fr/" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">Huawei FusionSolar FR &rarr;</a>
                    </div>
                </div>
            </div >
        </div >
    );
}
