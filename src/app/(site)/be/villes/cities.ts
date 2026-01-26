export interface City {
    name: string;
    slug: string;
    zip: string;
    region: "Wallonie" | "Bruxelles" | "Flandre";
    sunshineHours: number;
}

export const CITIES: City[] = [
    { name: "Namur", slug: "namur", zip: "5000", region: "Wallonie", sunshineHours: 1600 },
    { name: "Wavre", slug: "wavre", zip: "1300", region: "Wallonie", sunshineHours: 1650 },
    { name: "Liège", slug: "liege", zip: "4000", region: "Wallonie", sunshineHours: 1600 },
    { name: "Charleroi", slug: "charleroi", zip: "6000", region: "Wallonie", sunshineHours: 1600 },
    { name: "Mons", slug: "mons", zip: "7000", region: "Wallonie", sunshineHours: 1600 },
    { name: "Nivelles", slug: "nivelles", zip: "1400", region: "Wallonie", sunshineHours: 1650 },
    { name: "Tournai", slug: "tournai", zip: "7500", region: "Wallonie", sunshineHours: 1650 },
    { name: "Arlon", slug: "arlon", zip: "6700", region: "Wallonie", sunshineHours: 1700 }, // Plus au sud, un peu plus ensoleillé
    { name: "Braine-l'Alleud", slug: "brain-l-alleud", zip: "1420", region: "Wallonie", sunshineHours: 1650 },
    { name: "Waterloo", slug: "waterloo", zip: "1410", region: "Wallonie", sunshineHours: 1650 },
    { name: "Gembloux", slug: "gembloux", zip: "5030", region: "Wallonie", sunshineHours: 1600 },
    { name: "Ath", slug: "ath", zip: "7800", region: "Wallonie", sunshineHours: 1650 },
    { name: "Huy", slug: "huy", zip: "4500", region: "Wallonie", sunshineHours: 1600 },
    { name: "Verviers", slug: "verviers", zip: "4800", region: "Wallonie", sunshineHours: 1550 },
    { name: "Binche", slug: "binche", zip: "7130", region: "Wallonie", sunshineHours: 1600 },
    { name: "Louvain-la-Neuve", slug: "louvain-la-neuve", zip: "1348", region: "Wallonie", sunshineHours: 1650 },
    { name: "Marche-en-Famenne", slug: "marche-en-famenne", zip: "6900", region: "Wallonie", sunshineHours: 1650 },
    { name: "Bastogne", slug: "bastogne", zip: "6600", region: "Wallonie", sunshineHours: 1650 },
    { name: "Dinant", slug: "dinant", zip: "5500", region: "Wallonie", sunshineHours: 1600 },
    { name: "Châtelet", slug: "chatelet", zip: "6200", region: "Wallonie", sunshineHours: 1600 },
    { name: "La Louvière", slug: "la-louviere", zip: "7100", region: "Wallonie", sunshineHours: 1600 },
    { name: "Seraing", slug: "seraing", zip: "4100", region: "Wallonie", sunshineHours: 1600 },
    { name: "Mouscron", slug: "mouscron", zip: "7700", region: "Wallonie", sunshineHours: 1650 },
    { name: "Herstal", slug: "herstal", zip: "4040", region: "Wallonie", sunshineHours: 1600 },
    { name: "Courcelles", slug: "courcelles", zip: "6180", region: "Wallonie", sunshineHours: 1600 },
    { name: "Sambreville", slug: "sambreville", zip: "5060", region: "Wallonie", sunshineHours: 1600 },
    { name: "Andenne", slug: "andenne", zip: "5300", region: "Wallonie", sunshineHours: 1600 },
    { name: "Soignies", slug: "soignies", zip: "7060", region: "Wallonie", sunshineHours: 1650 },
    { name: "Waremme", slug: "waremme", zip: "4300", region: "Wallonie", sunshineHours: 1650 },
    { name: "Eupen", slug: "eupen", zip: "4700", region: "Wallonie", sunshineHours: 1550 },
    { name: "Tubize", slug: "tubize", zip: "1480", region: "Wallonie", sunshineHours: 1650 },
    { name: "Ciney", slug: "ciney", zip: "5590", region: "Wallonie", sunshineHours: 1650 },
    { name: "Hannut", slug: "hannut", zip: "4280", region: "Wallonie", sunshineHours: 1650 },
    { name: "Rochefort", slug: "rochefort", zip: "5580", region: "Wallonie", sunshineHours: 1600 },
    { name: "Spa", slug: "spa", zip: "4900", region: "Wallonie", sunshineHours: 1550 },
    { name: "Bruxelles", slug: "bruxelles", zip: "1000", region: "Bruxelles", sunshineHours: 1600 },
    { name: "Ixelles", slug: "ixelles", zip: "1050", region: "Bruxelles", sunshineHours: 1600 },
    { name: "Uccle", slug: "uccle", zip: "1180", region: "Bruxelles", sunshineHours: 1600 },
    { name: "Schaerbeek", slug: "schaerbeek", zip: "1030", region: "Bruxelles", sunshineHours: 1600 },
    { name: "Anderlecht", slug: "anderlecht", zip: "1070", region: "Bruxelles", sunshineHours: 1600 },
    { name: "Malmedy", slug: "malmedy", zip: "4960", region: "Wallonie", sunshineHours: 1550 },
    { name: "Saint-Nicolas", slug: "saint-nicolas", zip: "4420", region: "Wallonie", sunshineHours: 1600 },
    { name: "Flémalle", slug: "flemalle", zip: "4400", region: "Wallonie", sunshineHours: 1600 },
    { name: "Chaudfontaine", slug: "chaudfontaine", zip: "4050", region: "Wallonie", sunshineHours: 1550 },
    { name: "Esneux", slug: "esneux", zip: "4130", region: "Wallonie", sunshineHours: 1550 },
    { name: "Visé", slug: "vise", zip: "4600", region: "Wallonie", sunshineHours: 1600 },
    { name: "Oupeye", slug: "oupeye", zip: "4680", region: "Wallonie", sunshineHours: 1600 },
    { name: "Ans", slug: "ans", zip: "4430", region: "Wallonie", sunshineHours: 1600 },
    { name: "Grâce-Hollogne", slug: "grace-hollogne", zip: "4460", region: "Wallonie", sunshineHours: 1600 },
    { name: "Herve", slug: "herve", zip: "4650", region: "Wallonie", sunshineHours: 1600 },
];

export function getCityBySlug(slug: string): City | undefined {
    return CITIES.find((city) => city.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCitySlugs(): string[] {
    return CITIES.map((city) => city.slug);
}
