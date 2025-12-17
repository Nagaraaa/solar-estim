"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Info, Sun, Zap, PiggyBank, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming standard UI tooltips exist or standard approach
import { cn } from "@/lib/utils";

// --- Types ---
interface SimulationResult {
    systemSize: number; // kWc
    annualProduction: number; // kWh
    annualSavings: number; // €
    roiYears: number; // years
    totalCost: number; // €
}

interface ResultDashboardProps {
    result: SimulationResult;
    monthlyBill: number; // needed for "Without Solar" baseline
}

// --- Helper: Animated Number ---
function Counter({ value, currency = false }: { value: number; currency?: boolean }) {
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const rounded = useTransform(spring, (latest) => Math.round(latest));

    useEffect(() => {
        animate(spring, value);
    }, [spring, value]);

    // Format output manually to avoid heavy Intl hooks if not needed, or use Intl
    // Using a simple display component to read the MotionValue
    return (
        <motion.span className="tabular-nums">
            {useTransform(rounded, (latest) =>
                currency
                    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(latest)
                    : latest.toLocaleString('fr-FR')
            )}
        </motion.span>
    );
}


export function ResultDashboard({ result, monthlyBill }: ResultDashboardProps) {
    const [inflationRate, setInflationRate] = useState(4); // Default 4%

    // --- Calculations ---
    const data = useMemo(() => {
        const years = 25;
        let cumulativeWithout = 0;
        let cumulativeWith = result.totalCost; // Starts with installation cost

        // Annual Bill without solar (approximated)
        // If monthlyBill is provided, use it. If not, infer from savings/0.25 logic or similar? 
        // We really need monthlyBill.
        const startBill = monthlyBill * 12;

        for (let i = 1; i <= years; i++) {
            // Factor for specific year: (1 + rate)^(i-1)
            // Year 1: No inflation yet (or base). Year 2: +Inflation.
            const inflationFactor = Math.pow(1 + inflationRate / 100, i - 1);

            const billForYear = startBill * inflationFactor;
            const savingsForYear = result.annualSavings * inflationFactor;

            cumulativeWithout += billForYear;

            // "With Solar" cost = Install Cost + (Bill - Savings)
            // If Savings > Bill, this term is negative (profit/surplus income)
            cumulativeWith += (billForYear - savingsForYear);
        }

        return {
            cumulativeWithout: Math.round(cumulativeWithout),
            cumulativeWith: Math.round(cumulativeWith),
            netBenefit: Math.round(cumulativeWithout - cumulativeWith)
        };
    }, [result, monthlyBill, inflationRate]);

    // Determine Chart Domains for Stability
    // We lock the domain so the bars don't jump around wildly.
    const maxValue = Math.max(data.cumulativeWithout, data.cumulativeWith, 1000);
    const minValue = Math.min(0, data.cumulativeWith);

    // Derived for display
    const chartDisplayWith = Math.max(0, data.cumulativeWith);
    // Actually, let's keep 'data' clean and do logic inside useMemo properly or mapping.
    // The previous code returned an object.

    // Let's refactor the return:

    /*
            const realCumulativeWith = cumulativeWith;
            
            return {
                cumulativeWithout: Math.round(cumulativeWithout),
                cumulativeWith: Math.max(0, Math.round(cumulativeWith)), // Visual clamp
                netBenefit: Math.round(cumulativeWithout - realCumulativeWith) // Real benefit
            };
    */


    // Data for Chart (Simple 2-bar comparison)
    const chartData = [
        {
            name: "Sans Solaire",
            amount: data.cumulativeWithout,
            fill: "#f87171", // Red-400
        },
        {
            name: "Avec Solaire",
            amount: data.cumulativeWith,
            fill: "#10b981", // Emerald-500
        },
    ];

    // Variants for stagger animation
    const containerVars: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVars: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
    };

    return (
        <motion.div
            className="space-y-8 w-full"
            variants={containerVars}
            initial="hidden"
            animate="show"
        >
            {/* 1. HEADER SCORECARD */}
            <motion.div variants={itemVars}>
                <Card className="border-none shadow-lg bg-gradient-to-br from-white to-slate-50 overflow-hidden relative">
                    {/* Background decorative blob */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

                    <CardContent className="p-8 text-center relative z-10">
                        <p className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">Bénéfice Net sur 25 ans</p>
                        <div className="text-5xl md:text-6xl font-black text-emerald-600 tracking-tight mb-4 drop-shadow-sm">
                            <Counter value={data.netBenefit} currency />
                        </div>

                        <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>Retour sur investissement : {result.roiYears} ans</span>
                        </div>

                        {/* Print Button */}
                        <div className="absolute top-4 right-4 z-20 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="p-2 bg-white/50 hover:bg-white rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                                title="Imprimer / Sauvegarder en PDF"
                            >
                                <span className="text-xl">🖨️</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* 2. CHART & SLIDER SECTION */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Chart Card */}
                <Card className="md:col-span-2 shadow-lg border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <PiggyBank className="w-5 h-5 text-brand" />
                                Comparatif Coûts (25 ans)
                            </h3>
                            {/* Legend */}
                            <div className="flex gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-red-400" /> Sans Solaire
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500" /> Avec Solaire
                                </div>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide domain={[minValue, maxValue]} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`${value.toLocaleString()} €`, 'Coût Total']}
                                    />
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Inflation Control Card */}
                <Card className="shadow-lg border-slate-100 bg-slate-50/50">
                    <CardContent className="p-6 flex flex-col justify-center h-full space-y-6">
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-1">
                                <label className="text-sm font-bold text-slate-700">Hausse électricité</label>
                                <span className="text-sm font-bold text-brand bg-brand/10 px-2 py-0.5 rounded w-fit">{inflationRate}% / an</span>
                            </div>
                            <Slider
                                value={[inflationRate]}
                                onValueChange={(vals) => setInflationRate(vals[0])}
                                max={10}
                                step={0.5}
                                className="my-4"
                            />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Le prix de l'électricité augmente historiquement. Ajustez ce taux pour voir l'impact sur vos économies futures.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-500">Sans Solaire</span>
                                <span className="font-semibold text-slate-700 whitespace-nowrap">{data.cumulativeWithout.toLocaleString()} €</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-500">Avec Solaire</span>
                                <span className="font-semibold text-emerald-600 whitespace-nowrap">{data.cumulativeWith.toLocaleString()} €</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>


            {/* 3. DETAILS GRID */}
            <motion.div variants={itemVars} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailCard
                    icon={<Sun className="w-5 h-5 text-amber-500" />}
                    label="Production annuelle"
                    value={`${result.annualProduction} kWh`}
                    tooltip="Estimation basée sur les données PVGIS de la Commission Européenne pour votre toiture."
                />
                <DetailCard
                    icon={<Zap className="w-5 h-5 text-blue-500" />}
                    label="Puissance"
                    value={`${result.systemSize} kWc`}
                    tooltip="La puissance crête de votre installation (nombre de panneaux x puissance unitaire)."
                />
                <DetailCard
                    icon={<DollarSign className="w-5 h-5 text-slate-500" />}
                    label="Coût Installation"
                    value={`${result.totalCost.toLocaleString()} €`}
                    tooltip="Estimation moyenne du marché. Le devis final peut varier selon les contraintes techniques."
                />
                <DetailCard
                    icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                    label="Économies / an"
                    value={`${result.annualSavings.toLocaleString()} €`}
                    tooltip="Économie sur votre facture dès la première année (hors inflation)."
                />
            </motion.div>
        </motion.div>
    );
}

function DetailCard({ icon, label, value, tooltip }: { icon: React.ReactNode; label: string; value: string; tooltip: string }) {
    return (
        <TooltipProvider delayDuration={300}>
            <UITooltip>
                <TooltipTrigger asChild>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-help hover:shadow-md transition-shadow">
                        <div className="mb-2 p-2 bg-slate-50 rounded-full">{icon}</div>
                        <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                            {label}
                            <Info className="w-3 h-3 opacity-50" />
                        </div>
                        <div className="text-lg font-bold text-slate-800">{value}</div>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs">
                    {tooltip}
                </TooltipContent>
            </UITooltip>
        </TooltipProvider>
    );
}
