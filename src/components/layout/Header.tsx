import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Sun className="h-6 w-6 text-brand fill-brand" />
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Solar-Estim</span>
                </Link>

                <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600">
                    <Link href="/simulateur" className="hover:text-primary transition-colors">Simulateur</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog & Guides</Link>
                    <Link href="/mentions-legales" className="hover:text-primary transition-colors">A propos</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/simulateur">
                        <Button variant="brand" className="font-bold shadow-brand/20 shadow-lg">
                            Calculer ma rentabilité
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
