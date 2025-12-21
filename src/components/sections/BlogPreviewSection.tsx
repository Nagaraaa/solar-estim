import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { getAllPosts } from "@/lib/blog";

interface BlogPreviewSectionProps {
    country: 'FR' | 'BE';
}

export async function BlogPreviewSection({ country }: BlogPreviewSectionProps) {
    // Fetch real posts from filesystem, filtered by country
    const posts = await getAllPosts(country);
    // Take the 3 most recent posts
    const recentPosts = posts.slice(0, 3);

    const blogBaseUrl = country === 'BE' ? '/be/blog' : '/blog';

    return (
        <section className="py-20 bg-slate-50">
            <FadeIn className="container px-4 md:px-6 mx-auto" delay={300}>
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Derniers articles</h2>
                    <Link href={blogBaseUrl} className="text-brand font-bold hover:underline">
                        Voir tout le blog
                    </Link>
                </div>

                {recentPosts.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {recentPosts.map((post, i) => (
                            <Link key={i} href={`${blogBaseUrl}/${post.slug}`} className="group">
                                <Card className="h-full hover:shadow-lg hover:scale-105 transition-all duration-300 border-slate-200">
                                    <div
                                        className="h-48 bg-slate-200 w-full object-cover rounded-t-lg bg-cover bg-center"
                                        style={{ backgroundImage: `url(${post.image})` }}
                                    />
                                    <CardContent className="p-6">
                                        <div className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">
                                            {post.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 italic">Aucun article disponible pour le moment.</p>
                )}
            </FadeIn>
        </section>
    );
}
