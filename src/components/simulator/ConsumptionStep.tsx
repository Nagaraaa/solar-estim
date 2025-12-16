import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Euro, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ConsumptionStepProps {
    form: UseFormReturn<any>;
    onBack: () => void;
    loading: boolean;
}

export function ConsumptionStep({ form, onBack, loading }: ConsumptionStepProps) {
    return (
        <FormField
            control={form.control}
            name="monthlyBill"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Montant de votre facture d'électricité (mensuel)</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Euro className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <Input
                                type="number"
                                placeholder="Ex: 150"
                                className="pl-10 h-12 text-lg"
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                    <FormMessage />
                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="w-full sm:flex-1 h-12"
                        >
                            Retour
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:flex-1 h-12 bg-brand text-slate-900 font-bold hover:bg-brand/90"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Calculer ma rentabilité"}
                        </Button>
                    </div>
                </FormItem>
            )}
        />
    );
}
