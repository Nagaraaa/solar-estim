"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent cookie exists
        const consent = Cookies.get("rgpd_consent");
        // If undefined, user has not made a choice yet -> Show banner
        if (consent === undefined) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // Active Consent: User clicked "Accepter"
        Cookies.set("rgpd_consent", "true", { expires: 365, sameSite: "strict" });
        setIsVisible(false);
        // Optional: Reload page to load scripts if needed immediately
        // window.location.reload(); 
    };

    const handleRefuse = () => {
        // Active Rejection: User clicked "Refuser"
        Cookies.set("rgpd_consent", "false", { expires: 365, sameSite: "strict" });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900 border-t border-slate-700 p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <ShieldCheck className="h-8 w-8 text-brand shrink-0 mt-1" />
                    <div className="text-sm text-slate-300">
                        <strong className="text-white block mb-1 text-base">Votre vie privée nous importe</strong>
                        <p>
                            Nous utilisons des cookies pour améliorer votre expérience et suivre nos statistiques.
                            Conformément au <strong>RGPD</strong>, nous ne déposons aucun traceur sans votre consentement éclairé.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 shrink-0 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleRefuse}
                        className="flex-1 md:flex-none border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        Refuser
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none bg-brand text-slate-900 font-bold hover:bg-brand/90"
                    >
                        Accepter
                    </Button>
                </div>
            </div>
        </div>
    );
}
