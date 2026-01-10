export interface City {
    name: string;
    slug: string;
    zip: string;
    zone: "Sud" | "Ouest" | "Nord" | "Est";
}

export const CITIES_FR: City[] = [
    { name: "Toulouse", slug: "toulouse", zip: "31000", zone: "Sud" },
    { name: "Marseille", slug: "marseille", zip: "13000", zone: "Sud" },
    { name: "Lyon", slug: "lyon", zip: "69000", zone: "Sud" },
    { name: "Montpellier", slug: "montpellier", zip: "34000", zone: "Sud" },
    { name: "Nice", slug: "nice", zip: "06000", zone: "Sud" },
    { name: "Nantes", slug: "nantes", zip: "44000", zone: "Ouest" },
    { name: "Bordeaux", slug: "bordeaux", zip: "33000", zone: "Sud" },
    { name: "Toulon", slug: "toulon", zip: "83000", zone: "Sud" },
    { name: "Nîmes", slug: "nimes", zip: "30000", zone: "Sud" },
    { name: "Aix-en-Provence", slug: "aix-en-provence", zip: "13100", zone: "Sud" },
    { name: "Perpignan", slug: "perpignan", zip: "66000", zone: "Sud" },
    { name: "Avignon", slug: "avignon", zip: "84000", zone: "Sud" },
    { name: "Valence", slug: "valence", zip: "26000", zone: "Sud" },
    { name: "Béziers", slug: "beziers", zip: "34500", zone: "Sud" },
    { name: "Narbonne", slug: "narbonne", zip: "11100", zone: "Sud" },
    { name: "Carcassonne", slug: "carcassonne", zip: "11000", zone: "Sud" },
    { name: "Montélimar", slug: "montelimar", zip: "26200", zone: "Sud" },
    { name: "Pau", slug: "pau", zip: "64000", zone: "Sud" },
    { name: "Bayonne", slug: "bayonne", zip: "64100", zone: "Sud" },
    { name: "La Rochelle", slug: "la-rochelle", zip: "17000", zone: "Ouest" },
    { name: "Strasbourg", slug: "strasbourg", zip: "67000", zone: "Est" },
    { name: "Lille", slug: "lille", zip: "59000", zone: "Nord" },
    { name: "Rennes", slug: "rennes", zip: "35000", zone: "Ouest" },
    { name: "Reims", slug: "reims", zip: "51100", zone: "Nord" },
    { name: "Saint-Étienne", slug: "saint-etienne", zip: "42000", zone: "Est" },
    { name: "Le Havre", slug: "le-havre", zip: "76600", zone: "Nord" },
    { name: "Grenoble", slug: "grenoble", zip: "38000", zone: "Sud" },
    { name: "Dijon", slug: "dijon", zip: "21000", zone: "Est" },
    { name: "Angers", slug: "angers", zip: "49000", zone: "Ouest" },
    { name: "Saint-Denis", slug: "saint-denis", zip: "93200", zone: "Nord" },
    { name: "Villeurbanne", slug: "villeurbanne", zip: "69100", zone: "Sud" },
    { name: "Clermont-Ferrand", slug: "clermont-ferrand", zip: "63000", zone: "Sud" },
    { name: "Le Mans", slug: "le-mans", zip: "72000", zone: "Ouest" },
    { name: "Brest", slug: "brest", zip: "29200", zone: "Ouest" },
    { name: "Tours", slug: "tours", zip: "37000", zone: "Ouest" },
    { name: "Amiens", slug: "amiens", zip: "80000", zone: "Nord" },
    { name: "Limoges", slug: "limoges", zip: "87000", zone: "Ouest" },
    { name: "Annecy", slug: "annecy", zip: "74000", zone: "Est" },
    { name: "Metz", slug: "metz", zip: "57000", zone: "Est" },
    { name: "Besançon", slug: "besancon", zip: "25000", zone: "Est" },
    { name: "Orléans", slug: "orleans", zip: "45000", zone: "Nord" },
    { name: "Mulhouse", slug: "mulhouse", zip: "68100", zone: "Est" },
    { name: "Rouen", slug: "rouen", zip: "76000", zone: "Nord" },
    { name: "Caen", slug: "caen", zip: "14000", zone: "Nord" },
    { name: "Nancy", slug: "nancy", zip: "54000", zone: "Est" },
    { name: "Argenteuil", slug: "argenteuil", zip: "95100", zone: "Nord" },
    { name: "Montreuil", slug: "montreuil", zip: "93100", zone: "Nord" },
    { name: "Roubaix", slug: "roubaix", zip: "59100", zone: "Nord" },
    { name: "Dunkerque", slug: "dunkerque", zip: "59140", zone: "Nord" },
    { name: "Poitiers", slug: "poitiers", zip: "86000", zone: "Ouest" },
];

export function getCityBySlug(slug: string): City | undefined {
    return CITIES_FR.find((city) => city.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCitySlugs(): string[] {
    return CITIES_FR.map((city) => city.slug);
}
