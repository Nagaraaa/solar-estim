import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
    ctaLink: string;
}

export function CtaSection({ ctaLink }: CtaSectionProps) {
    return (
        <section className="py-20 bg-brand text-slate-900">
            <div className="container px-4 md:px-6 mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Prêt à passer au vert ?</h2>
                <p className="text-xl font-medium opacity-90 mb-8 max-w-2xl mx-auto">
                    Découvrez combien vous pouvez économiser dès aujourd'hui. C'est gratuit et sans engagement.
                </p>
                <Link href={ctaLink}>
                    <Button size="lg" className="w-full sm:w-auto h-auto sm:h-14 py-4 sm:py-0 bg-slate-900 text-white hover:bg-slate-800 text-lg px-6 sm:px-10 shadow-2xl whitespace-normal break-words leading-tight">
                        Calculer ma rentabilité maintenant
                    </Button>
                </Link>
            </div>
        </section>
    );
}
