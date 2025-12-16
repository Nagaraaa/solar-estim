"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function BlogCTA() {
    const pathname = usePathname();
    const isBe = pathname?.startsWith("/be");
    const simulatorLink = isBe ? "/be/simulateur" : "/simulateur";

    return (
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl sticky top-24">
            <h3 className="text-2xl font-bold mb-4">Intéressé par le solaire ?</h3>
            <p className="text-slate-300 mb-6">
                Ne vous fiez pas aux estimations génériques. Calculez précisément ce que votre toiture peut vous rapporter{isBe ? " en Belgique" : ""}.
            </p>
            <Link href={simulatorLink} className="block">
                <Button variant="brand" className="w-full font-bold h-12 text-lg">
                    Simuler mon projet
                </Button>
            </Link>
            <p className="text-xs text-center text-slate-500 mt-4">
                Gratuit • Sans engagement • Certifié {isBe ? "RESCert" : "RGE"}
            </p>
        </div>
    );
}
