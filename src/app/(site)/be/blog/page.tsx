import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata = {
    title: "Blog & Actualités Solaires | Solar-Estim",
    description: "Guides, comparatifs et actualités sur l'énergie solaire thermique et photovoltaïque.",
};

interface BlogIndexProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
    const posts = await getAllPosts('BE');
    const { category } = await searchParams;
    const currentCategory = Array.isArray(category) ? category[0] : category;

    const filteredPosts = currentCategory
        ? posts.filter(p => p.category === currentCategory)
        : posts;

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <BlogHeader />

            <CategoryFilter baseUrl="/be/blog" />

            {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-slate-500">Aucun article trouvé dans cette catégorie.</p>
                    <Link href="/be/blog" className="text-brand font-bold mt-4 inline-block hover:underline">
                        Voir tout les articles
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredPosts.slice(0, 3).map((post) => (
                            <BlogCard key={post.slug} post={post} href={`/be/blog/${post.slug}`} />
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.slice(3).map((post) => (
                            <BlogCard key={post.slug} post={post} href={`/be/blog/${post.slug}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
