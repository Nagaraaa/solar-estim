'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CountrySelectorModal({ detectedCountry }: { detectedCountry: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Only show if:
        // 1. Detected country is 'BE'
        // 2. Not already on a /be page
        // 3. User hasn't made a choice yet (cookie check)

        const hasPreference = document.cookie.includes('user-country=');
        const isBelgianPage = pathname.startsWith('/be');

        if (detectedCountry === 'BE' && !isBelgianPage && !hasPreference) {
            // Small delay to ensure client-side hydration doesn't clash immediately
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [detectedCountry, pathname]);

    const handleSwitchToBE = () => {
        // Set cookie Preference = BE
        document.cookie = "user-country=BE; path=/; max-age=31536000; SameSite=Lax";
        // Redirect to /be counterpart
        const newPath = `/be${pathname === '/' ? '' : pathname}`;
        router.push(newPath);
        setIsOpen(false);
    };

    const handleStayOnFR = () => {
        // Set cookie Preference = FR
        document.cookie = "user-country=FR; path=/; max-age=31536000; SameSite=Lax";
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-300 ring-1 ring-white/10">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">🇧🇪</span>
                            Vous semblez être en Belgique
                        </h2>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                        Souhaitez-vous voir nos tarifs et aides spécifiques (Tarif Prosumer, Primes 2026) adaptés à votre région ?
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleSwitchToBE}
                            className="w-full bg-[#FFCD00] hover:bg-[#FFCD00]/90 text-black font-bold h-12 text-md shadow-lg shadow-amber-500/20"
                        >
                            Passer à la version Belgique
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleStayOnFR}
                            className="w-full border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white h-12"
                        >
                            Rester sur le site France
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
