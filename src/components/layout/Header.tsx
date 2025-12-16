import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";


export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-auto py-2 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/images/logo2.png"
                        alt="Logo Solar Estim"
                        width={250}
                        height={70}
                        className="h-14 w-auto object-contain"
                        priority
                    />
                </Link>

                <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600">
                    <Link href="/simulateur" className="hover:text-primary transition-colors">Simulateur</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
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
