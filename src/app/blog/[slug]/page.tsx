import { getPost, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BlogCTA } from "@/components/BlogCTA";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: "Article non trouvé" };

    return {
        title: `${post.title} | Solar-Estim`,
        description: post.summary,
        openGraph: {
            images: [post.image],
        },
    };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <ArticleSchema
                title={post.title}
                description={post.summary}
                images={[post.image]}
                datePublished={post.date}
                authorName={post.author || "Steve H"}
                url={`https://www.solarestim.com/blog/${post.slug}`}
            />

            <Breadcrumbs
                items={[
                    { label: "Blog", href: "/blog" },
                    { label: post.title, href: `/blog/${post.slug}` }
                ]}
            />

            <div className="grid lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <article className="lg:col-span-2 prose prose-slate prose-lg max-w-none">
                    <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{post.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-10 pb-10 border-b border-slate-100">
                        <span className="bg-brand/10 text-brand-foreground px-3 py-1 rounded-full font-bold">{post.category}</span>
                        <span className="capitalize">Publié le {new Date(post.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                        {post.author && (
                            <span className="flex items-center gap-2">
                                <span className="hidden md:inline">•</span>
                                <span>Par <span className="font-semibold text-slate-900">{post.author}</span></span>
                            </span>
                        )}
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand hover:prose-a:text-yellow-500">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>


                </article>

                {/* Sidebar with CTA */}
                <aside className="lg:col-span-1 space-y-8">
                    <BlogCTA />
                </aside>
            </div>
        </div>
    );
}
