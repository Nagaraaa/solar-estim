'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, HelpCircle } from "lucide-react";
import { importVehicles } from '@/app/actions/importVehicles';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ImportVehiclesButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.set('file', file);

        try {
            const res = await importVehicles(formData);
            setResult(res);
            if (res.success) {
                // Clear input
                if (fileInputRef.current) fileInputRef.current.value = "";
                // Auto close after success? Maybe wait for user to see result.
            }
        } catch (err) {
            setResult({ success: false, error: "Erreur inattendue." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setResult(null); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-dashed border-slate-300 text-slate-600 hover:border-brand hover:text-brand">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Importer des véhicules</DialogTitle>
                    <DialogDescription>
                        Ajoutez plusieurs véhicules en une fois via un fichier CSV.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm space-y-2">
                        <p className="font-semibold flex items-center gap-2 text-slate-700">
                            <FileText className="w-4 h-4" />
                            Format attendu (CSV) :
                        </p>
                        <code className="block bg-slate-900 text-slate-50 p-2 rounded text-xs overflow-x-auto whitespace-pre">
                            Marque,Modèle,Conso,Facteur,Batterie,Efficience,V2G<br />
                            Renault,5 E-Tech,15.2,1.15,52.0,0.88,✅
                        </code>
                        <p className="text-xs text-slate-500">
                            Séparateur : virgule. Ligne d'en-tête ignorée.
                        </p>
                    </div>

                    {!loading && !result && (
                        <div className="flex justify-center">
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full" disabled={loading}>
                                <Upload className="mr-2 h-4 w-4" />
                                Sélectionner un fichier CSV
                            </Button>
                            <input
                                type="file"
                                accept=".csv,.txt"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-4 space-y-2 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin text-brand" />
                            <p>Importation en cours...</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            {result.success ? (
                                <Alert className="bg-green-50 text-green-800 border-green-200">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertTitle>Succès !</AlertTitle>
                                    <AlertDescription>
                                        {result.count} véhicules importés avec succès.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Erreur</AlertTitle>
                                    <AlertDescription>
                                        {result.error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {result.details && result.details.length > 0 && (
                                <div className="max-h-32 overflow-y-auto bg-slate-100 p-2 rounded text-xs font-mono text-slate-600">
                                    {result.details.map((d: string, i: number) => (
                                        <div key={i}>{d}</div>
                                    ))}
                                </div>
                            )}

                            <Button onClick={() => { setOpen(false); setResult(null); }} variant="outline" className="w-full">
                                Fermer
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
