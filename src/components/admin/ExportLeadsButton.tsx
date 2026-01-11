'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Lead {
    id: number;
    created_at: string;
    nom: string;
    email: string;
    telephone: string;
    ville: string;
    code_postal?: string;
    system_size?: number;
    // Add other fields as needed
    details?: any;
}

interface ExportLeadsButtonProps {
    leads: Lead[];
}

export function ExportLeadsButton({ leads }: ExportLeadsButtonProps) {

    const handleExport = () => {
        if (!leads || leads.length === 0) {
            alert("Aucun lead à exporter.");
            return;
        }

        // 1. Define CSV Headers
        const headers = [
            "Date",
            "Nom",
            "Email",
            "Téléphone",
            "Ville",
            "CP",
            "Taille Système (kWc)",
            "Adresse Complète"
        ];

        // 2. Format DataRows
        const rows = leads.map(lead => {
            const date = new Date(lead.created_at).toLocaleDateString("fr-FR");
            const address = lead.details?.address?.label || "";

            // Handle CSV injection and special chars
            const safe = (str: string | number | undefined) => {
                if (str === undefined || str === null) return "";
                const s = String(str).replace(/"/g, '""'); // Escape double quotes
                return `"${s}"`; // Wrap in quotes
            };

            return [
                safe(date),
                safe(lead.nom),
                safe(lead.email),
                safe(lead.telephone),
                safe(lead.ville),
                safe(lead.code_postal),
                safe(lead.system_size || 0),
                safe(address)
            ].join(",");
        });

        // 3. Combine with BOM for Excel UTF-8 compatibility
        const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");

        // 4. Trigger Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `solar_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
        </Button>
    );
}
