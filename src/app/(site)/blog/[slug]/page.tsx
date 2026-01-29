import { getPost, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BlogCTA } from "@/components/BlogCTA";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AutoLink } from "@/components/content/AutoLink";
import { ComparatorSection } from "@/components/sections/ComparatorSection";
import remarkGfm from "remark-gfm";

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
                    <div className="relative w-full aspect-[21/9] mb-8 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Header Block */}
                    <div className="mb-10 pb-8 border-b border-slate-100">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-100">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                            <span className="capitalize flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(post.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                            </span>
                            {post.author && (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span>Par <span className="font-bold text-slate-900 underline decoration-amber-400/50 underline-offset-4">{post.author}</span></span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Parse content to handle custom components like ComparatorSection directly from JSON string if needed, 
                                        but since we use ReactMarkdown, we need to handle it inside properties or pre-processing.
                                        However, AutoLink is a Server Component and cannot be passed easily as a prop to ReactMarkdown if it's not a client component.
                                        Actually, AutoLink is async. We can't use it in ReactMarkdown components prop directly.
                                        We must pre-process the text OR use a different approach.
                                        
                                        Better approach: 
                                        1. Split content by the component placeholder.
                                        2. Render parts separately.
                                    */}
                    <div className="space-y-6">
                        {post.content.split(/<Component name="ComparatorSection" \/>/g).map((part, index, array) => (
                            <React.Fragment key={index}>
                                <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand hover:prose-a:text-yellow-500">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ node, children }) => {
                                                return (
                                                    <p className="mb-4">
                                                        {React.Children.map(children, (child) => {
                                                            if (typeof child === 'string') {
                                                                return <AutoLink text={child} country="FR" />;
                                                            }
                                                            return child;
                                                        })}
                                                    </p>
                                                );
                                            },
                                            img: (props) => (
                                                <span className="block my-8 relative group">
                                                    {(props.src as string) && (
                                                        <Image
                                                            src={props.src as string}
                                                            alt={props.alt || "Illustration"}
                                                            width={0}
                                                            height={0}
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                                                            className="rounded-xl shadow-lg border border-slate-200 w-full h-auto object-cover transform transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
                                                        />
                                                    )}
                                                </span>
                                            ),
                                        }}
                                    >
                                        {part}
                                    </ReactMarkdown>
                                </div>
                                {index < array.length - 1 && (
                                    <div className="my-12">
                                        <ComparatorSection />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
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
