"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Oups ! Une erreur est survenue.</h2>
            <p className="text-slate-600 mb-8 max-w-md">
                Désolé, nous avons rencontré un problème technique inattendu.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.href = "/"} variant="outline">
                    Retour à l'accueil
                </Button>
                <Button onClick={() => reset()} variant="brand">
                    Réessayer
                </Button>
            </div>
        </div>
    );
}
