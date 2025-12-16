import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorProgressBarProps {
    currentStep: number;
    totalSteps?: number;
    stepLabels?: string[]; // Optional: for future use if we want labels under steps
}

export function SimulatorProgressBar({ currentStep, totalSteps = 3 }: SimulatorProgressBarProps) {
    // Calculate progress width percentage
    // If step 1 (start), width 0. If step 2, width 50%. If step 3, width 100%.
    // This assumes 3 main steps (1, 2, 3). Adjust logic if steps differ.
    // For 3 steps: 
    // Step 1: 0%
    // Step 2: 50%
    // Step 3: 100%
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const clampedProgress = Math.min(Math.max(progressPercentage, 0), 100);

    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="mb-12 relative flex justify-between items-center px-2">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2" />

            {/* Active Progress Line */}
            <div
                className="absolute top-1/2 left-0 h-1 bg-brand -z-10 -translate-y-1/2 transition-all duration-300 ease-out"
                style={{ width: `${clampedProgress}%` }}
            />

            {/* Step Circles */}
            {steps.map((s) => (
                <div
                    key={s}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white font-bold transition-all duration-300",
                        currentStep >= s ? "border-brand text-slate-900 scale-110" : "border-slate-200 text-slate-400"
                    )}
                >
                    {currentStep > s ? <CheckCircle2 className="h-6 w-6 text-brand" /> : s}
                </div>
            ))}
        </div>
    );
}
