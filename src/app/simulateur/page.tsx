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
                                        Recevez votre étude détaillée et les devis d'artisans certifiés RGE par email.
                                    </p>
                                </div>
                                <CardContent className="p-6 bg-slate-50">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const data = Object.fromEntries(formData.entries());
                                        console.log("LEAD CAPTURÉ:", data);
                                        alert("Votre dossier a bien été enregistré. Un expert va vous recontacter.");
                                    }} className="space-y-4">
                                        <div>
                                            <Input
                                                name="fullname"
                                                placeholder="Votre Nom Complet"
                                                className="h-12 bg-white text-lg border-slate-300"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="Votre Email"
                                                className="h-12 bg-white text-lg border-slate-300"
                                                required
                                            />
                                            <Input
                                                name="phone"
                                                type="tel"
                                                placeholder="Téléphone"
                                                className="h-12 bg-white text-lg border-slate-300"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-14 text-lg font-black bg-brand hover:bg-brand/90 text-slate-900 shadow-xl uppercase tracking-wide"
                                        >
                                            Recevoir mon étude gratuite &gt;&gt;
                                        </Button>

                                        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                                            <span className="h-3 w-3 inline-block rounded-full bg-green-500"></span>
                                            Vos données sont sécurisées. Sans engagement.
                                        </p>
                                    </form>
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
