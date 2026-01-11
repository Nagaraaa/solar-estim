import { getDefinition, getAllDefinitions } from "@/lib/lexicon";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Cpu, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term.term,
        "description": term.shortDefinition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "Lexique Solaire Belgique SolarEstim"
        },
        "url": `https://www.solarestim.com/be/lexique/${slug}`
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                        <div className="text-lg text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border-l-4 border-brand prose prose-slate max-w-none prose-p:my-0 prose-a:text-brand font-medium">
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => {
                                        const href = props.href || "";
                                        let newHref = href;
                                        if (href.startsWith("/lexique")) newHref = `/be${href}`;
                                        else if (href === "/simulateur") newHref = "/be/simulateur";
                                        return <Link href={newHref} className="text-brand hover:text-yellow-600 transition-colors underline decoration-brand/30 hover:decoration-brand/100" {...props} />;
                                    }
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
                                    a: ({ node, ...props }) => {
                                        const href = props.href || "";
                                        let newHref = href;
                                        if (href.startsWith("/lexique")) newHref = `/be${href}`;
                                        else if (href === "/simulateur") newHref = "/be/simulateur";
                                        return <Link href={newHref} className="text-brand hover:text-blue-600 transition-colors underline decoration-brand/30 hover:decoration-brand/100" {...props} />;
                                    }
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
                                    a: ({ node, ...props }) => {
                                        const href = props.href || "";
                                        let newHref = href;
                                        if (href.startsWith("/lexique")) newHref = `/be${href}`;
                                        else if (href === "/simulateur") newHref = "/be/simulateur";
                                        return <Link href={newHref} className="text-brand hover:text-white transition-colors underline decoration-brand/30 hover:decoration-brand/100" {...props} />;
                                    }
                                }}
                            >
                                {term.importance}
                            </ReactMarkdown>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="font-bold text-brand mb-4">
                                Maintenant que vous maîtrisiez ce concept, calculez son impact sur votre facture :
                            </p>
                            <Link href="/be/simulateur">
                                <Button size="lg" variant="brand" className="w-full md:w-auto font-bold text-lg">
                                    Simuler ma rentabilité &rarr;
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 mt-8 border-t border-slate-100 flex justify-center print:hidden">
                            <Link href="/be/guide/comprendre-le-solaire" className="text-slate-500 hover:text-brand font-medium flex items-center gap-2 transition-colors">
                                &larr; Revenir au Guide Complet
                            </Link>
                        </div>
                    </section>
                </div>
            </article >
        </div >
    );
}
