import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Confidentialité | SolarEstim",
    description: "Protection de vos données personnelles et conformité RGPD sur SolarEstim.com.",
    robots: {
        index: false, // Often privacy pages are noindex to save crawl budget, or indexable. User didn't specify, but indexable is standard unless duplicate. Let's keep it simple.
        follow: true,
    }
};

export default function PolitiqueConfidentialite() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 prose prose-slate max-w-4xl bg-white rounded-xl shadow-sm my-8">
            <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

            <p className="lead">
                Chez SolarEstim, la confidentialité de vos données est une priorité.
                Cette politique vise à vous informer en toute transparence sur les données que nous collectons,
                leur utilisation et vos droits, conformément au Règlement Général sur la Protection des Données (RGPD)
                et aux législations en vigueur en France et en Belgique.
            </p>

            <div className="mt-8 space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">1. Les Données que nous collectons</h2>
                    <p>
                        Dans le cadre de l'utilisation de notre simulateur solaire, nous sommes amenés à collecter les informations suivantes :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Identité et Contact :</strong> Nom, Numéro de téléphone, Adresse e-mail.</li>
                        <li><strong>Données Géographiques :</strong> Code postal et Ville (pour déterminer l'ensoleillement et la réglementation locale).</li>
                        <li><strong>Données Énergétiques :</strong> Montant de votre facture d'électricité ou consommation annuelle (pour dimensionner l'installation).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">2. Pourquoi nous collectons vos données (Finalité)</h2>
                    <p>
                        Vos données ne sont utilisées que dans deux buts précis :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>
                            <strong>Fournir votre étude personnalisée :</strong> Calculer le potentiel solaire de votre toiture et votre rentabilité financière.
                        </li>
                        <li>
                            <strong>Mise en relation (avec votre accord) :</strong> Uniquement si vous souhaitez recevoir des devis, nous transmettons vos coordonnées à nos partenaires certifiés :
                            <ul className="list-circle pl-5 mt-1 text-sm text-slate-600">
                                <li>En France : Installateurs certifiés <strong>RGE</strong> (Reconnu Garant de l'Environnement).</li>
                                <li>En Belgique : Installateurs certifiés <strong>RESCert</strong>.</li>
                            </ul>
                        </li>
                    </ul>
                    <p className="mt-2 text-sm text-slate-500 italic">
                        Nous ne revendons pas vos données à des tiers non pertinents ou pour de la prospection massive.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">3. Stockage et Sécurité</h2>
                    <p>
                        Vos données sont stockées de manière sécurisée sur nos serveurs et outils de gestion (hébergement sécurisé, base de données chiffrée, et Google Sheets avec accès restreint).
                        Nous mettons en œuvre des mesures techniques pour protéger vos informations contre tout accès non autorisé.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">4. Vos Droits (RGPD)</h2>
                    <p>
                        Conformément à la réglementation européenne, vous disposez des droits suivants sur vos données :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Droit d'accès :</strong> Savoir quelles données nous détenons sur vous.</li>
                        <li><strong>Droit de rectification :</strong> Corriger des informations erronées.</li>
                        <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données de nos fichiers.</li>
                    </ul>
                    <p className="mt-4">
                        Pour exercer ces droits, il vous suffit de nous envoyer un simple email à : <a href="mailto:contact@solarestim.com" className="text-brand font-medium underline">contact@solarestim.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">5. Gestion des Cookies</h2>
                    <p>
                        Notre site utilise un nombre très limité de cookies, purement techniques :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>
                            <strong>Cookie de préférence Pays :</strong> Un petit fichier texte qui nous permet de mémoriser si vous naviguez sur la version France ou Belgique du site, pour vous afficher les bonnes informations (aides, tarifs, etc.).
                        </li>
                        <li>
                            Ces cookies ne sont pas utilisés à des fins de traçage publicitaire invasif.
                        </li>
                    </ul>
                </section>

                <div className="border-t border-slate-200 pt-6 mt-8">
                    <p className="text-sm text-slate-500">
                        Dernière mise à jour : 20/01/2026
                    </p>
                </div>
            </div>
        </div>
    );
}
