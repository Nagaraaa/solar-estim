import Link from "next/link";
import { Sun } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-600">
            <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-brand" />
                        <span className="font-bold text-slate-900">Solar-Estim</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Le simulateur solaire nouvelle génération.
                        Obtenez une étude précise et indépendante en quelques clics.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-brand transition-colors">Accueil</Link></li>
                        <li><Link href="/simulateur" className="hover:text-brand transition-colors">Simulateur Solaire</Link></li>
                        <li><Link href="/blog" className="hover:text-brand transition-colors">Actualités PV</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Légal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/mentions-legales" className="hover:text-brand transition-colors">Mentions Légales</Link></li>
                        <li><Link href="/mentions-legales" className="hover:text-brand transition-colors">Confidentialité</Link></li>
                        <li><Link href="/mentions-legales" className="hover:text-brand transition-colors">CGU</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Projet ?</h4>
                    <p className="text-sm mb-4">
                        Vous êtes installateur RGE ? Rejoignez notre réseau de partenaires certifiés.
                    </p>
                    <Link href="/contact" className="text-sm font-bold text-brand hover:underline">
                        Contactez-nous &rarr;
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Solar-Estim. Tous droits réservés.
            </div>
        </footer>
    );
}
