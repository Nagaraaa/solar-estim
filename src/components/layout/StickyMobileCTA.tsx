"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function StickyMobileCTA() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hide on simulator pages to avoid covering the form
        if (pathname?.includes("/simulateur")) {
            setIsVisible(false);
        } else {
            // Option: Show only after some scroll? Or always? 
            // Audit says "A tout moment". Let's show always except simulator.
            setIsVisible(true);
        }
    }, [pathname]);

    if (!isVisible) return null;

    const isBe = pathname?.startsWith("/be");
    const simulatorLink = isBe ? "/be/simulateur" : "/simulateur";

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-negative z-50 md:hidden animate-in slide-in-from-bottom duration-500">
            <Link href={simulatorLink} className="block w-full">
                <Button
                    size="lg"
                    className="w-full font-bold text-lg shadow-xl bg-orange-600 hover:bg-orange-700 text-white transition-all transform active:scale-95"
                >
                    Calculer ma prime 2026 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
        </div>
    );
}
