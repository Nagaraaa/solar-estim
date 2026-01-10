"use client";

import { ResultDashboard } from "./ResultDashboard";
import { SimulationResult } from "@/lib/engine";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorResultsProps {
    result: SimulationResult;
    monthlyBill: number;
    isBusy?: boolean;
}

export function SimulatorResults({ result, monthlyBill, isBusy }: SimulatorResultsProps) {
    return (
        <div className="relative">
            {/* Loading Overlay */}
            {isBusy && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl transition-all duration-300">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-brand" />
                        <span className="text-sm font-medium text-slate-600">Calcul en cours...</span>
                    </div>
                </div>
            )}

            <div className={cn("transition-all duration-300", isBusy ? "blur-[2px]" : "")}>
                <ResultDashboard result={result} monthlyBill={monthlyBill} />
            </div>
        </div>
    );
}
