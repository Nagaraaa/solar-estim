"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSolarSimulation } from "@/hooks/useSolarSimulation";
import { useDebounce } from "@/hooks/useDebounce";
import { submitLead } from "@/app/actions/submitLead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, MapPin, Euro, CheckCircle2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { SuccessMessage } from "@/components/SuccessMessage";

// Form Schema
const formSchema = z.object({
    address: z.string().min(5, "L'adresse doit être valide (ex: 10 rue de la Paix, Paris)"),
    monthlyBill: z.coerce.number().min(30, "La facture mensuelle semble trop basse.").max(1000, "La facture semble très élevée.")
});

type Region = "Wallonie" | "Bruxelles" | "Flandre" | null;

export default function SimulatorPageBe() {
    const [step, setStep] = useState(0); // Starts at 0 for Region
    const [region, setRegion] = useState<Region>(null);
    const { calculate, loading, error, result } = useSolarSimulation();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null); // New state for phone validation

    // Address coordinates
    const [coordinates, setCoordinates] = useState<{ lat?: number, lon?: number }>({});

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            monthlyBill: 0,
        },
    });

    // Debounce Logic
    const [inputValue, setInputValue] = useState("");
    const debouncedAddress = useDebounce(inputValue, 500);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        const value = e.target.value;
        setInputValue(value);
        fieldChange(value);
    };

    // Effect triggered only when user stops typing for 500ms
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedAddress.length > 3) {
                try {
                    // Use internal API Proxy to avoid CORS errors and send proper headers
                    const res = await fetch(`/api/be/address?q=${encodeURIComponent(debouncedAddress)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data || []);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error("Address fetch error", err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [debouncedAddress]);

    const handleSelectAddress = (feature: any, fieldChange: (value: string) => void) => {
        const label = feature.properties.label;
        const [lon, lat] = feature.geometry.coordinates;

        fieldChange(label);

        form.setValue("address", label);
        setCoordinates({ lat, lon });

        setShowSuggestions(false);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Merge coordinates
        const success = await calculate({ ...values, ...coordinates });
        if (success) {
            setStep(3); // Result step (was 3, now effectively 3 if we count 0->1->2->3)
        }
    };

    const nextStep = async () => {
        const valid = await form.trigger("address");
        if (valid) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const selectRegion = (r: Region) => {
        setRegion(r);
        setStep(1);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl">

            {/* Progress Bar */}
            <div className="mb-12 relative flex justify-between items-center px-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2" />
                <div className={cn("absolute top-1/2 left-0 h-1 bg-brand -z-10 -translate-y-1/2 transition-all duration-300",
                    step === 0 ? "w-0" :
                        step === 1 ? "w-1/4" :
                            step === 2 ? "w-3/4" : "w-full")} />

                {[0, 1, 2, 3].map((s) => (
                    <div key={s} className={cn("w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white font-bold transition-all",
                        step >= s ? "border-brand text-slate-900 scale-110" : "border-slate-200 text-slate-400"
                    )}>
                        {step > s ? <CheckCircle2 className="h-6 w-6 text-brand" /> : s + 1}
                    </div>
                ))}
            </div>

            <Card className="shadow-lg border-slate-200">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {step === 0 && "Sélectionnez votre Région"}
                        {step === 1 && "Où habitez-vous ?"}
                        {step === 2 && "Votre consommation actuelle"}
                        {step === 3 && "Votre Étude Solaire"}
                    </CardTitle>
                    <CardDescription>
                        {step === 0 && "La législation solaire dépend de votre région en Belgique."}
                        {step === 1 && "Nous utilisons les données satellites pour analyser votre toiture."}
                        {step === 2 && "Pour dimensionner la puissance idéale de votre installation."}
                        {step === 3 && "Basé sur les données d'ensoleillement PVGIS."}
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    {/* Step 0: Region Selection */}
                    {step === 0 && (
                        <div className="grid gap-4">
                            {(["Wallonie", "Bruxelles", "Flandre"] as Region[]).map((r) => (
                                <Button
                                    key={r}
                                    variant="outline"
                                    className="h-16 text-xl border-2 hover:border-brand hover:text-brand"
                                    onClick={() => selectRegion(r)}
                                >
                                    {r}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Form */}
                    {step > 0 && step < 3 && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Adresse complète (Belgique)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        placeholder="Ex: Rue de la Loi 16, 1000 Bruxelles"
                                                        className={cn("pl-10 h-12 text-lg", !coordinates.lat && field.value.length > 5 ? "border-amber-500 focus-visible:ring-amber-500" : "")}
                                                        {...field}
                                                        onChange={(e) => {
                                                            handleAddressChange(e, field.onChange);
                                                            setCoordinates({});
                                                        }}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </FormControl>

                                            {showSuggestions && suggestions.length > 0 && (
                                                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-60 overflow-auto">
                                                    {suggestions.map((feature: any) => (
                                                        <div
                                                            key={feature.properties.id || Math.random()}
                                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 text-sm md:text-base text-slate-700"
                                                            onClick={() => handleSelectAddress(feature, field.onChange)}
                                                        >
                                                            <MapPin className="h-4 w-4 text-brand shrink-0" />
                                                            <span>{feature.properties.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <FormMessage />
                                            {!coordinates.lat && field.value.length > 5 && (
                                                <p className="text-sm text-amber-600 font-medium mt-1">
                                                    ⚠️ Veuillez sélectionner une adresse dans la liste.
                                                </p>
                                            )}
                                            <div className="flex gap-4 mt-4">
                                                <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1 h-12">Retour</Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (coordinates.lat && coordinates.lon) {
                                                            nextStep();
                                                        } else {
                                                            form.setError("address", { message: "Veuillez sélectionner une adresse valide dans la liste déroulante." });
                                                        }
                                                    }}
                                                    className="flex-1 h-12 text-lg"
                                                >
                                                    Suivant
                                                </Button>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {step === 2 && (
                                    <FormField
                                        control={form.control}
                                        name="monthlyBill"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Montant de votre facture d'électricité (mensuel)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Euro className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                        <Input type="number" placeholder="Ex: 150" className="pl-10 h-12 text-lg" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                <FormMessage />
                                                <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full sm:flex-1 h-12">Retour</Button>
                                                    <Button type="submit" disabled={loading} className="w-full sm:flex-1 h-12 bg-brand text-slate-900 font-bold hover:bg-brand/90">
                                                        {loading ? <Loader2 className="animate-spin" /> : "Calculer ma rentabilité"}
                                                    </Button>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded">{error}</p>}
                            </form>
                        </Form>
                    )}

                    {/* Results */}
                    {step === 3 && result && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* Region Specific Notes */}
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                                <Globe className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900">Région : {region}</h4>
                                    {region === "Wallonie" && (
                                        <p className="text-blue-700 text-sm">
                                            Note : Prise en compte du tarif Prosumer applicable en Wallonie.
                                        </p>
                                    )}
                                    {region === "Bruxelles" && (
                                        <p className="text-blue-700 text-sm">
                                            Note : Système de Certificats Verts (CV) pris en compte dans l'estimation.
                                        </p>
                                    )}
                                    {region === "Flandre" && (
                                        <p className="text-blue-700 text-sm">
                                            Note : Compteur digital et tarif d'injection pris en compte.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 1. Main Result (Value) */}
                            <Card className="border-brand border-2 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-center text-slate-900">Résultat Estimé</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="text-4xl md:text-5xl font-black text-brand mb-2">
                                        {result.annualSavings}€ <span className="text-xl text-slate-600 font-medium">/ an</span>
                                    </div>
                                    <p className="text-slate-500 font-medium">d'économies potentielles immédiates</p>
                                </CardContent>
                            </Card>

                            {/* 2. Technical Details (Value Adds) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-xs sm:text-sm text-slate-500 mb-1">Production</div>
                                    <div className="text-lg sm:text-xl font-bold text-slate-900">{result.annualProduction} kWh</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-xs sm:text-sm text-slate-500 mb-1">Installation</div>
                                    <div className="text-lg sm:text-xl font-bold text-slate-900">{result.systemSize} kWc</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-xs sm:text-sm text-slate-500 mb-1">Coût Estimé</div>
                                    <div className="text-lg sm:text-xl font-bold text-slate-900">{result.totalCost} €</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-xs sm:text-sm text-slate-500 mb-1">Rentabilité</div>
                                    <div className="text-lg sm:text-xl font-bold text-success">{result.roiYears} ans</div>
                                </div>
                            </div>

                            {/* 3. Lead Capture Form */}
                            {/* 3. Lead Capture Form */}
                            {isSubmitted ? (
                                <SuccessMessage />
                            ) : (
                                <Card className="border-slate-200 shadow-2xl overflow-hidden">
                                    <div className="bg-slate-900 p-6 text-white text-center">
                                        <h3 className="text-xl font-bold mb-2">Recevoir mon Étude Détaillée</h3>
                                        <p className="text-slate-300 text-sm">
                                            Entrez vos coordonnées pour recevoir votre rapport complet et les devis certifiés RESCert par email.
                                        </p>
                                    </div>
                                    <CardContent className="p-6 bg-slate-50">
                                        <form action={async (formData) => {
                                            const phone = formData.get('phone') as string;
                                            const cleanPhone = phone.replace(/\s/g, '');
                                            // BE Validation: 9 or 10 digits starting with 0
                                            if (!/^0\d{8,9}$/.test(cleanPhone)) {
                                                setPhoneError("Numéro belge invalide (9 ou 10 chiffres)");
                                                return;
                                            }

                                            setSubmitError(null);
                                            formData.append("address", form.getValues("address"));
                                            const res = await submitLead(formData, result, 'BE');
                                            if (res.success) {
                                                setIsSubmitted(true);
                                                // window.scrollTo({ top: 0, behavior: 'smooth' }); // Removed to keep focus on message
                                            } else {
                                                setSubmitError(res.error || "Une erreur inconnue est survenue.");
                                            }
                                        }} className="space-y-4">
                                            {submitError && (
                                                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
                                                    ⚠️ {submitError}
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Nom complet</Label>
                                                    <Input name="name" required placeholder="Jean Dupont" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Téléphone</Label>
                                                    <Input
                                                        name="phone"
                                                        required
                                                        placeholder="0470 12 34 56"
                                                        className={cn(phoneError ? "border-red-500 focus-visible:ring-red-500" : "")}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\s/g, '');
                                                            // Belgium: 9 or 10 digits, starts with 0
                                                            if (val.length > 0 && !/^0\d{8,9}$/.test(val)) {
                                                                setPhoneError("Format invalide (ex: 0470...)");
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
                                            <Button type="submit" className="w-full h-14 text-lg font-bold bg-brand text-slate-900 hover:bg-brand/90 mt-4 shadow-xl">
                                                ENVOYER MA DEMANDE &gt;&gt;
                                            </Button>
                                            <p className="text-xs text-slate-400 text-center mt-4 px-2">
                                                En cliquant, vous acceptez d'être recontacté pour votre projet solaire. Vos données restent confidentielles.
                                            </p>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-400 mt-8">
                Les résultats sont des estimations basées sur les données moyennes et l'ensoleillement de votre région ({region || "Belgique"}).
                Seule une visite technique peut confirmer le devis final.
            </p>
        </div>
    );
}
