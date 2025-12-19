"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function CountrySelector({ variant = "header" }: { variant?: "header" | "footer" }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Safety check for pathname
    if (!pathname) return null;

    const isBe = pathname.startsWith("/be");
    const currentCountry = isBe ? "BE" : "FR";

    const toggleCountry = (targetCountry: "FR" | "BE") => {
        if (targetCountry === currentCountry) {
            setIsOpen(false);
            return;
        }

        // Set cookie for persistence (1 year)
        document.cookie = `solar_country=${targetCountry}; path=/; max-age=31536000; SameSite=Lax`;

        // Calculate new path
        let newPath = pathname;

        if (targetCountry === "BE") {
            // Switch to BE: Add /be prefix if not present
            if (!pathname.startsWith("/be")) {
                newPath = `/be${pathname === "/" ? "" : pathname}`;
            }
        } else {
            // Switch to FR: Remove /be prefix
            newPath = pathname.replace(/^\/be/, "") || "/";
        }

        router.push(newPath);
        setIsOpen(false);
    };

    const FlagFR = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="h-4 w-4 rounded-full object-cover ring-1 ring-slate-200">
            <rect width="1" height="2" x="0" fill="#002395" />
            <rect width="1" height="2" x="1" fill="#fff" />
            <rect width="1" height="2" x="2" fill="#ed2939" />
        </svg>
    );

    const FlagBE = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="h-4 w-4 rounded-full object-cover ring-1 ring-slate-200">
            <rect width="1" height="2" x="0" fill="#000" />
            <rect width="1" height="2" x="1" fill="#fwd200" /> {/* Correct yellow hex approximation or use yellow */}
            <rect width="1" height="2" x="1" fill="#fae042" />
            <rect width="1" height="2" x="2" fill="#ef3340" />
        </svg>
    );
    // Correction for BE Flag Colors standard
    const FlagBECorrect = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" className="h-4 w-4 rounded-full object-cover ring-1 ring-slate-200">
            <rect width="100" height="200" x="0" fill="#000000" />
            <rect width="100" height="200" x="100" fill="#FDDA24" />
            <rect width="100" height="200" x="200" fill="#EF3340" />
        </svg>
    );


    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-50",
                    variant === "footer" ? "bg-white text-slate-700" : "bg-white/90 text-slate-700 backdrop-blur-sm"
                )}
                aria-label="Changer de pays"
            >
                {currentCountry === "FR" ? <FlagFR /> : <FlagBECorrect />}
                <span className="hidden w-5 sm:inline text-xs">{currentCountry}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100",
                    variant === "footer" ? "bottom-full mb-2 top-auto" : "top-full"
                )}>
                    <div className="space-y-1">
                        <button
                            onClick={() => toggleCountry("FR")}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50",
                                currentCountry === "FR" && "bg-slate-50 font-semibold"
                            )}
                        >
                            <FlagFR />
                            France
                        </button>
                        <button
                            onClick={() => toggleCountry("BE")}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50",
                                currentCountry === "BE" && "bg-slate-50 font-semibold"
                            )}
                        >
                            <FlagBECorrect />
                            Belgique
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
