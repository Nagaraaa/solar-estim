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
    coordinates: { lat?: number, lon?: number, countryCode?: "FR" | "BE" };
    setCoordinates: (coords: { lat?: number, lon?: number, countryCode?: "FR" | "BE" }) => void;
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

    // Fetch suggestions (via internal Proxy)
    useEffect(() => {
        const fetchAddress = async () => {
            if (debouncedAddress.length > 2) { // Nominatim allows shorter queries
                setIsLoading(true);
                try {
                    // Use internal proxy to handle CORS and Country filtering
                    const url = `/api/address?q=${encodeURIComponent(debouncedAddress)}&country=${countryCode}`;

                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        // Nominatim returns an array directly
                        setSuggestions(data || []);
                        setShowSuggestions((data && data.length > 0));
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
    }, [debouncedAddress, countryCode, coordinates.lat]);

    const handleSelectAddress = (item: any, fieldChange: (value: string) => void) => {
        // Nominatim fields
        const label = item.display_name;
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);

        // Try to get specific zip/city for cleaner input if desired, 
        // but 'display_name' is safer for the full context.
        // We can create a cleaner label: "City (Zip)" using address details
        let cleanLabel = label;
        if (item.address) {
            const city = item.address.city || item.address.town || item.address.village || item.address.municipality;
            const postcode = item.address.postcode;
            if (city && postcode) {
                // If we have precise data, we can prefer a shorter label, 
                // but the user might want to see the full context to be sure.
                // Reverting to `display_name` as it's the most robust generic "address".
                // But specifically for "Zip or City" input, the user might prefer seeing "Namur, 5000"
                // Let's stick to display_name for the 'value' but maybe we can store zipCode if form supports it.
            }

            // OPTIONAL: Set zipCode in form if the field exists (not strictly required by prompt but good for data quality)
            if (postcode) {
                form.setValue("zipCode", postcode);
            }
        }

        // Detect country code from response (Nominatim returns country_code="fr" or "be" usually)
        let detectedCountry: "FR" | "BE" = countryCode || "FR";
        if (item.address && item.address.country_code) {
            const cc = item.address.country_code.toUpperCase();
            if (cc === "FR" || cc === "BE") {
                detectedCountry = cc;
            }
        }

        fieldChange(cleanLabel);
        setInputValue(cleanLabel);
        // Important: Update form 'address' field
        form.setValue("address", cleanLabel);
        setCoordinates({ lat, lon, countryCode: detectedCountry });
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
                <FormItem className="relative">
                    <FormLabel>Code Postal ou Ville</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder={countryCode === "BE" ? "Ex: Namur, 5000, Liège..." : "Ex: Bordeaux, 33000, Lyon..."}
                                className={cn("pl-10 pr-10 h-12 text-lg", !coordinates.lat && field.value.length > 3 && !isLoading ? "border-amber-500 focus-visible:ring-amber-500" : "")}
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
                            {suggestions.map((item: any) => (
                                <div
                                    key={item.place_id || Math.random()}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 text-sm md:text-base text-slate-700 transition-colors"
                                    onClick={() => handleSelectAddress(item, field.onChange)}
                                >
                                    <MapPin className="h-4 w-4 text-brand shrink-0" />
                                    <span>{item.display_name}</span>
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
