import { useState } from "react";
import { submitLead } from "@/app/actions/submitLead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessMessage } from "@/components/SuccessMessage";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface ResultStepProps {
    result: any;
    address: string;
    countryCode: "FR" | "BE";
    region?: string | null; // For BE display
    monthlyBill: number;
}

import { ResultDashboard } from "./ResultDashboard";

export function ResultStep({ result, address, countryCode, region, monthlyBill }: ResultStepProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);

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

            {/* 1. Dashboard Visualization */}
            <ResultDashboard result={result} monthlyBill={monthlyBill} />

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
                            setSubmitError(null);

                            formData.append("address", address);
                            const res = await submitLead(formData, result, countryCode);

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

                            <Button
                                type="submit"
                                disabled={!isAgreed}
                                className={cn(
                                    "w-full h-14 text-lg font-bold mt-4 shadow-xl transition-all duration-300",
                                    isAgreed
                                        ? "bg-brand text-slate-900 hover:bg-brand/90"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                )}
                            >
                                ENVOYER MA DEMANDE &gt;&gt;
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
