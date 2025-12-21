import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Info, Sun, Zap, TrendingUp, ShieldCheck } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { FAQSection } from "@/components/FAQSection";
import { CITIES_FR } from "../cities";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection"; // Use FeatureSection
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
    title: "Installation Panneaux Solaires à Montpellier : Rentabilité & Aides 2026",
    description: "Installation photovoltaïque à Montpellier (34000). Profitez des 2 800h d'ensoleillement. Prime à l'autoconsommation, installateurs RGE et rentabilité maximale.",
    alternates: {
        canonical: "https://www.solarestim.com/villes/montpellier",
    },
    openGraph: {
        title: "Solaire à Montpellier : Rentabilité & Aides 2026",
        description: "Guide complet pour Montpellier : 2 800h de soleil/an ! Simulez vos économies et trouvez un installateur RGE.",
        url: "https://www.solarestim.com/villes/montpellier",
        type: "article",
    },
};

export default function MontpellierPage() {
    const city = { name: "Montpellier", zip: "34000", zone: "Sud" };

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Installation Panneaux Solaires Montpellier",
                "provider": {
                    "@type": "Organization",
                    "name": "Solar Estim France",
                    "url": "https://www.solarestim.com"
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Montpellier",
                    "postalCode": "34000",
                    "addressCountry": "FR"
                },
                "description": "Installation de panneaux solaires à Montpellier. Rentabilité exceptionnelle grâce à 2800h d'ensoleillement.",
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* 1. HERO SECTION */}
            <HeroSection
                title={<>Installation Panneaux Solaires à <span className="text-brand">Montpellier</span> : Rentabilité & Aides 2026</>}
                subtitle="Profitez des 2 800 heures d'ensoleillement annuel de l'Hérault pour réduire votre facture d'électricité jusqu'à 70%."
                ctaLink="/simulateur"
                backgroundImage="https://images.unsplash.com/photo-1508514177221-188b1cf2f24f?auto=format&fit=crop&w=2000&q=80"
            />

            {/* 2. SPECIFIC LOCAL CONTENT */}
            <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="md:col-span-8 space-y-8">
                            <FadeIn delay={200}>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                    Une rentabilité solaire exceptionnelle à Montpellier (34000)
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed">
                                    <p>
                                        Avec plus de <strong>2 800 heures d'ensoleillement par an</strong>, Montpellier et l'Hérault se classent parmi les zones les plus rentables de France pour le photovoltaïque.
                                    </p>

                                    <div className="bg-amber-50 border-l-4 border-brand p-4 my-6">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                                            <Sun className="h-5 w-5 text-brand" /> Données Clés Montpellier
                                        </h3>
                                        <p className="text-slate-700">
                                            Une installation standard de <strong>3 <Link href="/lexique/kwc" className="text-brand underline font-medium hover:text-amber-600">kWc</Link></strong> à Montpellier produit environ <strong>4 150 kWh/an</strong>.
                                            Cela représente une économie potentielle bien supérieure à la moyenne nationale.
                                        </p>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-brand" /> Un <Link href="/lexique/roi" className="text-slate-800 hover:text-brand underline decoration-brand/30">ROI</Link> accéléré
                                    </h3>
                                    <p>
                                        Grâce à cette production élevée, le <strong>retour sur investissement (ROI)</strong> est souvent atteint en moins de 6-7 ans à Montpellier, contre 10-12 ans dans le nord de la France.
                                        L'électricité que vous ne consommez pas est revendue à EDF Obligation d'Achat, garantissant un revenu fixe.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-brand" /> L'importance de l'<Link href="/lexique/onduleur" className="text-slate-800 hover:text-brand underline decoration-brand/30">Onduleur</Link>
                                    </h3>
                                    <p>
                                        Sous le soleil intense de Montpellier, le choix de l'<strong>onduleur</strong> (central ou micro-onduleurs) est crucial pour gérer les pics de production et maximiser la durée de vie de votre installation.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-4 space-y-6">
                            <FadeIn delay={300}>
                                <Card className="border-brand border-2 shadow-lg bg-slate-900 text-white sticky top-24">
                                    <CardContent className="p-6 pt-8 text-center space-y-6">
                                        <h3 className="text-2xl font-bold">Étude Solaire Montpellier</h3>
                                        <p className="text-slate-300">
                                            Vérifiez votre éligibilité aux primes locales de l'Hérault.
                                        </p>
                                        <Link href="/simulateur" className="block w-full">
                                            <Button size="lg" variant="brand" className="w-full font-bold h-14 text-lg">
                                                Lancer la simulation
                                            </Button>
                                        </Link>
                                        <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                                            <ShieldCheck className="h-4 w-4 text-green-500" />
                                            Site sécurisé par Cloudflare
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES (RGE Badge handled by variant="FR") */}
            <FeatureSection variant="FR" />

            {/* 4. FAQ */}
            <FAQSection city="Montpellier" country="FR" />

            {/* 5. CTA BOTTOM */}
            <CtaSection ctaLink="/simulateur" />

            {/* Cross Linking */}
            <section className="py-12 bg-white border-t border-slate-200">
                <div className="container px-4 md:px-6 mx-auto">
                    <h3 className="text-center text-lg font-semibold text-slate-900 mb-8">
                        Autres villes populaires en Occitanie & France
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {CITIES_FR.filter(c => c.slug !== "montpellier").map((c) => (
                            <Link
                                key={c.slug}
                                href={`/villes/${c.slug}`}
                                className="text-sm px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-brand hover:text-slate-900 transition-colors"
                            >
                                Panneaux solaires {c.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
