"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { CountrySelector } from "../ui/CountrySelector";


export function Header() {
    const pathname = usePathname();
    const isBe = pathname?.startsWith("/be");

    const homeLink = isBe ? "/be" : "/";
    const simuLink = isBe ? "/be/simulateur" : "/simulateur";
    const blogLink = isBe ? "/be/blog" : "/blog";

    const guideLink = isBe ? "/be/guide/comprendre-le-solaire" : "/guide/comprendre-le-solaire";

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

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
                    <Link href={isBe ? "/be" : "/"} className="hover:text-brand transition-colors">Accueil</Link>
                    <Link href={guideLink} className="hover:text-brand transition-colors text-slate-500">Guide 2026</Link>
                    <CountrySelector variant="header" />
                    <Link href={simuLink}>
                        <Button variant="brand" className="font-bold">
                            Lancer une simulation
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
