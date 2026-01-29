"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CountrySelector } from "../ui/CountrySelector";

import { CITIES_FR } from "@/app/(site)/villes/cities";
import { CITIES as CITIES_BE } from "@/app/(site)/be/villes/cities";

interface FooterProps {
    detectedCountry?: string;
    detectedCity?: string;
}

export function Footer({ detectedCountry, detectedCity }: FooterProps) {
    const pathname = usePathname();
    // Simple check: if path starts with /be, we are in Belgium context
    const isBePath = pathname?.startsWith('/be') ?? false;

    // Determine context: Path overrides IP detection for content consistency
    // But for "Suggested Cities", if we are on generic pages (home), we might want to follow IP?
    // Let's stick to Path for consistency, but if on Root (/), use IP.
    const isHome = pathname === '/';
    const effectiveIsBe = isBePath || (isHome && detectedCountry === 'BE');

    const simulatorLink = effectiveIsBe ? '/be/simulateur' : '/simulateur';
    const citiesLink = effectiveIsBe ? '/be/villes' : '/villes';
    const citiesLabel = effectiveIsBe ? "Nos villes en Belgique" : "Nos villes en France";

    // Smart City Suggestion
    // 1. Get relevant list
    const relevantCities = effectiveIsBe ? CITIES_BE : CITIES_FR;

    // 2. Try to find the detected city or reasonable defaults (Biggest cities)
    // We'll show 5 cities. 
    // If detected city is found, show it + 4 randoms from same region.
    // Otherwise show Top 5 fixed (to avoid hydration mismatch with randoms, we must be deterministic or use useEffect)
    // Client Component -> We can rely on stable props.

    // Simplification: Display "Top Cities" statically for now to avoid complexity + "Your City" if found.
    const topCities = effectiveIsBe
        ? ['Liège', 'Namur', 'Charleroi', 'Bruxelles', 'Mons']
        : ['Toulouse', 'Montpellier', 'Bordeaux', 'Lyon', 'Marseille'];

    const suggestedCities = relevantCities.filter(c => topCities.includes(c.name));

    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-8 text-slate-600">
            <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Column 1: Brand & Desc */}
                <div className="space-y-4">
                    <Link href={effectiveIsBe ? "/be" : "/"} className="flex items-center gap-2">
                        <Image
                            src="/images/logo2.png"
                            alt="Logo Solar Estim"
                            width={160}
                            height={45}
                            className="h-9 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <p className="text-sm leading-relaxed mb-4 max-w-xs">
                        Le simulateur solaire nouvelle génération.
                        Étude précise et indépendante en 2 min.
                    </p>
                    <div className="flex">
                        <CountrySelector variant="footer" />
                    </div>
                </div>

                {/* Column 2: Navigation */}
                <div>
                    <p className="font-semibold text-slate-900 mb-4">Navigation</p>
                    <ul className="space-y-2 text-sm">
                        <li><Link href={effectiveIsBe ? "/be" : "/"} className="hover:text-brand transition-colors">Accueil</Link></li>
                        <li><Link href={simulatorLink} className="hover:text-brand transition-colors">Simulateur Solaire</Link></li>
                        <li><Link href="/a-propos" className="hover:text-brand transition-colors">Pourquoi SolarEstim ?</Link></li>
                        <li><Link href={effectiveIsBe ? "/be/blog" : "/blog"} className="hover:text-brand transition-colors">Actualités PV</Link></li>
                    </ul>
                </div>

                {/* Column 3: Ressources */}
                <div>
                    <p className="font-semibold text-slate-900 mb-4">Ressources</p>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href={effectiveIsBe ? "/be/guide/comprendre-le-solaire" : "/guide/comprendre-le-solaire"} className="hover:text-brand transition-colors font-medium text-slate-900">
                                Guide Solaire 2026
                            </Link>
                        </li>
                        <li><Link href={effectiveIsBe ? "/be/lexique" : "/lexique"} className="hover:text-brand transition-colors">Lexique Solaire</Link></li>
                        <li>
                            <Link href={effectiveIsBe ? "/be/comparateur" : "/comparateur"} className="hover:text-brand transition-colors">
                                Comparateur Technique
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Zones d'intervention ONLY (SEO) */}
                <div>
                    <p className="font-semibold text-slate-900 mb-4">Zones d'intervention</p>
                    <ul className="space-y-2 text-sm">
                        <li><Link href={citiesLink} className="font-medium text-brand hover:underline">{citiesLabel}</Link></li>
                        {suggestedCities.map(city => (
                            <li key={city.slug}>
                                <Link href={`${citiesLink}/${city.slug}`} className="hover:text-brand transition-colors text-slate-500">
                                    Panneaux solaires {city.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* Bottom Bar: Copyright + Legal Links */}
            <div className="container mx-auto px-4 mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                <div>
                    &copy; 2026 Solar Estim. Tous droits réservés.
                </div>
                <div className="flex gap-6">
                    <Link href="/mentions-legales" className="hover:text-slate-600 transition-colors">Mentions Légales</Link>
                    <Link href="/politique-confidentialite" className="hover:text-slate-600 transition-colors">Confidentialité</Link>
                    <Link href="/contact" className="hover:text-slate-600 transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
