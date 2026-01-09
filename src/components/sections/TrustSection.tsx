import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const TESTIMONIALS = [
    {
        name: "Marc D.",
        location: "Montpellier",
        text: "Simulateur ultra précis, j'ai signé mon devis 2 jours après.",
        image: "/images/avatars/homme-sud.png",
        alt: "Portrait of a friendly middle-aged man, smiling, house with solar panels on terracotta roof in background, sunny day Provence France. Realistic skin, natural light."
    },
    {
        name: "Sophie L.",
        location: "Liège",
        text: "Enfin un site qui explique clairement les primes et le tarif prosumer.",
        image: "/images/avatars/couple-nord.png",
        alt: "Happy retired couple looking at a tablet with energy graphs, standing in front of a Belgian brick house with slate roof and solar panels. Overcast bright light."
    },
    {
        name: "Nora B.",
        location: "Lyon",
        text: "Les comparatifs m'ont aidé à choisir entre Tesla et Enphase. Top.",
        image: "/images/avatars/femme-urbaine.png",
        alt: "Young professional woman holding smartphone showing solar app, modern apartment balcony background with blurred urban solar panels. Sharp focus, confident smile."
    },
];

export function TrustSection() {
    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container px-4 mx-auto">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                            La communauté <span className="text-brand">SolarEstim</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Rejoignez les milliers de particuliers qui ont réussi leur transition énergétique grâce à nos outils.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, index) => (
                        <FadeIn key={t.name} delay={index * 100}>
                            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Quote className="h-16 w-16 text-brand" />
                                </div>
                                <CardContent className="p-8 flex flex-col items-center text-center">
                                    <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border-4 border-brand/10 shadow-sm">
                                        <Image
                                            src={t.image}
                                            alt={t.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex gap-1 text-amber-500 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 italic mb-6 leading-relaxed relative z-10">
                                        "{t.text}"
                                    </p>
                                    <div className="mt-auto">
                                        <div className="font-bold text-slate-900">{t.name}</div>
                                        <div className="text-sm text-slate-500 font-medium">{t.location}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
