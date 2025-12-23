import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { StructuredData } from "@/components/StructuredData";

interface HeroSectionProps {
    title: React.ReactNode;
    subtitle: string;
    ctaLink: string;
    backgroundImage?: string;
}

export function HeroSection({ title, subtitle, ctaLink, backgroundImage }: HeroSectionProps) {
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
            <Image
                src={backgroundImage || "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=80"}
                alt="Panneaux solaires sur toit"
                fill
                priority
                className="object-cover object-center opacity-20"
                sizes="100vw"
            />
            <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                    {title}
                </h1>
                <StructuredData />
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                    {subtitle}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href={ctaLink}>
                        <Button size="lg" variant="brand" className="w-full sm:w-auto text-lg font-bold px-8 h-12 hover:scale-105 transition-transform">
                            Lancer le simulateur <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
