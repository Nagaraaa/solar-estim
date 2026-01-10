import { getDefinition, getAllDefinitions } from "@/lib/lexicon";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Cpu, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const term = await getDefinition(slug, 'FR');
    if (!term) return { title: "Terme non trouvé" };
    return {
        title: `C'est quoi ${term.term} ? Définition Simple`,
        description: term.shortDefinition
    };
}

export async function generateStaticParams() {
    const terms = await getAllDefinitions('FR');
    return terms.map((term) => ({
        slug: term.slug,
    }));
}

export default async function LexiconPage({ params }: PageProps) {
    const { slug } = await params;
    const term = await getDefinition(slug, 'FR');

    if (!term) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term.term,
        "description": term.shortDefinition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "Lexique Solaire SolarEstim"
        },
        "url": `https://www.solarestim.com/lexique/${slug}`
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Link href="/lexique" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour au lexique
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
                    {term.image && (
                        <div className="absolute inset-0 opacity-20">
                            <Image
                                src={term.image}
                                alt={term.term}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/50" />
                        </div>
                    )}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-brand mb-4">
                            <BookOpen className="h-6 w-6" />
                            <span className="font-bold uppercase tracking-wider text-sm">Définition</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
                            C'est quoi {term.term} ?
                        </h1>
                        <p className="text-xl text-slate-300">
                            {term.shortDefinition}
                        </p>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-12">

                    {/* EN BREF */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <span className="bg-yellow-100 p-2 rounded-lg text-yellow-700"><Info className="h-6 w-6" /></span>
                            L'essentiel en bref
                        </h2>
                        <div className="text-lg text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border-l-4 border-brand prose prose-slate max-w-none prose-p:my-0 font-medium">
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => (
                                        <Link href={props.href || ""} className="text-brand hover:text-yellow-600 transition-colors underline decoration-brand/30 hover:decoration-brand/100" {...props} />
                                    )
                                }}
                            >
                                {term.audience10yo}
                            </ReactMarkdown>
                        </div>
                    </section>

                    {/* DETAILS TECHNIQUES */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 p-2 rounded-lg text-blue-700"><Cpu className="h-6 w-6" /></span>
                            Détails Techniques
                        </h2>
                        <div className="text-lg text-slate-600 leading-relaxed prose prose-slate max-w-none">
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => (
                                        <Link href={props.href || ""} className="text-brand hover:text-blue-600 transition-colors underline decoration-brand/30 hover:decoration-brand/100" {...props} />
                                    )
                                }}
                            >
                                {term.technicalDetails}
                            </ReactMarkdown>
                        </div>
                    </section>

                    {/* IMPORTANCE */}
                    <section className="bg-slate-900 text-white p-8 rounded-xl">
                        <h2 className="text-2xl font-bold mb-4">
                            Pourquoi c'est important pour votre rentabilité ?
                        </h2>
                        <div className="text-lg text-slate-300 mb-8 prose prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => (
                                        <Link href={props.href || ""} className="text-brand hover:text-white transition-colors underline decoration-brand/30 hover:decoration-brand/100" {...props} />
                                    )
                                }}
                            >
                                {term.importance}
                            </ReactMarkdown>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="font-bold text-brand mb-4">
                                Maintenant que vous maîtrisez ce concept, calculez son impact sur votre facture :
                            </p>
                            <Link href="/simulateur">
                                <Button size="lg" variant="brand" className="w-full md:w-auto font-bold text-lg">
                                    Lancer une simulation gratuite &rarr;
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 mt-8 border-t border-slate-100 flex justify-center print:hidden">
                            <Link href="/guide/comprendre-le-solaire" className="text-slate-500 hover:text-brand font-medium flex items-center gap-2 transition-colors">
                                &larr; Revenir au Guide Complet
                            </Link>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
