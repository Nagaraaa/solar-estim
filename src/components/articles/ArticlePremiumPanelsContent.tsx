import Image from "next/image";
import Link from "next/link";
import { AutoLink } from "@/components/content/AutoLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, ShieldCheck, Banknote, BrainCircuit, Leaf } from "lucide-react";

export default function ArticlePremiumPanelsContent({ country = "FR" }: { country?: "FR" | "BE" }) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="/images/comparateur/premium-hero.webp"
                        alt="Comparatif panneaux solaires haut de gamme SunPower, DualSun et Meyer Burger pour maison individuelle"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 text-brand-light border border-brand/30 mb-6 text-sm font-medium">
                        <BrainCircuit className="w-4 h-4" /> Analyse Exclusive 2026 {country === "BE" ? "Belgique" : ""}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        SunPower, DualSun ou Meyer Burger : <br />
                        <span className="text-brand-light">Quel panneau haut de gamme</span> choisir ?
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 font-light">
                        Ne comparez pas juste les watts. Garantie 40 ans, Éthique Européenne ou Technologie HJT ? Voici le guide ultime pour les toits exigeants.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-8 text-lg shadow-lg shadow-brand/25" asChild>
                            <Link href="#verdict">Voir le verdict directement</Link>
                        </Button>
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 text-lg font-semibold" asChild>
                            <Link href="/simulateur">Simuler mon projet Premium</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">

                {/* Intro */}
                <div className="prose prose-lg prose-slate mx-auto mb-16 first-letter:text-5xl first-letter:font-bold first-letter:text-brand first-letter:mr-1">
                    <AutoLink country={country} text={`
                        Si vous lisez ceci, c'est que vous ne cherchez pas le "panneau pas cher". Vous cherchez le meilleur. Vous voulez une installation qui sera encore performante quand vos enfants seront propriétaires.
                        
                        Sur le marché du "Premium", trois noms reviennent sans cesse :
                        *   **SunPower (Maxeon)** : Le pionnier américain, la légende de la durabilité.
                        *   **DualSun** : L'innovateur français qui monte, champion du bas carbone.
                        *   **Meyer Burger** : Le suisse technologique qui redéfinit la performance avec l'HJT.

                        Mais au-delà des fiches techniques illisibles, qu'est-ce qui les différencie vraiment ? Le Bilan Carbone ? La Garantie ? La réaction à la chaleur ?
                        En tant qu'expert, j'ai analysé pour vous ce que ces marques ont vraiment dans le ventre.
                    `} />
                </div>

                {/* Section 1: Technology & DNA */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-brand" />
                        1. L'ADN Technologique : Trois Philosophies
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* SunPower */}
                        <Card className="border-t-4 border-t-amber-500 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-amber-600">SunPower</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-sm prose-slate">
                                <AutoLink country={country} text={`
                                    **La Légende.**
                                    Technologie **Maxeon** (IBC) : Pas de lignes métalliques en façade. C'est le panneau le plus solide du monde (cuivre derrière les cellules).
                                    *   Indestructible (ou presque).
                                    *   Gagnant sur 40 ans.
                                `} />
                            </CardContent>
                        </Card>

                        {/* DualSun */}
                        <Card className="border-t-4 border-t-blue-500 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-blue-600">DualSun</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-sm prose-slate">
                                <AutoLink country={country} text={`
                                    **Le Pragmatique Français.**
                                    Technologie **TOPCon** ou PERC haut de gamme.
                                    *   Excellent Bilan Carbone.
                                    *   Conçu par des ingénieurs marseillais.
                                    *   Le meilleur rapport Qualité/Éthique/Prix pour la France.
                                `} />
                            </CardContent>
                        </Card>

                        {/* Meyer Burger */}
                        <Card className="border-t-4 border-t-red-500 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-red-600">Meyer Burger</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-sm prose-slate">
                                <AutoLink country={country} text={`
                                    **Le Génie Suisse.**
                                    Technologie **HJT** (Hétérojonction).
                                    *   Performance extrême quand il fait chaud.
                                    *   Made in Europe (Allemagne/USA).
                                    *   Esthétique Full Black parfaite.
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
                            Si votre priorité est l'écologie locale, <strong>DualSun</strong> est imbattable.
                            Leur <strong>Bilan Carbone</strong> exemplaire (panneaux bas carbone certifiés) est souvent exigé pour certains appels d'offres, mais c'est surtout la garantie d'un produit "Made in France" (conception) qui séduit les propriétaires engagés.
                        </p>
                    </div>

                    {/* Focus Belgique */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🇧🇪</span>
                            <h3 className="font-bold text-red-900 text-lg">Focus Belgique</h3>
                        </div>
                        <p className="text-red-800 text-sm mb-4">
                            La météo belge est capricieuse (nuages, lumière diffuse).
                            La technologie <strong>HJT</strong> de Meyer Burger est celle qui capte le mieux ce spectre lumineux diffus. Résultat : une production supérieure en hiver et par temps gris par rapport à un panneau standard.
                        </p>
                    </div>
                </div>

                {/* Section 2: La Garantie (Le nerf de la guerre) */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-brand" />
                        2. Garanties : Qui vous couvre vraiment ?
                    </h2>

                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl mb-8 group">
                        <Image
                            src="/images/comparateur/premium-warranty.webp"
                            alt="Garantie Premium panneau solaire 40 ans"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 backdrop-blur-sm">
                            <p className="font-medium text-center">La tranquillité d'esprit a un nom : Garantie Sérénité.</p>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate">
                        <AutoLink country={country} text={`
                            C'est là que le fossé se creuse avec les panneaux standards garantis 15 ans.

                            *   **SunPower Maxeon 6 :** La référence absolue. **40 Ans** de garantie produit et performance. C'est simple, ils garantissent que votre panneau sera encore là quand vous serez peut-être parti.
                            *   **DualSun FLASH :** Selon les modèles, 20, 25 ou 30 ans. Mais leur force est le service client français ultra-réactif.
                            *   **Meyer Burger :** Garantie 25 ou 30 ans selon modèles, avec une **Dégradation Annuelle** ridicule (0.25%). Au bout de 25 ans, le panneau produit encore 92% de sa puissance initiale !
                        `} />
                    </div>
                </section>

                {/* Section 3: Esthétique et Environnement */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Leaf className="w-8 h-8 text-brand" />
                        3. Esthétique et Bilan Carbone
                    </h2>

                    <div className="prose prose-lg prose-slate text-justify">
                        <AutoLink country={country} text={`
                            Vous avez une belle maison, vous ne voulez pas la défigurer.
                            
                            **Le look "Full Black" :**
                            Meyer Burger et DualSun excellent ici. Leurs panneaux sont d'un noir profond, homogène, presque invisible sur une tuile ardoise. SunPower est très beau aussi, mais parfois avec un cadre un peu plus visible selon les séries.

                            **L'Écologie (Vraiment) :**
                            Acheter du solaire pour sauver la planète en achetant du 100% charbon chinois, c'est paradoxal.
                            *   **DualSun** fait un effort énorme sur le sourcing bas carbone.
                            *   **Meyer Burger** produit en Europe (Allemagne) et USA, garantissant des normes sociales et environnementales strictes, loin du dumping chinois.
                        `} />
                    </div>
                </section>

                {/* Verdict Section */}
                <section id="verdict" className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-10 rotate-12">
                        <Image
                            src="/images/comparateur/premium-verdict.webp"
                            alt="Classement meilleur panneau solaire 2026"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 mb-8 relative z-10">
                        Notre Classement : Quel est votre champion ?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {/* Choix 1 */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="text-brand font-bold text-xl mb-2">🏆 Le Choix "Performance Pure"</div>
                            <div className="text-2xl font-extrabold text-slate-900 mb-4">Meyer Burger</div>
                            <p className="text-sm text-slate-600">
                                Pour les technophiles qui veulent le rendement maximum (HJT) et le look Full Black parfait.
                            </p>
                        </div>
                        {/* Choix 2 */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="text-amber-600 font-bold text-xl mb-2">💎 Le Choix "Tranquillité 40 ans"</div>
                            <div className="text-2xl font-extrabold text-slate-900 mb-4">SunPower</div>
                            <p className="text-sm text-slate-600">
                                Pour ceux qui voient (très) long terme et veulent la marque la plus solide du monde.
                            </p>
                        </div>
                        {/* Choix 3 */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="text-blue-600 font-bold text-xl mb-2">🇫🇷 Le Choix "Rationalité & Écologie"</div>
                            <div className="text-2xl font-extrabold text-slate-900 mb-4">DualSun</div>
                            <p className="text-sm text-slate-600">
                                Le meilleur équilibre Prix/Perf/Carbone. Idéal pour être cohérent écologiquement.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <p className="text-lg text-slate-600 mb-6">
                            Le prix de ces panneaux varie fortement selon votre toiture.
                            <br /><strong>Comparez les devis Premium gratuitement.</strong>
                        </p>
                        <Button size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-12 py-6 text-xl shadow-xl shadow-brand/20 w-full md:w-auto animate-pulse" asChild>
                            <Link href="/simulateur">Demander mon étude Premium</Link>
                        </Button>
                    </div>
                </section>

                <div className="mt-16 pt-8 border-t border-slate-200 text-slate-500 text-sm">
                    <p className="italic mb-4">Comparatif indépendant mis à jour en 2026. Les performances mentionnées sont celles des fiches techniques constructeurs officielles.</p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <a href="https://sunpower.maxeon.com/fr/" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">Maxeon (SunPower) Official &rarr;</a>
                        <a href="https://dualsun.com/fr/produits/flash/" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">DualSun FLASH &rarr;</a>
                        <a href="https://www.meyerburger.com/fr/produits" target="_blank" rel="nofollow noreferrer" className="text-brand hover:underline">Meyer Burger HJT &rarr;</a>
                    </div>
                </div>
            </div >
        </div >
    );
}
