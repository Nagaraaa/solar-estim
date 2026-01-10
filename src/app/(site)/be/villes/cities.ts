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
    { name: "La Louvière", slug: "la-louviere", zip: "7100", region: "Wallonie" },
    { name: "Seraing", slug: "seraing", zip: "4100", region: "Wallonie" },
    { name: "Mouscron", slug: "mouscron", zip: "7700", region: "Wallonie" },
    { name: "Herstal", slug: "herstal", zip: "4040", region: "Wallonie" },
    { name: "Courcelles", slug: "courcelles", zip: "6180", region: "Wallonie" },
    { name: "Sambreville", slug: "sambreville", zip: "5060", region: "Wallonie" },
    { name: "Andenne", slug: "andenne", zip: "5300", region: "Wallonie" },
    { name: "Soignies", slug: "soignies", zip: "7060", region: "Wallonie" },
    { name: "Waremme", slug: "waremme", zip: "4300", region: "Wallonie" },
    { name: "Eupen", slug: "eupen", zip: "4700", region: "Wallonie" },
    { name: "Tubize", slug: "tubize", zip: "1480", region: "Wallonie" },
    { name: "Ciney", slug: "ciney", zip: "5590", region: "Wallonie" },
    { name: "Hannut", slug: "hannut", zip: "4280", region: "Wallonie" },
    { name: "Rochefort", slug: "rochefort", zip: "5580", region: "Wallonie" },
    { name: "Spa", slug: "spa", zip: "4900", region: "Wallonie" },
    { name: "Bruxelles", slug: "bruxelles", zip: "1000", region: "Bruxelles" },
    { name: "Ixelles", slug: "ixelles", zip: "1050", region: "Bruxelles" },
    { name: "Uccle", slug: "uccle", zip: "1180", region: "Bruxelles" },
    { name: "Schaerbeek", slug: "schaerbeek", zip: "1030", region: "Bruxelles" },
    { name: "Anderlecht", slug: "anderlecht", zip: "1070", region: "Bruxelles" },
    { name: "Malmedy", slug: "malmedy", zip: "4960", region: "Wallonie" },
    { name: "Saint-Nicolas", slug: "saint-nicolas", zip: "4420", region: "Wallonie" },
    { name: "Flémalle", slug: "flemalle", zip: "4400", region: "Wallonie" },
    { name: "Chaudfontaine", slug: "chaudfontaine", zip: "4050", region: "Wallonie" },
    { name: "Esneux", slug: "esneux", zip: "4130", region: "Wallonie" },
    { name: "Visé", slug: "vise", zip: "4600", region: "Wallonie" },
    { name: "Oupeye", slug: "oupeye", zip: "4680", region: "Wallonie" },
    { name: "Ans", slug: "ans", zip: "4430", region: "Wallonie" },
    { name: "Grâce-Hollogne", slug: "grace-hollogne", zip: "4460", region: "Wallonie" },
    { name: "Herve", slug: "herve", zip: "4650", region: "Wallonie" },
];

export function getCityBySlug(slug: string): City | undefined {
    return CITIES.find((city) => city.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCitySlugs(): string[] {
    return CITIES.map((city) => city.slug);
}
