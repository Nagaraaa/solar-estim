import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Info, Sun, Zap, TrendingUp, ShieldCheck, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { FAQSection } from "@/components/FAQSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
    title: "Panneaux Solaires à Liège : Guide Complet, Prix et Primes Wallonnes",
    description: "Installation photovoltaïque à Liège (4000). Tarif Prosumer, Primes Région Wallonne et installateurs RESCert. Devis gratuit et simulation rentabilité.",
    alternates: {
        canonical: "https://www.solarestim.com/be/villes/liege",
    },
    openGraph: {
        title: "Solaire à Liège : Guide 2026 (Prix & Primes)",
        description: "Optimisez votre autonomie à Liège. Tout savoir sur le Tarif Prosumer et la rentabilité en Wallonie.",
        url: "https://www.solarestim.com/be/villes/liege",
        type: "article",
    },
};

export default function LiegePage() {
    const city = { name: "Liège", zip: "4000", zone: "Wallonie" };

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Installation Panneaux Solaires Liège",
                "provider": {
                    "@type": "Organization",
                    "name": "Solar Estim Belgique",
                    "url": "https://www.solarestim.com/be"
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Liège",
                    "postalCode": "4000",
                    "addressCountry": "BE"
                },
                "description": "Installation panneaux photovoltaïques à Liège. Installateurs agréés RESCert et conseils Tarif Prosumer.",
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
                title={<>Panneaux Solaires à <span className="text-brand">Liège</span> : Guide Complet, Prix et Primes Wallonnes</>}
                subtitle="Optimisez votre autonomie énergétique en Cité Ardente et profitez des avantages du tarif prosumer en 2026."
                ctaLink="/be/simulateur"
                backgroundImage="https://images.unsplash.com/photo-1565514020176-888876c2533c?auto=format&fit=crop&w=2000&q=80" // Liege-like or general BE visual
            />

            {/* 2. SPECIFIC LOCAL CONTENT */}
            <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="md:col-span-8 space-y-8">
                            <FadeIn delay={200}>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                    Liège : Une ville tournée vers l'énergie solaire
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed">
                                    <p>
                                        À <strong>Liège (4000)</strong>, malgré une météo parfois capricieuse, le potentiel solaire est bien réel. Les panneaux modernes captent la luminosité diffuse, garantissant une production stable toute l'année.
                                    </p>

                                    <div className="bg-amber-50 border-l-4 border-brand p-4 my-6">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                                            <Sun className="h-5 w-5 text-brand" /> Production Estimée à Liège
                                        </h3>
                                        <p className="text-slate-700">
                                            Une installation standard de <strong>3 kWc</strong> à Liège produit environ <strong>3 100 kWh/an</strong>.
                                            C'est suffisant pour couvrir une grande partie de la consommation d'un ménage wallon moyen et réduire drastiquement votre dépendance au réseau.
                                        </p>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <Euro className="h-5 w-5 text-brand" /> TVA 6% et Tarif Prosumer
                                    </h3>
                                    <p>
                                        Pour les habitations de plus de 10 ans à Liège, vous bénéficiez d'une <strong>TVA réduite à 6%</strong> sur le matériel et la main d'œuvre.
                                        De plus, bien que le <strong><Link href="/be/lexique/prosumer" className="text-brand underline font-medium hover:text-amber-600">Tarif Prosumer</Link></strong> soit d'application, il incite à l'<Link href="/be/lexique/autoconsommation" className="text-slate-800 hover:text-brand underline decoration-brand/30">autoconsommation</Link> directe, rendant les batteries domestiques de plus en plus pertinentes.
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-brand" /> Installateurs Agréés RESCert
                                    </h3>
                                    <p>
                                        Pour garantir la sécurité et la conformité de votre installation (notamment pour le changement vers un <Link href="/be/lexique/compteur-bidirectionnel" className="text-slate-800 hover:text-brand underline decoration-brand/30">compteur bidirectionnel</Link>), il est crucial de passer par un installateur certifié <strong>RESCert</strong>.
                                        Nos partenaires à Liège sont tous labellisés.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="md:col-span-4 space-y-6">
                            <FadeIn delay={300}>
                                <Card className="border-brand border-2 shadow-lg bg-slate-900 text-white sticky top-24">
                                    <CardContent className="p-6 pt-8 text-center space-y-6">
                                        <h3 className="text-2xl font-bold">Étude Solaire Liège</h3>
                                        <p className="text-slate-300">
                                            Calculez votre rentabilité avec le système wallon actuel.
                                        </p>
                                        <Link href="/be/simulateur" className="block w-full">
                                            <Button size="lg" variant="brand" className="w-full font-bold h-14 text-lg">
                                                Simulation Gratuite
                                            </Button>
                                        </Link>
                                        <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                                            <ShieldCheck className="h-4 w-4 text-green-500" />
                                            Partenaires RESCert Vérifiés
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES (BE Variant) */}
            <FeatureSection variant="BE" />

            {/* 4. FAQ */}
            <FAQSection city="Liège" country="BE" />

            {/* 5. CTA BOTTOM */}
            <CtaSection ctaLink="/be/simulateur" />
        </div>
    );
}
