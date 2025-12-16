"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSolarSimulation } from "@/hooks/useSolarSimulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, MapPin, Euro, CheckCircle2 } from "lucide-react";
import { ResultLock } from "@/components/ResultLock";
import { cn } from "@/lib/utils";

// Form Schema
const formSchema = z.object({
    address: z.string().min(5, "L'adresse doit être valide (ex: 10 rue de la Paix, Paris)"),
    monthlyBill: z.coerce.number().min(30, "La facture mensuelle semble trop basse.").max(1000, "La facture semble très élevée.")
});

export default function SimulatorPage() {
    const [step, setStep] = useState(1);
    const { calculate, loading, error, result } = useSolarSimulation();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    // Address Autocomplete Logic
    const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        const value = e.target.value;
        fieldChange(value);

        if (value.length > 3) {
            try {
                const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.features || []);
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

    const handleSelectAddress = (feature: any, fieldChange: (value: string) => void) => {
        const label = feature.properties.label;
        const [lon, lat] = feature.geometry.coordinates;

        fieldChange(label);
        // Store coordinates in form state (we need to add these to schema or handle separately)
        // Since schema doesn't have lat/lon, we pass them directly effectively when submitting if we updated schema
        // OR we can store them in a state to pass to calculate.
        // Let's store in a ref or state.
        form.setValue("address", label);
        // We'll pass these coordinates to the calculate function via a modified onSubmit or just store them
        // Let's add hidden fields to form or just use a state REF.
        // Actually, best is to add lat/lon to form values if possible, but schema needs update?
        // User asked to "stockes les coordonnées dans l'état du formulaire (hidden fields ou state React)".
        // I'll use a state for coordinates.
        setCoordinates({ lat, lon });

        setShowSuggestions(false);
    };

    const [coordinates, setCoordinates] = useState<{ lat?: number, lon?: number }>({});

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Merge coordinates
        const success = await calculate({ ...values, ...coordinates });
        if (success) {
            setStep(3); // Result step
        }
    };

    const nextStep = async () => {
        const valid = await form.trigger("address");
        if (valid) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleUnlock = (email: string) => {
        // Lead capture simulation
        console.log("Lead captured:", email);
        alert(`Merci ${email} ! Vos résultats détaillés sont débloqués.`);
        // In real app, send to API DB here.
        // Allow viewing full details
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl">

            {/* Progress Bar */}
            <div className="mb-12 relative flex justify-between items-center px-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2" />
                <div className={cn("absolute top-1/2 left-0 h-1 bg-brand -z-10 -translate-y-1/2 transition-all duration-300", step === 1 ? "w-0" : step === 2 ? "w-1/2" : "w-full")} />

                {[1, 2, 3].map((s) => (
                    <div key={s} className={cn("w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white font-bold transition-all",
                        step >= s ? "border-brand text-slate-900 scale-110" : "border-slate-200 text-slate-400"
                    )}>
                        {step > s ? <CheckCircle2 className="h-6 w-6 text-brand" /> : s}
                    </div>
                ))}
            </div>

            <Card className="shadow-lg border-slate-200">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {step === 1 && "Où habitez-vous ?"}
                        {step === 2 && "Votre consommation actuelle"}
                        {step === 3 && "Votre Étude Solaire"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Nous utilisons les données satellites pour analyser votre toiture."}
                        {step === 2 && "Pour dimensionner la puissance idéale de votre installation."}
                        {step === 3 && "Basé sur les données d'ensoleillement PVGIS."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Form */}
                    {step < 3 && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {step === 1 && (
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormLabel>Adresse complète</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            placeholder="Ex: 10 rue de la Paix, 75001 Paris"
                                                            className="pl-10 h-12 text-lg"
                                                            {...field}
                                                            onChange={(e) => handleAddressChange(e, field.onChange)}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                </FormControl>

                                                {/* Suggestions Dropdown */}
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
                                                <Button type="button" onClick={nextStep} className="w-full mt-4 h-12 text-lg">Suivant</Button>
                                            </FormItem>
                                        )}
                                    />
                                )}

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
                                                <div className="flex gap-4 mt-6">
                                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">Retour</Button>
                                                    <Button type="submit" disabled={loading} className="flex-1 h-12 bg-brand text-slate-900 font-bold hover:bg-brand/90">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-sm text-slate-500 mb-1">Production</div>
                                    <div className="text-xl font-bold text-slate-900">{result.annualProduction} kWh</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-sm text-slate-500 mb-1">Installation</div>
                                    <div className="text-xl font-bold text-slate-900">{result.systemSize} kWc</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-sm text-slate-500 mb-1">Coût Estimé</div>
                                    <div className="text-xl font-bold text-slate-900">{result.totalCost} €</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                                    <div className="text-sm text-slate-500 mb-1">Rentabilité</div>
                                    <div className="text-xl font-bold text-success">{result.roiYears} ans</div>
                                </div>
                            </div>

                            {/* 3. High-End Lead Capture Form */}
                            <Card className="border-slate-200 shadow-2xl overflow-hidden">
                                <div className="bg-slate-900 p-6 text-white text-center">
                                    <h3 className="text-xl font-bold mb-2">Vérifier la faisabilité & Bloquer les aides</h3>
                                    <p className="text-slate-300 text-sm">
                                        Recevez votre étude détaillée et les devis d'artisans certifiés RGE.
                                    </p>
                                </div>
                                <CardContent className="p-6 bg-slate-50 text-center">
                                    <Button
                                        onClick={() => {
                                            // TODO: REMPLACER PAR LE LIEN AWIN ICI
                                            window.open("https://www.google.fr/search?q=panneaux+solaires", "_blank");
                                        }}
                                        className="w-full h-16 text-lg md:text-xl font-black bg-brand hover:bg-brand/90 text-slate-900 shadow-xl uppercase tracking-wide mb-4"
                                    >
                                        COMPARER LES DEVIS CERTIFIÉS (Gratuit) &gt;&gt;
                                    </Button>

                                    <p className="text-sm text-slate-500 italic">
                                        Redirection vers notre comparateur partenaire agréé.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-400 mt-8">
                Les résultats sont des estimations basées sur les données moyennes et l'ensoleillement de votre région.
                Seule une visite technique peut confirmer le devis final.
            </p>
        </div>
    );
}
