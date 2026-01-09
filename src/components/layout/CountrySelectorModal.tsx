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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            🇧🇪 Vous semblez être en Belgique
                        </h2>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        Souhaitez-vous voir nos tarifs et aides spécifiques (Tarif Prosumer, Primes 2026) adaptés à votre région ?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" onClick={handleStayOnFR} className="flex-1 w-full order-2 sm:order-1">
                            Rester sur le site France
                        </Button>
                        <Button onClick={handleSwitchToBE} className="flex-1 w-full order-1 sm:order-2 bg-brand hover:bg-brand/90 text-white">
                            Passer à la version Belgique
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
