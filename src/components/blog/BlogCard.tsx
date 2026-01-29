import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: BlogPost;
    href: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    "VE": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Solaire": "bg-blue-100 text-blue-700 border-blue-200",
    "Batterie": "bg-amber-100 text-amber-700 border-amber-200",
    "Autre": "bg-slate-100 text-slate-700 border-slate-200",
};

export function BlogCard({ post, href }: BlogCardProps) {
    const badgeColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS["Autre"];

    return (
        <Link href={href} className="group h-full block">
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                        <span className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm", badgeColor)}>
                            {post.category}
                        </span>
                    </div>
                </div>
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400 capitalize flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(post.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-brand transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <CardDescription className="text-base line-clamp-3 mb-6">
                        {post.summary}
                    </CardDescription>
                    <div className="flex items-center text-brand font-bold text-sm">
                        Lire l'article <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
