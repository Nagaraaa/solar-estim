"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Euro, Shield, Save, CheckCircle, Loader2 } from "lucide-react";
import { fetchSettings, updateSettings } from "@/actions/settings";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchSettings();
                setSettings(data);
            } catch (e) {
                console.error("Failed to load settings", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData(event.currentTarget);
            await updateSettings(formData);

            // Re-fetch locally to be sure (optional if we trust optimistic)
            const updated = await fetchSettings();
            setSettings(updated);

            // Show Toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (e) {
            console.error("Save failed", e);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[50vh] text-slate-400">Chargement...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto md:p-8 relative">

            {/* Simple Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Paramètres enregistrés avec succès !
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Paramètres</h1>
                    <p className="text-slate-400 mt-2">
                        Gérez les configurations globales du simulateur et votre profil administrateur.
                    </p>
                </div>
                <Button
                    type="submit"
                    disabled={saving}
                    className="bg-brand text-slate-900 hover:bg-brand/90 font-bold shadow-lg shadow-brand/20 min-w-[160px]"
                >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? "Sauvegarde..." : "Enregistrer tout"}
                </Button>
            </div>

            <div className="grid gap-8">
                {/* 1. Configuration Énergie */}
                <Card className="border-slate-800 bg-slate-900/50 shadow-sm backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Zap className="w-5 h-5 text-amber-500" />
                            </div>
                            <CardTitle className="text-white">Configuration Énergie</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400">
                            Définissez les prix du kWh et les tarifs de rachat pour les simulations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="price-kwh-fr" className="text-slate-300">Prix du kWh (France) - €</Label>
                                <Input
                                    name="price-kwh-fr" id="price-kwh-fr"
                                    type="number" step="0.0001" placeholder="0.2516"
                                    defaultValue={settings['FR_ELECTRICITY_PRICE']}
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="buyback-fr" className="text-slate-300">Rachat Surplus (France) - €/kWh</Label>
                                <Input
                                    name="buyback-fr" id="buyback-fr"
                                    type="number" step="0.0001" placeholder="0.1297"
                                    defaultValue={settings['FR_SURPLUS_RESALE']}
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="price-kwh-be" className="text-slate-300">Prix du kWh (Belgique) - €</Label>
                                <Input
                                    name="price-kwh-be" id="price-kwh-be"
                                    type="number" step="0.0001" placeholder="0.3800"
                                    defaultValue={settings['BE_ELECTRICITY_PRICE']}
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="prosumer-be" className="text-slate-300">Tarif Prosumer Moyen - €/kWe</Label>
                                <Input
                                    name="prosumer-be" id="prosumer-be"
                                    type="number" step="0.01" placeholder="76.00"
                                    defaultValue={settings['BE_PROSUMER_TAX']}
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Gestion des Primes */}
                <Card className="border-slate-800 bg-slate-900/50 shadow-sm backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Euro className="w-5 h-5 text-emerald-500" />
                            </div>
                            <CardTitle className="text-white">Gestion des Primes</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400">
                            Ajustez les montants des aides gouvernementales (France & Belgique).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                <span className="w-6 h-4 rounded bg-blue-600 inline-block"></span> France (Prime à l'autoconsommation)
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prime-fr-3kw" className="text-slate-300">Install. ≤ 3 kWc (€/kWc)</Label>
                                    <Input
                                        name="prime-fr-3kw" id="prime-fr-3kw"
                                        type="number" placeholder="300"
                                        defaultValue={settings['FR_PRIME_AUTOCONSO_3KW']}
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prime-fr-9kw" className="text-slate-300">Install. ≤ 9 kWc (€/kWc)</Label>
                                    <Input
                                        name="prime-fr-9kw" id="prime-fr-9kw"
                                        type="number" placeholder="230"
                                        defaultValue={settings['FR_PRIME_AUTOCONSO_9KW']}
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prime-fr-36kw" className="text-slate-300">Install. ≤ 36 kWc (€/kWc)</Label>
                                    <Input
                                        name="prime-fr-36kw" id="prime-fr-36kw"
                                        type="number" placeholder="200"
                                        defaultValue={settings['FR_PRIME_AUTOCONSO_36KW']}
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-800 my-2" />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                <span className="w-6 h-4 rounded bg-gradient-to-r from-black via-yellow-400 to-red-600 inline-block border border-slate-700"></span> Belgique
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prime-be-wal" className="text-slate-300">Wallonie (Prime Domotique ?)</Label>
                                    <Input id="prime-be-wal" type="text" placeholder="Entrer montant ou statut" disabled defaultValue="Suspendue" className="bg-slate-950/50 border-slate-800 text-slate-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prime-be-bru" className="text-slate-300">Bruxelles (Certificats Verts)</Label>
                                    <Input
                                        name="prime-be-bru" id="prime-be-bru"
                                        type="number" placeholder="65"
                                        defaultValue={settings['BE_GREEN_CERTS_BRU']}
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Profil & Sécurité */}
                <Card className="border-slate-800 bg-slate-900/50 shadow-sm backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <Shield className="w-5 h-5 text-slate-400" />
                            </div>
                            <CardTitle className="text-white">Profil & Sécurité</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400">
                            Gérez vos informations de connexion administrateur.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="email-contact" className="text-slate-300">Email de contact</Label>
                                <Input
                                    name="email-contact" id="email-contact"
                                    type="email" placeholder="admin@solarestim.com"
                                    defaultValue={settings['ADMIN_CONTACT_EMAIL']?.replace(/"/g, '')} // remove quotes from json string
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                />
                            </div>
                            <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="new-password" className="text-slate-300">Nouveau mot de passe</Label>
                                    <Input id="new-password" type="password" className="bg-slate-950 border-slate-800 text-white focus-visible:ring-brand" />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="confirm-password" className="text-slate-300">Confirmer le mot de passe</Label>
                                    <Input id="confirm-password" type="password" className="bg-slate-950 border-slate-800 text-white focus-visible:ring-brand" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="outline" type="button" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 border-red-900/30">
                                Déconnecter toutes les sessions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
