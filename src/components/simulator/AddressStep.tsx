import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface AddressStepProps {
    form: UseFormReturn<any>;
    onNext: () => void;
    onBack?: () => void; // Optional back button (used in BE for region selection)
    apiEndpoint: string; // URL for the address API
    countryCode?: "FR" | "BE";
    placeholder?: string;
    coordinates: { lat?: number, lon?: number };
    setCoordinates: (coords: { lat?: number, lon?: number }) => void;
}

export function AddressStep({
    form,
    onNext,
    onBack,
    apiEndpoint,
    countryCode = "FR",
    placeholder = "Ex: 10 rue de la Paix, 75001 Paris",
    coordinates,
    setCoordinates
}: AddressStepProps) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(form.getValues("address") || "");
    const [isLoading, setIsLoading] = useState(false);

    // Reduce debounce to 300ms for snappier feel
    const debouncedAddress = useDebounce(inputValue, 300);

    // Sync local input with form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        const value = e.target.value;
        setInputValue(value);
        fieldChange(value);
        // Reset coordinates on manual type to force selection
        setCoordinates({});
        setShowSuggestions(false);
    };

    // Fetch suggestions
    useEffect(() => {
        const fetchAddress = async () => {
            if (debouncedAddress.length > 3) {
                setIsLoading(true);
                try {
                    let url = "";
                    if (countryCode === "FR") {
                        url = `${apiEndpoint}/search/?q=${encodeURIComponent(debouncedAddress)}&limit=5`;
                    } else {
                        url = `${apiEndpoint}?q=${encodeURIComponent(debouncedAddress)}`;
                    }

                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        const features = countryCode === "FR" ? (data.features || []) : (data || []);
                        setSuggestions(features);
                        setShowSuggestions(features.length > 0);
                    } else {
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                } catch (err) {
                    console.error("Address fetch error", err);
                    setSuggestions([]);
                    setShowSuggestions(false);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
                setIsLoading(false);
            }
        };

        // Only fetch if we don't have coords yet (user is searching)
        if (!coordinates.lat) {
            fetchAddress();
        }
    }, [debouncedAddress, apiEndpoint, countryCode, coordinates.lat]);

    const handleSelectAddress = (feature: any, fieldChange: (value: string) => void) => {
        const label = feature.properties.label;
        const [lon, lat] = feature.geometry.coordinates;

        fieldChange(label);
        setInputValue(label);
        form.setValue("address", label);
        setCoordinates({ lat, lon });
        setShowSuggestions(false);
        setSuggestions([]); // Clear suggestions
    };

    return (
        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
                <FormItem className="relative">
                    <FormLabel>Adresse complète {countryCode === "BE" && "(Belgique)"}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder={placeholder}
                                className={cn("pl-10 pr-10 h-12 text-lg", !coordinates.lat && field.value.length > 5 && !isLoading ? "border-amber-500 focus-visible:ring-amber-500" : "")}
                                {...field}
                                value={inputValue}
                                onChange={(e) => handleInputChange(e, field.onChange)}
                                autoComplete="off"
                            />
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-3 h-5 w-5 text-brand animate-spin" />
                            )}
                        </div>
                    </FormControl>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                            {suggestions.map((feature: any) => (
                                <div
                                    key={feature.properties.id || Math.random()}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 text-sm md:text-base text-slate-700 transition-colors"
                                    onClick={() => handleSelectAddress(feature, field.onChange)}
                                >
                                    <MapPin className="h-4 w-4 text-brand shrink-0" />
                                    <span>{feature.properties.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <FormMessage />
                    {/* Only show warning if NOT loading and user has typed enough but no coords selected */}
                    {!coordinates.lat && field.value.length > 5 && !isLoading && !showSuggestions && (
                        <p className="text-sm text-amber-600 font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                            ⚠️ Veuillez sélectionner une adresse dans la liste. <br />
                            <span className="text-xs font-normal text-slate-500">(Tapez lentement pour voir les suggestions)</span>
                        </p>
                    )}

                    <div className={cn("mt-4", onBack ? "flex gap-4" : "")}>
                        {onBack && (
                            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-12">
                                Retour
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={() => {
                                if (coordinates.lat && coordinates.lon) {
                                    onNext();
                                } else {
                                    form.setError("address", { message: "Veuillez sélectionner une adresse valide dans la liste déroulante." });
                                }
                            }}
                            className={cn("h-12 text-lg", onBack ? "flex-1" : "w-full")}
                        >
                            Suivant
                        </Button>
                    </div>
                </FormItem>
            )}
        />
    );
}
