"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";


export function Header() {
    const pathname = usePathname();
    const isBe = pathname?.startsWith("/be");

    const homeLink = isBe ? "/be" : "/";
    const simuLink = isBe ? "/be/simulateur" : "/simulateur";
    const blogLink = isBe ? "/be/blog" : "/blog";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-auto py-2 items-center justify-between px-4 md:px-6">
                <Link href={homeLink} className="flex items-center gap-2">
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
                    <Link href={simuLink} className="hover:text-primary transition-colors">Simulateur</Link>
                    <Link href={blogLink} className="hover:text-primary transition-colors">Blog</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href={simuLink}>
                        <Button variant="brand" className="font-bold shadow-brand/20 shadow-lg">
                            Calculer ma rentabilité
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
