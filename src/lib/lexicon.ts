import fs from "fs";
import path from "path";

const lexiconDirectory = path.join(process.cwd(), "src/content/lexicon");

export interface LexiconContent {
    term: string;
    shortDefinition: string;
    audience10yo: string;
    technicalDetails: string;
    importance: string;
    image?: string;
}

export interface LexiconEntry {
    slug: string;
    fr?: LexiconContent;
    be?: LexiconContent;
}

export async function getDefinition(slug: string, country: 'FR' | 'BE'): Promise<LexiconContent | null> {
    const fullPath = path.join(lexiconDirectory, `${slug}.json`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const data = JSON.parse(fileContents);

    // Return specific country content, or fallback to FR if BE is requested but missing (and vice versa? No, strict separation preferred for now, or fallback if identical. Let's start with strict to ensure quality).
    // Actually, for shared terms, we might have duplication in JSON, which is fine for "Anti-Duplication" requirement.

    if (country === 'BE' && data.be) return data.be;
    if (country === 'FR' && data.fr) return data.fr;

    return null;
}

export async function getAllDefinitions(country: 'FR' | 'BE'): Promise<{ slug: string; term: string; shortDefinition: string }[]> {
    if (!fs.existsSync(lexiconDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(lexiconDirectory);
    const allTerms = fileNames
        .map((fileName) => {
            const slug = fileName.replace(/\.json$/, "");
            const fullPath = path.join(lexiconDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const data = JSON.parse(fileContents);

            const content = country === 'BE' ? data.be : data.fr;

            if (!content) return null;

            return {
                slug,
                term: content.term,
                shortDefinition: content.shortDefinition
            };
        })
        .filter((item): item is { slug: string; term: string; shortDefinition: string } => item !== null);

    return allTerms.sort((a, b) => a.term.localeCompare(b.term));
}
