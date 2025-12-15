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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await calculate(values);
        setStep(3); // Result step
    };

    const nextStep = async () => {
        const valid = await form.trigger("address");
        if (valid) setStep(2);
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
                                            <FormItem>
                                                <FormLabel>Adresse complète</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                        <Input placeholder="Ex: 10 rue de la Paix, 75001 Paris" className="pl-10 h-12 text-lg" {...field} />
                                                    </div>
                                                </FormControl>
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
                        <ResultLock
                            mainResult={<>{result.annualSavings}€ <span className="text-lg text-slate-600 font-medium">/ an</span></>}
                            onUnlock={handleUnlock}
                            hiddenContent={
                                <div className="space-y-6 pt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                                            <div className="text-sm text-slate-500">Production Estimée</div>
                                            <div className="text-xl font-bold text-slate-900">{result.annualProduction} kWh/an</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                                            <div className="text-sm text-slate-500">Puissance conseillée</div>
                                            <div className="text-xl font-bold text-slate-900">{result.systemSize} kWc</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                                            <div className="text-sm text-slate-500">Coût estimé</div>
                                            <div className="text-xl font-bold text-slate-900">{result.totalCost} €</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                                            <div className="text-sm text-slate-500">Retour sur Inv.</div>
                                            <div className="text-xl font-bold text-success">{result.roiYears} ans</div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">Installateurs RGE à proximité</h4>
                                        <ul className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <li key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50">
                                                    <div className="h-10 w-10 bg-slate-200 rounded-full" />
                                                    <div>
                                                        <div className="font-bold text-sm">Solar Pro {i}</div>
                                                        <div className="text-xs text-slate-500">Certifié QualiPV • 5km</div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="ml-auto">Contact</Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            }
                        />
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
