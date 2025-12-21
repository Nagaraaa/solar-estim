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
];

export function getCityBySlug(slug: string): City | undefined {
    return CITIES_FR.find((city) => city.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCitySlugs(): string[] {
    return CITIES_FR.map((city) => city.slug);
}
