"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Turnstile } from "@marsidev/react-turnstile";

interface ResultLockProps {
    mainResult: React.ReactNode; // The big number (e.g. "1200€ / an")
    hiddenContent: React.ReactNode; // The blurred details
    onUnlock: (email: string) => void;
}

export function ResultLock({ mainResult, hiddenContent, onUnlock }: ResultLockProps) {
    const [email, setEmail] = useState("");
    const [isLocked, setIsLocked] = useState(true);
    const [consent, setConsent] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && consent && token) {
            setIsLocked(false);
            onUnlock(email);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-brand border-2">
                <CardHeader>
                    <CardTitle className="text-center text-primary">Résultat Estimé</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="text-4xl font-bold text-success mb-2">{mainResult}</div>
                    <p className="text-muted-foreground">d'économies potentielles par an</p>
                </CardContent>
            </Card>

            <div className="relative overflow-hidden rounded-xl border border-slate-200">
                <div className={isLocked ? "blur-md select-none pointer-events-none opacity-50 transition-all duration-700" : ""}>
                    {hiddenContent}
                </div>

                {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10 p-6">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-slate-100 ring-1 ring-slate-900/5">
                            <div className="flex justify-center mb-4">
                                <div className="bg-brand/20 p-3 rounded-full">
                                    <Lock className="h-6 w-6 text-brand-foreground" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-center mb-2">Débloquez votre étude complète</h3>
                            <p className="text-center text-sm text-slate-500 mb-6">
                                Entrez votre email pour voir le détail du dimensionnement, le coût estimé et la liste des installateurs RGE qualifiés.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email professionnel ou personnel</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="jean.dupont@exemple.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-start space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                                        required
                                    />
                                    <label
                                        htmlFor="consent"
                                        className="text-xs text-slate-500 leading-tight cursor-pointer"
                                    >
                                        J'accepte d'être recontacté pour mon étude solaire et je confirme avoir lu la <a href="/politique-confidentialite" className="text-brand underline underline-offset-2 hover:text-brand/80" target="_blank">Politique de Confidentialité</a>.
                                    </label>
                                </div>

                                <div className="flex justify-center">
                                    <Turnstile
                                        siteKey={process.env.NODE_ENV === "development" ? "1x00000000000000000000AA" : (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "")}
                                        onSuccess={(token) => setToken(token)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="brand"
                                    className="w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!consent || !token}
                                >
                                    Voir mon étude gratuite
                                </Button>
                            </form>
                            <p className="text-xs text-center text-slate-400 mt-4">
                                Vos données sont sécurisées. Pas de SPAM.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

