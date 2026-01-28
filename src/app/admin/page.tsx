'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users,
    MapPin,
    Search,
    Eye,
    Loader2,
    Trash2,
    AlertTriangle,
    Copy,
    Check
} from 'lucide-react';
import { deleteLead } from "@/app/actions/deleteLead";
import { cn } from "@/lib/utils";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExportLeadsButton } from "@/components/admin/ExportLeadsButton";

// Types
interface Lead {
    id: number;
    created_at: string;
    nom: string;
    email: string;
    telephone: string;
    ville: string;
    code_postal?: string;
    pays: string;
    puissance_kwc: number;
    economie_estimee_an: number;
    statut: string;
    ev_modele?: string;
    ev_conso?: number;
}

// Helper Helpers
const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                setCopied(true);
            } else {
                // Fallback for HTTP / Non-Secure
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    setCopied(true);
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }
                document.body.removeChild(textArea);
            }
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-blue-400 group"
            title="Copier"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
};

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!leadToDelete) return;
        setIsDeleting(true);

        const res = await deleteLead(leadToDelete.id);

        if (res.success) {
            setLeads(leads.filter(l => l.id !== leadToDelete.id));
            setLeadToDelete(null);
            if (selectedLead?.id === leadToDelete.id) setSelectedLead(null);
        } else {
            alert(res.error || "Erreur de suppression");
        }
        setIsDeleting(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabaseBrowser
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching leads:", error);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    // KPIs
    const totalLeads = leads.length;
    const leadsBE = leads.filter(l => l.pays?.includes('Belgique')).length;
    const leadsFR = leads.filter(l => l.pays === 'France').length;

    // Graph Data (Last 14 days)
    const getChartData = () => {
        const last14Days = [...Array(14)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            return d.toISOString().split('T')[0];
        });

        return last14Days.map(date => ({
            date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            leads: leads.filter(l => l.created_at.startsWith(date)).length
        }));
    };

    // Helper: Clean city name (City, Zip, Country)
    const formatAddress = (fullAddress: string, pays: string) => {
        if (!fullAddress) return "-";
        // Attempt to parse: "123 Rue, City, Zip, Country" -> "City, Zip, Country"
        // Since input is free text, we try our best.
        // Actually user said: "ne garde que Ville, Code Postal, Pays"
        // Let's rely on the comma splits.
        const parts = fullAddress.split(',').map(p => p.trim());
        // Heuristic: If we have > 2 parts, likely [Street, City, Zip, Country] etc.
        // Simple fallback: just return the full string but cleaner?
        // Let's try to extract standard components if possible or just show the string.
        // Strategy: "Mcon, 71250, France" seems to be the goal.
        // For the table, we want a concise representation.
        // If the address contains a zip code (e.g., "City, 12345"), we can try to extract it.
        // For simplicity, let's try to get the last two parts if they look like City, Zip.
        // Or just the city if it's a simple string.
        if (parts.length >= 2) {
            // Try to find a part that looks like a zip code
            const zipPart = parts.find(p => /^\d{4,5}$/.test(p));
            if (zipPart) {
                const cityPart = parts.find(p => p !== zipPart && p !== pays && !/^\d/.test(p));
                if (cityPart) {
                    return `${cityPart}, ${zipPart}`;
                }
            }
        }
        // Fallback to just the first part (city) or the full string if it's short
        return parts[0] || fullAddress;
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        // Format: 09 Jan. 2026  00h59
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(':', 'h');
    };

    const getCountryFlag = (pays: string) => {
        if (!pays) return "";
        const p = pays.toLowerCase();
        if (p.includes('belgique') || p.includes('belgium')) return "🇧🇪";
        if (p.includes('france')) return "🇫🇷";
        return "";
    };

    // Filtered Leads
    const filteredLeads = leads.filter(l =>
        l.nom?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.ville?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                    <a href="/" target="_blank" className="text-xs font-medium text-slate-400 hover:text-brand flex items-center gap-1 border border-slate-700 rounded px-2 py-1 bg-slate-800 hover:bg-slate-700 transition-colors">
                        <Users className="w-3 h-3" />
                        Retour au site
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <ExportLeadsButton leads={filteredLeads} />
                    <Button
                        onClick={fetchLeads}
                        className="bg-brand text-slate-900 hover:bg-yellow-400 font-bold shadow-lg shadow-brand/20 transition-all hover:scale-105"
                        size="sm"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Rafraîchir
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLeads}</div>
                        <p className="text-xs text-slate-500">+100% (Départ)</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Répartition BE</CardTitle>
                        <MapPin className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadsBE}</div>
                        <p className="text-xs text-slate-500">Belgique (Wallonie/Bxl)</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Répartition FR</CardTitle>
                        <MapPin className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadsFR}</div>
                        <p className="text-xs text-slate-500">France</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader>
                    <CardTitle className="text-white">Nouveaux Leads (14 derniers jours)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip />
                            <Line type="monotone" dataKey="leads" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle className="text-white">Leads Récents</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Rechercher (Nom, Ville)..."
                                className="pl-8 bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-brand"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Mobile View: Cards */}
                    <div className="md:hidden space-y-4">
                        {loading && (
                            <div className="text-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand" />
                            </div>
                        )}
                        {!loading && filteredLeads.length === 0 && (
                            <div className="text-center p-8 text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800">
                                Aucun lead trouvé.
                            </div>
                        )}

                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden transition-all active:scale-[0.99]">
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLeadToDelete(lead);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="mb-4 pr-10">
                                    <p className="text-xs font-mono text-slate-500 mb-1">{formatDate(lead.created_at)}</p>
                                    <h3 className="text-lg font-bold text-white leading-tight truncate">{lead.nom}</h3>
                                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2 truncate">
                                        <span className="text-lg">{getCountryFlag(lead.pays)}</span>
                                        {formatAddress(lead.ville, lead.pays)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-center">
                                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Puissance</p>
                                        <Badge variant="outline" className="bg-slate-900 text-slate-200 border-slate-700">{lead.puissance_kwc} kWc</Badge>
                                    </div>
                                    <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-center">
                                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Gain estimé</p>
                                        <p className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/30 py-0.5 px-2 rounded inline-block">
                                            {Math.round(lead.economie_estimee_an)} €<span className="text-xs opacity-70">/an</span>
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-brand text-slate-900 font-bold hover:bg-yellow-400 border-none h-11"
                                    onClick={() => setSelectedLead(lead)}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir la fiche complète
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block rounded-md border border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-950/50">
                                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400">Nom</TableHead>
                                    <TableHead className="text-slate-400">Ville</TableHead>
                                    <TableHead className="text-slate-400">Puissance</TableHead>
                                    <TableHead className="text-slate-400">Économie/an</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && (
                                    <TableRow className="border-slate-800">
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand" />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!loading && filteredLeads.length === 0 && (
                                    <TableRow className="border-slate-800">
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                            Aucun lead trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filteredLeads.map((lead) => (
                                    <TableRow key={lead.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="font-medium text-xs text-nowrap text-slate-300">
                                            {formatDate(lead.created_at)}
                                        </TableCell>
                                        <TableCell className="text-slate-200">{lead.nom}</TableCell>
                                        <TableCell className="text-slate-200">
                                            <span className="mr-2 text-lg">{getCountryFlag(lead.pays)}</span>
                                            {/* Just showing city for table compactness, full address in modal */}
                                            {formatAddress(lead.ville, lead.pays)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{lead.puissance_kwc} kWc</Badge>
                                        </TableCell>
                                        <TableCell className="text-green-600 font-bold">
                                            {Math.round(lead.economie_estimee_an)} €
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Détails
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLeadToDelete(lead);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Helpers Modal */}
            <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
                <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-white">Détails du Lead {selectedLead?.nom}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Saisi le {selectedLead && formatDate(selectedLead.created_at)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLead && (
                        <div className="grid gap-3 py-4 overflow-y-auto max-h-[70vh]">
                            <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 border-b border-slate-800 pb-2 sm:border-none sm:pb-0">
                                <span className="font-bold text-slate-500 text-xs uppercase sm:text-base sm:capitalize">Nom</span>
                                <span className="col-span-2 text-slate-200 text-lg font-semibold">{selectedLead.nom}</span>
                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 border-b border-slate-800 pb-2 sm:border-none sm:pb-0">
                                <span className="font-bold text-slate-500 text-xs uppercase sm:text-base sm:capitalize">Email</span>
                                <div className="col-span-2 flex items-center gap-2 min-w-0">
                                    <span className="truncate text-blue-400 underline decoration-blue-400/30" title={selectedLead.email}>{selectedLead.email}</span>
                                    <CopyButton text={selectedLead.email} />
                                </div>
                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                <span className="font-bold text-slate-500 text-xs uppercase sm:text-base sm:capitalize">Téléphone</span>
                                <div className="col-span-2 flex items-center gap-2">
                                    <a href={`tel:${selectedLead.telephone}`} className="font-mono text-xl font-bold text-brand hover:underline">
                                        {selectedLead.telephone}
                                    </a>
                                    <CopyButton text={selectedLead.telephone} />
                                </div>
                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 border-b border-slate-800 pb-2 sm:border-none sm:pb-0">
                                <span className="font-bold text-slate-500 text-xs uppercase sm:text-base sm:capitalize">Adresse</span>
                                <span className="col-span-2 text-slate-200">
                                    {formatAddress(selectedLead.ville, selectedLead.pays)}{selectedLead.code_postal && !selectedLead.ville?.includes(selectedLead.code_postal) ? `, ${selectedLead.code_postal}` : ''}
                                </span>
                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 border-b border-slate-800 pb-2 sm:border-none sm:pb-0">
                                <span className="font-bold text-slate-500 text-xs uppercase sm:text-base sm:capitalize">Pays</span>
                                <span className="col-span-2 text-slate-200">{selectedLead.pays}</span>
                            </div>



                            {/* Self-Consumption & Battery Badge */}
                            {(selectedLead as any).taux_autoconsommation && (
                                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 border-b border-slate-800 pb-2 sm:border-none sm:pb-0">
                                    <span className="font-bold text-slate-500 text-xs uppercase sm:text-base sm:capitalize">Autoconso</span>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span className="font-semibold text-slate-200">{(selectedLead as any).taux_autoconsommation}</span>
                                        {parseInt((selectedLead as any).taux_autoconsommation) < 50 && (
                                            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-[10px] h-5">
                                                Potentiel Batterie élevé
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* EV Info Block */}
                            {selectedLead.ev_modele && (
                                <div className="mt-4 bg-blue-950/30 border border-blue-900/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400">
                                            {/* Car Icon inline */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H12c-.6 0-1.2.9-1.2 1.3 0 .4.6 1.7.6 1.7S8.7 9.4 7.2 9.1c-1.5-.3-2.2 2.9-2.2 2.9v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Véhicule Électrique</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase mb-1">Modèle</p>
                                            <p className="text-slate-200 font-medium text-sm">{selectedLead.ev_modele}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase mb-1">Impact Conso</p>
                                            <p className="text-slate-200 font-medium text-sm">~{selectedLead.ev_conso?.toLocaleString() ?? '?'} kWh/an</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <hr className="my-2 border-slate-800" />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Puissance</p>
                                    <p className="font-bold text-2xl text-white font-mono">{selectedLead.puissance_kwc} <span className="text-sm text-slate-500">kWc</span></p>
                                </div>
                                <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
                                    <p className="text-xs text-emerald-500 uppercase font-bold tracking-wider mb-1">Éco / An</p>
                                    <p className="font-bold text-2xl text-emerald-400 font-mono">{Math.round(selectedLead.economie_estimee_an)} €</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
                <DialogContent className="max-w-sm bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le lead de <strong>{leadToDelete?.nom}</strong> ?
                            <br />
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            onClick={() => setLeadToDelete(null)}
                            disabled={isDeleting}
                            className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
