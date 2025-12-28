import { useState, useEffect } from "react";
import { submitLead } from "@/app/actions/submitLead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessMessage } from "@/components/SuccessMessage";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { type SimulationResult } from "@/lib/engine";

interface ResultStepProps {
    result: SimulationResult;
    address: string;
    countryCode: "FR" | "BE";
    region?: string | null; // For BE display
    monthlyBill: number;
    recalculate?: (newValues: { slope: number; azimuth: number }) => void;
    isCalculating?: boolean;
    simulationError?: string | null;
}

import { ResultDashboard } from "./ResultDashboard";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Settings2, Loader2, AlertCircle } from "lucide-react";

export function ResultStep({ result, address, countryCode, region, monthlyBill, recalculate, isCalculating = false, simulationError }: ResultStepProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Advanced Params State (use result details as initial defaults)
    const [slope, setSlope] = useState(result.details.slope ?? 35);
    const [azimuth, setAzimuth] = useState(result.details.azimuth ?? 0);
    const [isOpen, setIsOpen] = useState(false);

    // Check if local state differs from result (Pending Update)
    // IMPORTANT: If there is an error, we consider the update "done" (failed) so we unblock the UI.
    const isPending = (slope !== (result.details.slope ?? 35) || azimuth !== (result.details.azimuth ?? 0)) && !simulationError;
    const isBusy = (isCalculating || isPending) && !simulationError;

    // Debounce recalculation
    useEffect(() => {
        // Prevent infinite loop: Do not schedule if already calculating
        if (isCalculating) return;

        const timer = setTimeout(() => {
            // Only trigger if values differ from what's potentially in result
            // Check if recalculate is provided. DO NOT trigger if we already have an error for this state unless values changed again.
            if (recalculate && isPending) {
                recalculate({ slope, azimuth });
            }
        }, 800); // 800ms debounce
        return () => clearTimeout(timer);
    }, [slope, azimuth, recalculate, isPending, isCalculating]);


    // Validation Logic
    const validatePhone = (phone: string): boolean => {
        const clean = phone.replace(/\s/g, '');
        if (countryCode === "FR") {
            // FR: 10 digits, starts with 0
            return /^0[1-9]\d{8}$/.test(clean);
        } else {
            // BE: 9 or 10 digits, starts with 0
            return /^0\d{8,9}$/.test(clean);
        }
    };

    const phonePlaceholder = countryCode === "FR" ? "06 12 34 56 78" : "0470 12 34 56";
    const phoneErrorMsg = countryCode === "FR" ? "Format invalide (ex: 0612345678)" : "Format invalide (ex: 0470...)";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-full overflow-x-hidden">
            {/* Note for BE Regions */}
            {countryCode === "BE" && region && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                    <Globe className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900">Région : {region}</h4>
                        {region === "Wallonie" && (
                            <p className="text-blue-700 text-sm">Note : Prise en compte du tarif Prosumer applicable en Wallonie.</p>
                        )}
                        {region === "Bruxelles" && (
                            <p className="text-blue-700 text-sm">Note : Système de Certificats Verts (CV) pris en compte.</p>
                        )}
                        {region === "Flandre" && (
                            <p className="text-blue-700 text-sm">Note : Compteur digital et tarif d'injection pris en compte.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Advanced Settings */}
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between w-full">
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        Paramètres Avancés (Toiture)
                        {isBusy && <Loader2 className="h-3 w-3 animate-spin text-brand" />}
                        {simulationError && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            <ChevronDown className={cn("h-4 w-4 transition-all", isOpen && "rotate-180")} />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-6 pt-4">
                    {simulationError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>{simulationError} - Veuillez réessayer.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inclinaison */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="text-slate-600">Inclinaison (Pente)</Label>
                                <span className="text-sm font-bold text-brand bg-brand/10 px-2 rounded">{slope}°</span>
                            </div>
                            <Slider
                                value={[slope]}
                                onValueChange={(vals) => setSlope(vals[0])}
                                max={90}
                                step={1}
                            />
                            <p className="text-xs text-slate-400">0° = Plat, 90° = Vertical. Optimal ~35°.</p>
                        </div>
                        {/* Orientation */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="text-slate-600">Orientation (Azimut)</Label>
                                <span className="text-sm font-bold text-brand bg-brand/10 px-2 rounded">{azimuth}°</span>
                            </div>
                            <Slider
                                value={[azimuth]}
                                onValueChange={(vals) => setAzimuth(vals[0])}
                                max={180}
                                min={-180}
                                step={5}
                            />
                            <p className="text-xs text-slate-400">-90° = Est, 0° = Sud, 90° = Ouest.</p>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* 1. Dashboard Visualization */}
            <div className={cn("transition-opacity duration-300", isBusy ? "opacity-50 pointer-events-none" : "opacity-100")}>
                <ResultDashboard result={result} monthlyBill={monthlyBill} />
            </div>

            {/* 3. Lead Capture Form */}
            {isSubmitted ? (
                <SuccessMessage />
            ) : (
                <Card className="border-slate-200 shadow-2xl overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white text-center">
                        <h3 className="text-xl font-bold mb-2">Recevoir mon Étude Détaillée</h3>
                        <p className="text-slate-300 text-sm">
                            Entrez vos coordonnées pour recevoir votre rapport complet et les devis certifiés {countryCode === "FR" ? "RGE" : "RESCert"} par email.
                        </p>
                    </div>
                    <CardContent className="p-6 bg-slate-50">
                        <form action={async (formData) => {
                            const phone = formData.get('phone') as string;
                            if (!validatePhone(phone)) {
                                setPhoneError(phoneErrorMsg);
                                return;
                            }
                            if (!token) {
                                setSubmitError("Veuillez valider le captcha Cloudflare.");
                                return;
                            }

                            setSubmitError(null);

                            formData.append("address", address);
                            // Token passed directly as argument, no need to append to formData which might fail serialization

                            const res = await submitLead(formData, result, countryCode, token);

                            if (res.success) {
                                setIsSubmitted(true);
                            } else {
                                setSubmitError(res.error || "Une erreur inconnue est survenue.");
                            }
                        }} className="space-y-4">
                            {submitError && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
                                    ⚠️ {submitError}
                                </div>
                            )}
                            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom complet</Label>
                                    <Input name="name" required placeholder="Jean Dupont" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input
                                        name="phone"
                                        required
                                        placeholder={phonePlaceholder}
                                        className={cn(phoneError ? "border-red-500 focus-visible:ring-red-500" : "")}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length > 0 && !validatePhone(val)) {
                                                setPhoneError(phoneErrorMsg);
                                            } else {
                                                setPhoneError(null);
                                            }
                                        }}
                                    />
                                    {phoneError && (
                                        <p className="text-xs text-red-500 font-medium flex items-center animate-in slide-in-from-left-1 duration-300">
                                            🚫 {phoneError}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input name="email" type="email" required placeholder="jean.dupont@email.com" />
                            </div>

                            <div className="flex items-start gap-3 mt-4 p-3 bg-slate-100 rounded-md border border-slate-200">
                                <input
                                    type="checkbox"
                                    id="gdpr-consent"
                                    className="mt-1 w-4 h-4 text-brand rounded border-slate-300 focus:ring-brand cursor-pointer"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                />
                                <label htmlFor="gdpr-consent" className="text-xs text-slate-600 cursor-pointer leading-tight">
                                    J'accepte d'être recontacté pour mon projet solaire et j'accepte la <a href="/politique-confidentialite" target="_blank" className="underline text-brand font-medium hover:text-brand/80">politique de confidentialité</a> du site.
                                </label>
                            </div>

                            <div className="flex justify-center my-4 min-h-[65px]">
                                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                                    <Turnstile
                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                                        onSuccess={(token) => setToken(token)}
                                        onError={(err) => {
                                            console.error("Turnstile Error:", err);
                                            setSubmitError("Erreur de connexion au service de sécurité.");
                                        }}
                                        options={{
                                            theme: 'light',
                                        }}
                                    />
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={!isAgreed || !token || isBusy}
                                className={cn(
                                    "w-full h-14 text-lg font-bold mt-4 shadow-xl transition-all duration-300",
                                    (isAgreed && token && !isBusy)
                                        ? "bg-brand text-slate-900 hover:bg-brand/90"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                )}
                            >
                                {isBusy ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Mise à jour de l'étude...
                                    </span>
                                ) : (
                                    "ENVOYER MA DEMANDE >>"
                                )}
                            </Button>
                            <p className="text-xs text-slate-400 text-center mt-4 px-2">
                                Vos données restent confidentielles et sécurisées.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
