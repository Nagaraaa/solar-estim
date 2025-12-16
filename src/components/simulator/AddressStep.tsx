import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
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
    const debouncedAddress = useDebounce(inputValue, 500);

    // Sync local input with form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        const value = e.target.value;
        setInputValue(value);
        fieldChange(value);
        // Reset coordinates on manual type to force selection
        setCoordinates({});
    };

    // Fetch suggestions
    useEffect(() => {
        const fetchAddress = async () => {
            if (debouncedAddress.length > 3) {
                try {
                    // Logic differs slightly: FR uses full URL, BE might need custom params
                    // But we can standardize: apiEndpoint should be the base.
                    // FR: https://api-adresse.data.gouv.fr/search/?q=...&limit=5
                    // BE: /api/be/address?q=...

                    let url = "";
                    if (countryCode === "FR") {
                        url = `${apiEndpoint}/search/?q=${encodeURIComponent(debouncedAddress)}&limit=5`;
                    } else {
                        url = `${apiEndpoint}?q=${encodeURIComponent(debouncedAddress)}`;
                    }

                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        // Standardization: FR returns data.features, BE proxy returns array directly
                        const features = countryCode === "FR" ? (data.features || []) : (data || []);
                        setSuggestions(features);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error("Address fetch error", err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        fetchAddress();
    }, [debouncedAddress, apiEndpoint, countryCode]);

    const handleSelectAddress = (feature: any, fieldChange: (value: string) => void) => {
        const label = feature.properties.label;
        const [lon, lat] = feature.geometry.coordinates;

        fieldChange(label);
        setInputValue(label);
        form.setValue("address", label);
        setCoordinates({ lat, lon });
        setShowSuggestions(false);
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
                                className={cn("pl-10 h-12 text-lg", !coordinates.lat && field.value.length > 5 ? "border-amber-500 focus-visible:ring-amber-500" : "")}
                                {...field}
                                value={inputValue} // Controlled by local state for smoother typing
                                onChange={(e) => handleInputChange(e, field.onChange)}
                                autoComplete="off"
                            />
                        </div>
                    </FormControl>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-60 overflow-auto">
                            {suggestions.map((feature: any) => (
                                <div
                                    key={feature.properties.id || Math.random()}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 text-sm md:text-base text-slate-700"
                                    onClick={() => handleSelectAddress(feature, field.onChange)}
                                >
                                    <MapPin className="h-4 w-4 text-brand shrink-0" />
                                    <span>{feature.properties.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <FormMessage />
                    {!coordinates.lat && field.value.length > 5 && (
                        <p className="text-sm text-amber-600 font-medium mt-1">
                            ⚠️ Veuillez sélectionner une adresse dans la liste.
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
