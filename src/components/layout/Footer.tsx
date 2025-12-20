"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CountrySelector } from "../ui/CountrySelector";

export function Footer() {
    const pathname = usePathname();
    // Simple check: if path starts with /be, we are in Belgium context
    const isBe = pathname?.startsWith('/be') ?? false;
    const simulatorLink = isBe ? '/be/simulateur' : '/simulateur';

    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-600">
            <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <Link href={isBe ? "/be" : "/"} className="flex items-center gap-2">
                        <Image
                            src="/images/logo2.png"
                            alt="Logo Solar Estim"
                            width={180}
                            height={50}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <p className="text-sm leading-relaxed mb-4">
                        Le simulateur solaire nouvelle génération.
                        Obtenez une étude précise et indépendante en quelques clics.
                    </p>
                    <div className="flex">
                        <CountrySelector variant="footer" />
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href={isBe ? "/be" : "/"} className="hover:text-brand transition-colors">Accueil</Link></li>
                        <li><Link href={simulatorLink} className="hover:text-brand transition-colors">Simulateur Solaire</Link></li>
                        <li><Link href="/a-propos" className="hover:text-brand transition-colors">Pourquoi SolarEstim ?</Link></li>
                        <li><Link href="/blog" className="hover:text-brand transition-colors">Actualités PV</Link></li>
                        <li><Link href="/lexique" className="hover:text-brand transition-colors">Lexique Solaire</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Légal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/mentions-legales" className="hover:text-brand transition-colors">Mentions Légales</Link></li>
                        <li><Link href="/politique-confidentialite" className="hover:text-brand transition-colors">Politique de Confidentialité</Link></li>
                        <li><Link href="/mentions-legales" className="hover:text-brand transition-colors">CGU</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Projet ?</h4>
                    <p className="text-sm mb-4">
                        Vous êtes installateur {isBe ? "RESCert" : "RGE"} ? Rejoignez notre réseau de partenaires certifiés.
                    </p>
                    <Link href="/contact" className="text-sm font-bold text-brand hover:underline">
                        Contactez-nous &rarr;
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                &copy; 2025 Solar Estim. Tous droits réservés.
            </div>
        </footer>
    );
}
