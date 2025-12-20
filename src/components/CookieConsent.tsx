"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const consent = Cookies.get("cookie_consent");
        if (consent === undefined) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set("cookie_consent", "true", { expires: 30, sameSite: "strict" });
        setIsVisible(false);
    };

    const handleRefuse = () => {
        Cookies.set("cookie_consent", "false", { expires: 30, sameSite: "strict" });
        setIsVisible(false);
    };

    if (!isMounted || !isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <ShieldCheck className="h-6 w-6 text-brand shrink-0 mt-1 hidden md:block" />
                    <div className="text-sm text-slate-300 text-center md:text-left">
                        <p>
                            Nous utilisons des cookies pour améliorer votre expérience, mémoriser votre choix de pays (FR/BE) et analyser notre trafic. En continuant, vous acceptez notre <Link href="/politique-confidentialite" className="text-brand hover:underline underline-offset-4">politique de confidentialité</Link>.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button
                        variant="ghost"
                        onClick={handleRefuse}
                        className="w-full sm:w-auto h-12 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300"
                    >
                        Paramètres ou Refuser
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="w-full sm:w-auto h-12 rounded-lg bg-brand text-slate-950 font-bold hover:bg-brand/90 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        Accepter tout
                    </Button>
                </div>
            </div>
        </div>
    );
}
