"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSolarSimulation } from "@/hooks/useSolarSimulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SimulatorProgressBar } from "@/components/simulator/SimulatorProgressBar";
import { AddressStep } from "@/components/simulator/AddressStep";
import { ConsumptionStep } from "@/components/simulator/ConsumptionStep";
import { ResultStep } from "@/components/simulator/ResultStep";

// Form Schema
const formSchema = z.object({
    address: z.string().min(5, "L'adresse doit être valide"),
    monthlyBill: z.coerce.number().min(30, "La facture mensuelle semble trop basse.").max(1000, "La facture semble très élevée.")
});

type Region = "Wallonie" | "Bruxelles" | "Flandre" | null;

export default function SimulatorPageBe() {
    const [step, setStep] = useState(0); // Starts at 0 for Region
    const [region, setRegion] = useState<Region>(null);
    const { calculate, loading, error, result } = useSolarSimulation();
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const success = await calculate({ ...values, ...coordinates });
        if (success) {
            setStep(3); // Result step
        }
    };

    const nextStep = async () => {
        const valid = await form.trigger("address");
        if (valid) {
            setStep(2);
        }
    };

    const selectRegion = (r: Region) => {
        setRegion(r);
        setStep(1);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl">
            {/* Progress Bar (mapped to match BE steps 0-3 with display 1-4) */}
            <SimulatorProgressBar currentStep={step + 1} totalSteps={4} />

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

                    {/* Steps 1 & 2: Form */}
                    {step > 0 && step < 3 && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {step === 1 && (
                                    <AddressStep
                                        form={form}
                                        onNext={nextStep}
                                        onBack={() => setStep(0)} // Specific back to Region
                                        apiEndpoint="/api/be/address" // BE Proxy
                                        countryCode="BE"
                                        placeholder="Ex: Rue de la Loi 16, 1000 Bruxelles"
                                        coordinates={coordinates}
                                        setCoordinates={setCoordinates}
                                    />
                                )}

                                {step === 2 && (
                                    <ConsumptionStep
                                        form={form}
                                        onBack={() => setStep(1)}
                                        loading={loading}
                                    />
                                )}
                                {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded">{error}</p>}
                            </form>
                        </Form>
                    )}

                    {step === 3 && result && (
                        <ResultStep
                            result={result}
                            address={form.getValues("address")}
                            countryCode="BE"
                            region={region}
                            monthlyBill={form.getValues("monthlyBill")}
                        />
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
