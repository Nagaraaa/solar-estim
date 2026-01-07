import Image from "next/image";
import Link from "next/link";
import { AutoLink } from "@/components/content/AutoLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, ShieldCheck, Banknote, BrainCircuit } from "lucide-react";

export default function ArticleEnphaseSolarEdgeContent({ country = "FR" }: { country?: "FR" | "BE" }) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="/images/comparateur/enphase-vs-solaredge-hero.webp"
                        alt="Duel onduleur Enphase vs SolarEdge : le match pour votre toit"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 text-brand-light border border-brand/30 mb-6 text-sm font-medium">
                        <BrainCircuit className="w-4 h-4" /> Analyse Technique 2026 {country === "BE" ? "Belgique" : ""}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Enphase vs SolarEdge : <br />
                        <span className="text-brand-light">Micro-onduleurs ou Optimiseurs</span> pour votre toit ?
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 font-light">
                        Micro-onduleurs ou Optimiseurs ? Le choix du "cerveau" de votre installation détermine sa rentabilité sur 25 ans. Voici notre verdict d'expert.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-8 text-lg shadow-lg shadow-brand/25" asChild>
                            <Link href="#verdict">Voir le verdict directement</Link>
                        </Button>
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 text-lg font-semibold" asChild>
                            <Link href="/simulateur">Simuler mon projet</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">

                {/* Intro */}
                <div className="prose prose-lg prose-slate mx-auto mb-16 first-letter:text-5xl first-letter:font-bold first-letter:text-brand first-letter:mr-1">
                    <AutoLink country={country} text={`
                        Je vais être direct avec vous : choisir ses panneaux solaires, c'est bien. Mais choisir son onduleur, c'est crucial. Imaginez acheter une Ferrari (vos panneaux Premium) et y mettre un moteur de Twingo (un onduleur bas de gamme). Résultat ? Vous n'avancerez pas.

                        L'Onduleur Hybride est le cœur et le cerveau de votre installation. C'est lui qui transforme l'énergie du soleil en électricité utilisable pour votre maison. S'il lâche, tout s'arrête. S'il est inefficace (mauvais MPPT), vous perdez de l'argent chaque jour.

                        Aujourd'hui, deux géants américains dominent le marché mondial et s'affrontent sur votre toit : Enphase Energy et SolarEdge. Ils ne boxent pas dans la même catégorie technologique, mais visent le même but : la performance absolue et une Injection réseau maîtrisée.

                        En tant qu'expert ayant vu passer des milliers de devis et monitoré des centaines d'installations en France et en Belgique, je vais décortiquer pour vous leurs différences, sans jargon marketing, pour que vous puissiez faire le choix le plus rentable pour VOTRE situation.
                    `} />
                </div>

                {/* Section 1: Technology */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-brand" />
                        1. Le match technologique : David vs Goliath
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <Card className="border-l-4 border-l-blue-500 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-blue-600 text-2xl">Enphase : Le Micro-Onduleur</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate">
                                <AutoLink country={country} text={`
                                    Imaginez une armée de fourmis indépendantes. Avec Enphase, chaque panneau solaire possède son propre **Micro-onduleur** (souvent fixé juste derrière).
                                    
                                    *   **Indépendance totale :** Chaque panneau travaille seul. Si l'un est à l'ombre ou sale, les autres continuent à 100%.
                                    *   **Conversion immédiate :** Le courant continu (DC) est transformé en alternatif (AC) directement sur le toit.
                                    *   **Sécurité maximale :** Pas de haute tension qui court sur votre toit, juste du 230V standard.
                                    
                                    C'est la solution "décentralisée".
                                `} />
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-red-500 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-red-600 text-2xl">SolarEdge : L'Optimiseur</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate">
                                <AutoLink country={country} text={`
                                    Imaginez un chef d'orchestre génial (l'Onduleur central) avec un assistant derrière chaque musicien (l'Optimiseur).
                                    
                                    *   **Optimisation DC :** Chaque panneau a un petit boîtier (l'optimiseur) qui règle la tension pour tirer le maximum de puissance.
                                    *   **Conversion centrale :** L'énergie descend toujours en continu (DC) jusqu'à un seul onduleur central (souvent dans le garage) qui fait la conversion.
                                    *   **Hybride par nature :** L'onduleur central gère souvent directement les batteries sans ajout matériel.
                                    
                                    C'est la solution "centralisée optimisée".
                                `} />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Focus FR / BE Block - Installation */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* Focus France */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🇫🇷</span>
                            <h3 className="font-bold text-blue-900 text-lg">Focus France</h3>
                        </div>
                        <p className="text-blue-800 text-sm mb-4">
                            En France, la garantie est la clé. La garantie produit de <strong>25 ans</strong> d'Enphase (contre 12 ans standard pour SolarEdge) sécurise votre investissement sur le très long terme, un argument de poids pour la revente de la maison.
                        </p>
                        <ul className="text-sm text-blue-700 list-disc ml-4 space-y-1">
                            <li>Certification <strong>RGE</strong> indispensable</li>
                            <li>Relais Q intégré (Norme VDE 0126)</li>
                        </ul>
                    </div>

                    {/* Focus Belgique */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🇧🇪</span>
                            <h3 className="font-bold text-red-900 text-lg">Focus Belgique</h3>
                        </div>
                        <p className="text-red-800 text-sm mb-4">
                            Avec le <strong>Tarif Prosumer</strong>, vous êtes taxé sur la puissance théorique de votre onduleur.
                            Les optimiseurs SolarEdge permettent de "piloter" l'injection et parfois de sous-dimensionner l'onduleur central pour réduire cette taxe, tout en gardant une production maximale.
                        </p>
                        <ul className="text-sm text-red-700 list-disc ml-4 space-y-1">
                            <li>Matériel homologué <strong>Synergrid</strong> C10/26</li>
                            <li>Gestion fine de l'injection réseau</li>
                        </ul>
                    </div>
                </div>

                {/* Section 2: Performance */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-brand" />
                        2. Performance en Conditions Réelles
                    </h2>

                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl mb-8 group">
                        <Image
                            src="/images/comparateur/performance-chart.webp"
                            alt="Comparatif précis performance onduleur sous ombrage partiel"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 backdrop-blur-sm">
                            <p className="font-medium text-center">Impact de l'ombrage : La gestion individuelle sauve votre production.</p>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate text-justify">
                        <AutoLink country={country} text={`
                            C'est ici que ça se joue. Sur un toit parfait, plein sud, sans ombre, à 25°C, les deux systèmes se valent (à 1% près). Mais la vraie vie, ce n'est pas un laboratoire.
                            
                            **Face à l'ombre (Cheminée, Arbre, Feuille) :**
                            Enphase et SolarEdge brillent tous les deux par rapport à un onduleur classique.
                            Si un panneau est à l'ombre, **l'Optimisation DC** de SolarEdge ou le fonctionnement indépendant d'Enphase empêche ce panneau de "contaminer" les autres.
                            
                            **MPPT et Réactivité :**
                            Le **MPPT** (Maximum Power Point Tracker) est ultra-rapide chez les deux fabricants. Il ajuste la tension en temps réel pour capturer le maximum d'énergie.
                            
                            **Le démarrage le matin :**
                            Enphase a besoin de très peu de tension pour s'allumer (Burst Mode). Ils produisent souvent quelques minutes plus tôt le matin.
                        `} />
                    </div>
                </section>

                {/* Section 3: Installation & Security */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-brand" />
                        3. Installation et Sécurité
                    </h2>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
                        <h3 className="text-xl font-bold text-amber-800 mb-2">La Sécurité Incendie</h3>
                        <p className="text-amber-900">
                            <strong>SolarEdge</strong> utilise la fonction <em>SafeDC</em> : tension réduite à 1V par module en cas de coupure.
                            <br />
                            <strong>Enphase</strong> est nativement sûr : pas de haute tension DC (courant continu) dangereuse sur le toit.
                        </p>
                    </div>

                    <div className="prose prose-lg prose-slate">
                        <AutoLink country={country} text={`
                            Côté évolutivité, **Enphase** est le roi.
                            Vous voulez commencer petit (8 panneaux) et en ajouter 4 l'année prochaine ? Avec Enphase, c'est un jeu d'enfant.
                            
                            Avec **SolarEdge**, vous êtes limité par la puissance de l'onduleur central installé au départ.
                        `} />
                    </div>
                </section>

                {/* Section 4: Price & ROI */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Banknote className="w-8 h-8 text-brand" />
                        4. Prix et Rentabilité (ROI)
                    </h2>

                    <div className="prose prose-lg prose-slate mb-8">
                        <AutoLink country={country} text={`
                            C'est souvent le critère décisif. La technologie Micro-onduleur est une merveille de miniaturisation, et cela se paie.
                            Pour une installation standard de 6kWc (environ 14-16 panneaux) :
                            *   La solution **Enphase** coûtera généralement **800€ à 1200€ de plus**.
                            *   La solution **SolarEdge** permet des économies d'échelle.

                            **Mais attention au coût caché !**
                            La garantie. Enphase garantit ses micro-onduleurs **25 ans** en standard.
                            SolarEdge garantit l'onduleur central seulement **12 ans** (extensible).
                        `} />
                    </div>

                    {/* Hybrid Stats Block */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-100 p-6 rounded-xl text-center">
                            <div className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Retour sur Investissement</div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">~ 5 à 7 ans</div>
                            <div className="text-xs text-slate-400">Pour une installation moyenne ({country === "BE" ? "Belgique" : "France"}) avec autoconsommation optimisée.</div>
                        </div>
                        <div className="bg-slate-100 p-6 rounded-xl text-center">
                            <div className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Durée de vie estimée</div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">25+ ans</div>
                            <div className="text-xs text-slate-400">Alignée sur la garantie de performance des panneaux modernes.</div>
                        </div>
                    </div>
                </section>

                {/* Verdict Section */}
                <section id="verdict" className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-10 rotate-12">
                        <Image
                            src="/images/comparateur/verdict-seal.webp"
                            alt="Verdict final et recommandation expert solaire"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 mb-8 relative z-10">
                        Le Verdict de l'Expert : Notre Choix
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-brand mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-brand" /> Choisissez Enphase si...
                            </h3>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex gap-2"><span className="text-brand font-bold">•</span> Vous visez la fiabilité absolue (Garantie 25 ans).</li>
                                <li className="flex gap-2"><span className="text-brand font-bold">•</span> Toit complexe ou ombragé.</li>
                                <li className="flex gap-2"><span className="text-brand font-bold">•</span> Évolutivité future importante.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-slate-800" /> Choisissez SolarEdge si...
                            </h3>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex gap-2"><span className="text-slate-800 font-bold">•</span> Meilleur rapport performance/prix initial.</li>
                                <li className="flex gap-2"><span className="text-slate-800 font-bold">•</span> Projet de batterie immédiat (SolarEdge Home).</li>
                                <li className="flex gap-2"><span className="text-slate-800 font-bold">•</span> Réseau électrique spécifique (Belgique 3x230V).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <p className="text-lg text-slate-600 mb-6">
                            Peu importe le champion, l'important est qu'il soit bien dimensionné.
                            <br /><strong>Faites le test maintenant pour voir la différence de rentabilité.</strong>
                        </p>
                        <Button size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-12 py-6 text-xl shadow-xl shadow-brand/20 w-full md:w-auto animate-pulse" asChild>
                            <Link href="/simulateur">Lancer les calculs (Gratuit)</Link>
                        </Button>
                        <p className="text-xs text-slate-400 mt-4">Simulation sans inscription obligatoire • Basé sur PVGIS Europe</p>
                    </div>
                </section>

                {/* Author/Footer Note */}
                <div className="mt-16 pt-8 border-t border-slate-200 text-slate-500 text-sm">
                    <p className="italic mb-4">Dernière mise à jour : Janvier 2026. Les technologies évoluent, mais la physique reste la même. Cet article est indépendant et non sponsorisé par Enphase ou SolarEdge.</p>
                    <div className="flex gap-4">
                        <a href="https://enphase.com/fr-fr/products-and-services/microinverters" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">Fiche Officielle Enphase IQ8 Series &rarr;</a>
                        <a href="https://www.solaredge.com/fr/products/residential/home-hub-inverter" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">Fiche Officielle SolarEdge Home Hub &rarr;</a>
                    </div>
                </div>
            </div >
        </div >
    );
}
