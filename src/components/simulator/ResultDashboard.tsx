"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, CartesianGrid, ReferenceLine } from "recharts";
import { Info, Sun, Zap, PiggyBank, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming standard UI tooltips exist or standard approach
import { cn } from "@/lib/utils";

import { calculateFinancialProjection, type SimulationResult } from "@/lib/engine";

interface ResultDashboardProps {
    result: SimulationResult;
    monthlyBill: number;
}

// --- Helper: Animated Number ---
function Counter({ value, currency = false }: { value: number; currency?: boolean }) {
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const rounded = useTransform(spring, (latest) => Math.round(latest));

    useEffect(() => {
        animate(spring, value);
    }, [spring, value]);

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
        return calculateFinancialProjection({
            result,
            monthlyBill,
            inflationRate,
            years: 25
        });
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
            {/* 1. HERO METRICS (ROI & NET GAIN) - 2 Big Cards */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ROI Indicator */}
                <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none shadow-lg overflow-hidden relative min-h-[140px] flex flex-col justify-center">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <TrendingUp className="w-24 h-24" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-emerald-100 font-medium uppercase tracking-wider mb-2 text-sm">Rentabilité (ROI)</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{result.roiYears}</span>
                            <span className="text-xl font-normal opacity-90">ans</span>
                        </div>
                        <p className="text-emerald-50 text-sm mt-2 opacity-80">Votre installation est remboursée en {result.roiYears} ans.</p>
                    </CardContent>
                </Card>

                {/* Net Benefit */}
                <Card className="bg-white border-slate-200 shadow-md min-h-[140px] flex flex-col justify-center">
                    <CardContent className="p-6">
                        <p className="text-slate-500 font-medium uppercase tracking-wider mb-2 text-sm">Gain Net (25 ans)</p>
                        <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 tracking-tight">
                            <Counter value={data.netBenefit} currency />
                        </div>
                        <p className="text-slate-400 text-sm mt-2">Bénéfice total estimé impôts déduits.</p>
                    </CardContent>
                </Card>
            </motion.div>


            {/* 2. MAIN CHART (Cashflow Evolution) */}
            <motion.div variants={itemVars}>
                <Card className="shadow-lg border-slate-100">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                                    <PiggyBank className="w-6 h-6 text-brand" />
                                    Rentabilité & Cashflow
                                </h3>
                                <p className="text-slate-500 mt-1">Évolution de votre solde financier cumulé année après année.</p>
                            </div>

                            {/* Legend */}
                            <div className="flex gap-6 text-sm font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                                    <span className="text-slate-700">Solde Cumulé (Cashflow)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-0.5 bg-slate-400" />
                                    <span className="text-slate-700">Seuil de Rentabilité (0€)</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                {/* @ts-ignore */}
                                <AreaChart data={data.yearlyData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="year"
                                        type="number"
                                        domain={[0, 25]}
                                        tickCount={6}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        dy={10}
                                        label={{ value: 'Années', position: 'insideBottomRight', offset: -5 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(val) => `${val / 1000}k€`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: any) => [
                                            `${value.toLocaleString()} €`,
                                            "Solde Cumulé"
                                        ]}
                                        labelFormatter={(label) => `Année ${label}`}
                                    />
                                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />

                                    <Area
                                        type="monotone"
                                        dataKey="cumulativeCashflow"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCashflow)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Inflation Slider */}
                        <div className="flex items-center justify-center gap-4 max-w-lg mx-auto bg-slate-50 py-2 px-4 rounded-full border border-slate-100">
                            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Inflation Élec.</span>
                            <Slider
                                value={[inflationRate]}
                                onValueChange={(vals) => setInflationRate(vals[0])}
                                max={10}
                                step={0.5}
                                className="w-48"
                            />
                            <span className="text-sm font-bold text-brand w-12 text-center">{inflationRate}%</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div >


            {/* 3. TECHNICAL BAR (Horizontal Grid Info) */}
            < motion.div variants={itemVars} >
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-slate-100">
                    {/* ... (Existing Tech Bar Content) ... */}
                    <div className="flex flex-col items-center text-center px-4">
                        <div className="text-slate-400 mb-2"><Zap className="w-6 h-6" /></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Puissance</p>
                        <p className="text-2xl font-bold text-slate-900">{result.systemSize} kWc</p>
                    </div>

                    <div className="flex flex-col items-center text-center px-4 border-l md:border-l-0 border-slate-100">
                        <div className="text-amber-400 mb-2"><Sun className="w-6 h-6" /></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Production</p>
                        <p className="text-2xl font-bold text-slate-900">{result.annualProduction.toLocaleString()} kWh</p>
                    </div>

                    <div className="flex flex-col items-center text-center px-4 mt-6 md:mt-0">
                        <div className="text-emerald-500 mb-2"><TrendingUp className="w-6 h-6" /></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Économies / an</p>
                        <p className="text-2xl font-bold text-emerald-600">{result.annualSavings.toLocaleString()} €</p>
                    </div>

                    <div className="flex flex-col items-center text-center px-4 mt-6 md:mt-0 border-l border-slate-100">
                        <div className="text-slate-400 mb-2"><DollarSign className="w-6 h-6" /></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Coût Net Est.</p>
                        <p className="text-2xl font-bold text-slate-900">{result.netCost.toLocaleString()} €</p>
                    </div>
                </div>
            </motion.div >

            {/* 4. RECOMMENDATION / NOTES (DEBUG) */}
            {
                result.details.recommendation && (
                    <motion.div variants={itemVars}>
                        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex gap-4 items-start">
                            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-amber-900 mb-2">Analyse de notre expert</h4>
                                <p className="text-amber-800 whitespace-pre-wrap text-sm leading-relaxed">
                                    {result.details.recommendation}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </motion.div >
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
