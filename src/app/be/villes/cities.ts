export interface City {
    name: string;
    slug: string;
    zip: string;
    region: "Wallonie" | "Bruxelles" | "Flandre";
}

export const CITIES: City[] = [
    { name: "Namur", slug: "namur", zip: "5000", region: "Wallonie" },
    { name: "Wavre", slug: "wavre", zip: "1300", region: "Wallonie" },
    { name: "Liège", slug: "liege", zip: "4000", region: "Wallonie" },
    { name: "Charleroi", slug: "charleroi", zip: "6000", region: "Wallonie" },
    { name: "Mons", slug: "mons", zip: "7000", region: "Wallonie" },
    { name: "Nivelles", slug: "nivelles", zip: "1400", region: "Wallonie" },
    { name: "Tournai", slug: "tournai", zip: "7500", region: "Wallonie" },
    { name: "Arlon", slug: "arlon", zip: "6700", region: "Wallonie" },
    { name: "Braine-l'Alleud", slug: "brain-l-alleud", zip: "1420", region: "Wallonie" },
    { name: "Waterloo", slug: "waterloo", zip: "1410", region: "Wallonie" },
    { name: "Gembloux", slug: "gembloux", zip: "5030", region: "Wallonie" },
    { name: "Ath", slug: "ath", zip: "7800", region: "Wallonie" },
    { name: "Huy", slug: "huy", zip: "4500", region: "Wallonie" },
    { name: "Verviers", slug: "verviers", zip: "4800", region: "Wallonie" },
    { name: "Binche", slug: "binche", zip: "7130", region: "Wallonie" },
    { name: "Louvain-la-Neuve", slug: "louvain-la-neuve", zip: "1348", region: "Wallonie" },
    { name: "Marche-en-Famenne", slug: "marche-en-famenne", zip: "6900", region: "Wallonie" },
    { name: "Bastogne", slug: "bastogne", zip: "6600", region: "Wallonie" },
    { name: "Dinant", slug: "dinant", zip: "5500", region: "Wallonie" },
    { name: "Châtelet", slug: "chatelet", zip: "6200", region: "Wallonie" },
];

export function getCityBySlug(slug: string): City | undefined {
    return CITIES.find((city) => city.slug === slug);
}

export function getAllCitySlugs(): string[] {
    return CITIES.map((city) => city.slug);
}
