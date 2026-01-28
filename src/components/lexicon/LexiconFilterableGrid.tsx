'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Term {
    slug: string;
    term: string;
    shortDefinition: string;
    category?: string;
}

interface LexiconFilterableGridProps {
    terms: Term[];
    country: 'FR' | 'BE';
}

export function LexiconFilterableGrid({ terms, country }: LexiconFilterableGridProps) {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 1. Filtered List Logic (for Grid)
    const filteredTerms = useMemo(() => {
        if (!query) return terms;
        const lowerQuery = query.toLowerCase();
        return terms.filter(t =>
            t.term.toLowerCase().includes(lowerQuery) ||
            t.shortDefinition.toLowerCase().includes(lowerQuery)
        );
    }, [query, terms]);

    // 2. Suggestions Logic (for Dropdown)
    const suggestions = useMemo(() => {
        if (query.length < 2) return [];
        return filteredTerms.slice(0, 5); // Top 5 matches
    }, [query, filteredTerms]);

    const prefix = country === 'BE' ? '/be/lexique' : '/lexique';

    return (
        <div className="space-y-12">
            {/* SEARCH SECTION */}
            <div className="relative max-w-2xl mx-auto z-10">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Rechercher un terme (ex: Onduleur, V2G...)"
                        className="pl-10 h-14 text-lg shadow-sm border-slate-200 focus:ring-2 focus:ring-brand/20 transition-all rounded-xl"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                    />
                </div>

                {/* PREDICTIVE DROPDOWN */}
                {showSuggestions && suggestions.length > 0 && query.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {suggestions.map((s) => (
                            <Link
                                key={s.slug}
                                href={`${prefix}/${s.slug}`}
                                className="block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-700">{s.term}</span>
                                    {s.category === 'mobility' && (
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] uppercase tracking-wider">
                                            Mobilité
                                        </Badge>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* RESULTS GRID */}
            {filteredTerms.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {filteredTerms.map((term) => (
                        <Link key={term.slug} href={`${prefix}/${term.slug}`} className="group h-full">
                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-brand/50 relative overflow-hidden">
                                {term.category === 'mobility' && (
                                    <div className="absolute top-0 right-0 p-3">
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-sm text-white font-semibold gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            Nouveau
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl mb-2 group-hover:text-brand transition-colors pr-16 leading-tight">
                                        {term.term}
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 line-clamp-3">
                                        {term.shortDefinition}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-lg">Aucun terme ne correspond à votre recherche.</p>
                    <button
                        onClick={() => setQuery("")}
                        className="text-brand font-medium hover:underline mt-2"
                    >
                        Tout afficher
                    </button>
                </div>
            )}
        </div>
    );
}
