import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Blog & Actualités Solaires | Solar-Estim",
    description: "Guides, comparatifs et actualités sur l'énergie solaire thermique et photovoltaïque.",
};

export default async function BlogIndex() {
    const posts = await getAllPosts();

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Le Blog Solaire</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Décrypter le marché de l'énergie pour vous aider à faire les bons choix.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200">
                            <div className="h-56 bg-slate-100 rounded-t-lg bg-[url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
                            <CardHeader>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-brand uppercase tracking-wider">{post.category}</span>
                                    <span className="text-xs text-slate-400">{post.date}</span>
                                </div>
                                <CardTitle className="text-2xl group-hover:text-brand transition-colors line-clamp-2">
                                    {post.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base line-clamp-3">
                                    {post.summary}
                                </CardDescription>
                                <div className="mt-6 flex items-center text-brand font-bold text-sm">
                                    Lire l'article &rarr;
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
