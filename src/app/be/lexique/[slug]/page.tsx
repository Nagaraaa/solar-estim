import { getDefinition, getAllDefinitions } from "@/lib/lexicon";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Cpu, Info } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const term = await getDefinition(slug, 'BE');
    if (!term) return { title: "Terme non trouvé" };
    return {
        title: `C'est quoi ${term.term} ? Définition Simple (Belgique)`,
        description: term.shortDefinition,
        alternates: {
            canonical: `https://www.solarestim.com/be/lexique/${slug}`,
        },
    };
}

export async function generateStaticParams() {
    const terms = await getAllDefinitions('BE');
    return terms.map((term) => ({
        slug: term.slug,
    }));
}

export default async function LexiconPageBe({ params }: PageProps) {
    const { slug } = await params;
    const term = await getDefinition(slug, 'BE');

    if (!term) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <Link href="/be/lexique" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour au lexique
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 md:p-12 text-white">
                    <div className="flex items-center gap-3 text-brand mb-4">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-bold uppercase tracking-wider text-sm">Définition (Belgique)</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
                        C'est quoi {term.term} ?
                    </h1>
                    <p className="text-xl text-slate-300">
                        {term.shortDefinition}
                    </p>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    {/* EN BREF */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <span className="bg-yellow-100 p-2 rounded-lg text-yellow-700"><Info className="h-6 w-6" /></span>
                            L'essentiel en bref
                        </h2>
                        <p className="text-lg text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border-l-4 border-brand">
                            {term.audience10yo}
                        </p>
                    </section>

                    {/* DETAILS TECHNIQUES */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 p-2 rounded-lg text-blue-700"><Cpu className="h-6 w-6" /></span>
                            Détails Techniques
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {term.technicalDetails}
                        </p>
                    </section>

                    {/* IMPORTANCE */}
                    <section className="bg-slate-900 text-white p-8 rounded-xl">
                        <h2 className="text-2xl font-bold mb-4">
                            Pourquoi c'est important pour votre rentabilité ?
                        </h2>
                        <p className="text-lg text-slate-300 mb-8">
                            {term.importance}
                        </p>

                        <div className="pt-6 border-t border-white/10">
                            <p className="font-bold text-brand mb-4">
                                Maintenant que vous maîtrisiez ce concept, calculez son impact sur votre facture :
                            </p>
                            <Link href="/be/simulateur">
                                <Button size="lg" variant="brand" className="w-full md:w-auto font-bold text-lg">
                                    Lancer une simulation gratuite &rarr;
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
