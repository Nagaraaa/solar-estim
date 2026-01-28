"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSolarSimulation } from "@/hooks/useSolarSimulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SimulatorProgressBar } from "@/components/simulator/SimulatorProgressBar";
import { AddressStep } from "@/components/simulator/AddressStep";
import { ConsumptionStep } from "@/components/simulator/ConsumptionStep";
import { ResultStep } from "@/components/simulator/ResultStep";
import { cn } from "@/lib/utils";

// Form Schema
const formSchema = z.object({
    address: z.string().min(5, "L'adresse doit être valide"),
    monthlyBill: z.coerce.number().min(30, "La facture mensuelle semble trop basse.").max(1000, "La facture semble très élevée."),
    hasEv: z.boolean().default(false).optional(),
    evModel: z.string().optional(),
    ev_model_name: z.string().optional(),
    evDistance: z.coerce.number().optional().default(15000),
    ev_kwh_estimated: z.number().optional()
});

export default function SimulatorPage() {
    const searchParams = useSearchParams();
    const evKwhParam = searchParams.get('ev_kwh');
    const evModelNameParam = searchParams.get('ev_model_name') || searchParams.get('ev_model'); // Fallback
    const evIdParam = searchParams.get('ev_id');
    const evDistanceParam = searchParams.get('ev_distance');

    const [step, setStep] = useState(1);
    const { calculate, loading, isCalculating, error, result, recalculate } = useSolarSimulation();
    const [coordinates, setCoordinates] = useState<{ lat?: number; lon?: number; countryCode?: "FR" | "BE" }>({ countryCode: "FR" });

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            monthlyBill: 0,
            hasEv: !!evIdParam, // Auto-enable if ID is present
            evModel: evIdParam || undefined,
            ev_model_name: evModelNameParam || undefined,
            evDistance: evDistanceParam ? parseFloat(evDistanceParam) : 15000,
            ev_kwh_estimated: evKwhParam ? parseFloat(evKwhParam) : 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const success = await calculate({
            ...values,
            ...coordinates,
            ev_kwh: values.ev_kwh_estimated || (evKwhParam ? parseFloat(evKwhParam) : undefined),
            ev_model: values.ev_model_name || evModelNameParam || undefined
        });
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

    return (
        <div className={cn("container mx-auto px-4 py-12 md:py-20 w-full", step < 3 ? "max-w-2xl" : "max-w-[1600px]")}>
            {/* Progress Bar */}
            <SimulatorProgressBar currentStep={step} />

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
                    {step < 3 && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {step === 1 && (
                                    <AddressStep
                                        form={form}
                                        onNext={nextStep}
                                        apiEndpoint="https://api-adresse.data.gouv.fr"
                                        countryCode={coordinates.countryCode}
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
                            countryCode="FR"
                            monthlyBill={form.getValues("monthlyBill")}
                            recalculate={recalculate}
                            isCalculating={isCalculating}
                            simulationError={error}
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
