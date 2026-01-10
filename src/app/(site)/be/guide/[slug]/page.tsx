import { getGuidePost, getAllGuidePosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    // Magic switch: If we are on the main guide, load the BE specific content
    const effectiveSlug = slug === 'comprendre-le-solaire' ? 'comprendre-le-solaire-be' : slug;

    const post = await getGuidePost(effectiveSlug);
    if (!post) return { title: "Guide non trouvé" };
    return {
        title: `${post.title} | Solar-Estim Belgique`,
        description: post.summary || post.description
    };
}

export async function generateStaticParams() {
    const posts = await getAllGuidePosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function GuidePageBe({ params }: PageProps) {
    const { slug } = await params;
    // Magic switch: If we are on the main guide, load the BE specific content
    const effectiveSlug = slug === 'comprendre-le-solaire' ? 'comprendre-le-solaire-be' : slug;

    const post = await getGuidePost(effectiveSlug);

    if (!post) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* BE Custom Hero */}
            <HeroSection
                title={<>{post.title}</>}
                subtitle={post.description || "Guide complet pour la Belgique."}
                ctaLink="/be/simulateur"
            />

            <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl relative z-20 -mt-20 bg-white rounded-t-3xl shadow-xl">
                <Link href="/be" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
                </Link>

                <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand hover:prose-a:text-yellow-500 prose-img:rounded-xl prose-img:shadow-lg prose-table:border-collapse prose-th:bg-slate-100 prose-th:p-4 prose-td:p-4 prose-td:border-b">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => {
                                const href = props.href || "";
                                // Rewrite /lexique to /be/lexique and /simulateur to /be/simulateur
                                let newHref = href;
                                if (href.startsWith("/lexique")) {
                                    newHref = `/be${href}`;
                                } else if (href === "/simulateur") {
                                    newHref = "/be/simulateur";
                                }
                                return <Link href={newHref} {...props} />;
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </article>
            </div>

            <FeatureSection variant="BE" />

            <BlogPreviewSection country="BE" />

            <CtaSection ctaLink="/be/simulateur" />
        </div>
    );
}
