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
    recalculate?: (newValues: { slope: number; azimuth: number; withBattery?: boolean }) => void;
    isCalculating?: boolean;
    simulationError?: string | null;
}

import { ResultDashboard } from "./ResultDashboard";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Settings2, Loader2, AlertCircle, Zap } from "lucide-react";
import { useNonce } from "@/components/providers/NonceProvider";

import { SimulatorControls } from "./SimulatorControls";
import { SimulatorResults } from "./SimulatorResults";
import { AffiliatePartnerCard } from "@/components/ui/AffiliatePartnerCard";

// ... imports

export function ResultStep({ result, address, countryCode, region, monthlyBill, recalculate, isCalculating = false, simulationError }: ResultStepProps) {
    // ... (state hooks)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const nonce = useNonce();

    // Scroll top on success
    useEffect(() => {
        if (isSubmitted) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [isSubmitted]);

    // Advanced Params State (use result details as initial defaults)
    const [slope, setSlope] = useState(result.details.slope ?? 35);
    const [azimuth, setAzimuth] = useState(result.details.azimuth ?? 0);
    const [withBattery, setWithBattery] = useState(false);

    // Check if local state differs from result (Pending Update)
    // Fix: Compare withBattery to result details
    const isPending = (slope !== (result.details.slope ?? 35) || azimuth !== (result.details.azimuth ?? 0) || withBattery !== (result.details.withBattery ?? false)) && !simulationError;
    const isBusy = (isCalculating || isPending) && !simulationError;

    // Debounce recalculation
    useEffect(() => {
        if (isCalculating) return;
        const timer = setTimeout(() => {
            if (recalculate && isPending) {
                recalculate({ slope, azimuth, withBattery });
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [slope, azimuth, withBattery, recalculate, isPending, isCalculating]);

    const handleUpdate = (updates: Partial<{ slope: number; azimuth: number; withBattery: boolean }>) => {
        if (updates.slope !== undefined) setSlope(updates.slope);
        if (updates.azimuth !== undefined) setAzimuth(updates.azimuth);
        if (updates.withBattery !== undefined) setWithBattery(updates.withBattery);
    };

    // Validation Logic (Phone)
    const validatePhone = (phone: string): boolean => {
        const clean = phone.replace(/\s/g, '');
        return countryCode === "FR" ? /^0[1-9]\d{8}$/.test(clean) : /^0\d{8,9}$/.test(clean);
    };
    const phonePlaceholder = countryCode === "FR" ? "06 12 34 56 78" : "0470 12 34 56";
    const phoneErrorMsg = countryCode === "FR" ? "Format invalide (ex: 0612345678)" : "Format invalide (ex: 0470...)";

    // Derived values for display
    const formattedConsumption = Math.round(result.estimatedConsumption || 0).toLocaleString('fr-FR');

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Note for BE Regions */}
            {countryCode === "BE" && region && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3 mb-6 max-w-3xl mx-auto lg:mx-0">
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
            {simulationError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 max-w-3xl">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="font-medium">{simulationError} - Veuillez réessayer en modifiant les paramètres.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* LEFT COLUMN: Controls (Span 4) 
                    - Sticky on Desktop
                */}
                <div className="lg:col-span-4 w-full lg:sticky lg:top-4 z-10">
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm ring-1 ring-slate-100">
                        <SimulatorControls
                            address={address}
                            monthlyBill={monthlyBill}
                            slope={slope}
                            azimuth={azimuth}
                            withBattery={withBattery}
                            onUpdate={handleUpdate}
                            isBusy={isBusy}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: Results & Form (Span 8) */}
                <div className="lg:col-span-8 w-full space-y-6">
                    <SimulatorResults
                        result={result}
                        monthlyBill={monthlyBill}
                        isBusy={isBusy}
                    />

                    {/* LEAD FORM */}
                    <div id="lead-form">
                        {isSubmitted ? (
                            <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
                                <SuccessMessage cityName={address.split(/\d{5}\s+/)[1] || address.split(',')[0]} />
                            </div>
                        ) : (
                            // ... (Existing Lead Form Card code - reusing exact structure)
                            <Card className="border-slate-200 shadow-xl overflow-hidden mt-8">
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
                                        // Token passed directly as argument

                                        const res = await submitLead(formData, result, countryCode, token);

                                        if (res.success) {
                                            setIsSubmitted(true);
                                        } else {
                                            setSubmitError(res.error || "Une erreur inconnue est survenue.");
                                        }
                                    }} className="space-y-4">

                                        {/* ... (Existing Form Fields) ... */}
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

                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-amber-500" />
                                                <span className="text-sm font-medium text-slate-700">Consommation Future</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-slate-900">{formattedConsumption} kWh/an</div>
                                                {result.details?.ev_kwh ? (
                                                    <div className="text-xs text-brand font-medium flex items-center gap-1 justify-end">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                                                        Dont {result.details.ev_kwh} kWh (VE)
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-400"> Estimée</div>
                                                )}
                                            </div>
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
                                            <div className="flex justify-center my-4 min-h-[65px]">
                                                {(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.NODE_ENV === 'development') ? (
                                                    <Turnstile
                                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                                                        onSuccess={(token) => setToken(token)}
                                                        onError={(err) => {
                                                            console.error("Turnstile Error:", err);
                                                            setSubmitError("Erreur de connexion au service de sécurité.");
                                                        }}
                                                        scriptOptions={{
                                                            nonce: nonce,
                                                        }}
                                                        options={{
                                                            theme: 'light',
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
                                                        ⚠️ Configuration manquante : Clé de sécurité (Captcha).
                                                        <br />
                                                        <span className="text-xs text-amber-600">Veuillez vérifier les variables d'environnement (NEXT_PUBLIC_TURNSTILE_SITE_KEY).</span>
                                                    </div>
                                                )}
                                            </div>
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
                </div>
            </div>
        </div>
    );
}
