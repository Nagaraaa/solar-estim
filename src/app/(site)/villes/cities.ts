export interface City {
    name: string;
    slug: string;
    zip: string;
    zone: "Sud" | "Ouest" | "Nord" | "Est";
    department: string;
    sunshineHours: number;
}

export const CITIES_FR: City[] = [
    { name: "Toulouse", slug: "toulouse", zip: "31000", zone: "Sud", department: "Haute-Garonne", sunshineHours: 2050 },
    { name: "Marseille", slug: "marseille", zip: "13000", zone: "Sud", department: "Bouches-du-Rhône", sunshineHours: 2850 },
    { name: "Lyon", slug: "lyon", zip: "69000", zone: "Sud", department: "Rhône", sunshineHours: 2000 },
    { name: "Montpellier", slug: "montpellier", zip: "34000", zone: "Sud", department: "Hérault", sunshineHours: 2650 },
    { name: "Nice", slug: "nice", zip: "06000", zone: "Sud", department: "Alpes-Maritimes", sunshineHours: 2700 },
    { name: "Nantes", slug: "nantes", zip: "44000", zone: "Ouest", department: "Loire-Atlantique", sunshineHours: 1800 },
    { name: "Bordeaux", slug: "bordeaux", zip: "33000", zone: "Sud", department: "Gironde", sunshineHours: 2050 },
    { name: "Toulon", slug: "toulon", zip: "83000", zone: "Sud", department: "Var", sunshineHours: 2800 },
    { name: "Nîmes", slug: "nimes", zip: "30000", zone: "Sud", department: "Gard", sunshineHours: 2650 },
    { name: "Aix-en-Provence", slug: "aix-en-provence", zip: "13100", zone: "Sud", department: "Bouches-du-Rhône", sunshineHours: 2850 },
    { name: "Perpignan", slug: "perpignan", zip: "66000", zone: "Sud", department: "Pyrénées-Orientales", sunshineHours: 2500 },
    { name: "Avignon", slug: "avignon", zip: "84000", zone: "Sud", department: "Vaucluse", sunshineHours: 2800 },
    { name: "Valence", slug: "valence", zip: "26000", zone: "Sud", department: "Drôme", sunshineHours: 2200 },
    { name: "Béziers", slug: "beziers", zip: "34500", zone: "Sud", department: "Hérault", sunshineHours: 2600 },
    { name: "Narbonne", slug: "narbonne", zip: "11100", zone: "Sud", department: "Aude", sunshineHours: 2550 },
    { name: "Carcassonne", slug: "carcassonne", zip: "11000", zone: "Sud", department: "Aude", sunshineHours: 2150 },
    { name: "Montélimar", slug: "montelimar", zip: "26200", zone: "Sud", department: "Drôme", sunshineHours: 2400 },
    { name: "Pau", slug: "pau", zip: "64000", zone: "Sud", department: "Pyrénées-Atlantiques", sunshineHours: 1900 },
    { name: "Bayonne", slug: "bayonne", zip: "64100", zone: "Sud", department: "Pyrénées-Atlantiques", sunshineHours: 1950 },
    { name: "La Rochelle", slug: "la-rochelle", zip: "17000", zone: "Ouest", department: "Charente-Maritime", sunshineHours: 2100 },
    { name: "Strasbourg", slug: "strasbourg", zip: "67000", zone: "Est", department: "Bas-Rhin", sunshineHours: 1650 },
    { name: "Lille", slug: "lille", zip: "59000", zone: "Nord", department: "Nord", sunshineHours: 1600 },
    { name: "Rennes", slug: "rennes", zip: "35000", zone: "Ouest", department: "Ille-et-Vilaine", sunshineHours: 1750 },
    { name: "Reims", slug: "reims", zip: "51100", zone: "Nord", department: "Marne", sunshineHours: 1700 },
    { name: "Saint-Étienne", slug: "saint-etienne", zip: "42000", zone: "Est", department: "Loire", sunshineHours: 1950 },
    { name: "Le Havre", slug: "le-havre", zip: "76600", zone: "Nord", department: "Seine-Maritime", sunshineHours: 1650 },
    { name: "Grenoble", slug: "grenoble", zip: "38000", zone: "Sud", department: "Isère", sunshineHours: 2000 },
    { name: "Dijon", slug: "dijon", zip: "21000", zone: "Est", department: "Côte-d'Or", sunshineHours: 1850 },
    { name: "Angers", slug: "angers", zip: "49000", zone: "Ouest", department: "Maine-et-Loire", sunshineHours: 1800 },
    { name: "Saint-Denis", slug: "saint-denis", zip: "93200", zone: "Nord", department: "Seine-Saint-Denis", sunshineHours: 1650 },
    { name: "Villeurbanne", slug: "villeurbanne", zip: "69100", zone: "Sud", department: "Rhône", sunshineHours: 2000 },
    { name: "Clermont-Ferrand", slug: "clermont-ferrand", zip: "63000", zone: "Sud", department: "Puy-de-Dôme", sunshineHours: 1900 },
    { name: "Le Mans", slug: "le-mans", zip: "72000", zone: "Ouest", department: "Sarthe", sunshineHours: 1750 },
    { name: "Brest", slug: "brest", zip: "29200", zone: "Ouest", department: "Finistère", sunshineHours: 1550 },
    { name: "Tours", slug: "tours", zip: "37000", zone: "Ouest", department: "Indre-et-Loire", sunshineHours: 1850 },
    { name: "Amiens", slug: "amiens", zip: "80000", zone: "Nord", department: "Somme", sunshineHours: 1650 },
    { name: "Limoges", slug: "limoges", zip: "87000", zone: "Ouest", department: "Haute-Vienne", sunshineHours: 1900 },
    { name: "Annecy", slug: "annecy", zip: "74000", zone: "Est", department: "Haute-Savoie", sunshineHours: 2000 },
    { name: "Metz", slug: "metz", zip: "57000", zone: "Est", department: "Moselle", sunshineHours: 1650 },
    { name: "Besançon", slug: "besancon", zip: "25000", zone: "Est", department: "Doubs", sunshineHours: 1800 },
    { name: "Orléans", slug: "orleans", zip: "45000", zone: "Nord", department: "Loiret", sunshineHours: 1750 },
    { name: "Mulhouse", slug: "mulhouse", zip: "68100", zone: "Est", department: "Haut-Rhin", sunshineHours: 1700 },
    { name: "Rouen", slug: "rouen", zip: "76000", zone: "Nord", department: "Seine-Maritime", sunshineHours: 1600 },
    { name: "Caen", slug: "caen", zip: "14000", zone: "Nord", department: "Calvados", sunshineHours: 1700 },
    { name: "Nancy", slug: "nancy", zip: "54000", zone: "Est", department: "Meurthe-et-Moselle", sunshineHours: 1650 },
    { name: "Argenteuil", slug: "argenteuil", zip: "95100", zone: "Nord", department: "Val-d'Oise", sunshineHours: 1700 },
    { name: "Montreuil", slug: "montreuil", zip: "93100", zone: "Nord", department: "Seine-Saint-Denis", sunshineHours: 1700 },
    { name: "Roubaix", slug: "roubaix", zip: "59100", zone: "Nord", department: "Nord", sunshineHours: 1600 },
    { name: "Dunkerque", slug: "dunkerque", zip: "59140", zone: "Nord", department: "Nord", sunshineHours: 1600 },
    { name: "Poitiers", slug: "poitiers", zip: "86000", zone: "Ouest", department: "Vienne", sunshineHours: 1950 },
];

export function getCityBySlug(slug: string): City | undefined {
    return CITIES_FR.find((city) => city.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCitySlugs(): string[] {
    return CITIES_FR.map((city) => city.slug);
}
