import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/content");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    image: string;
    imageAlt?: string;
    summary: string;
    description?: string; // For guide posts
    content: string;
    country?: 'FR' | 'BE'; // Optional for backward compatibility (default to FR)
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    const fullPath = path.join(contentDirectory, `${slug}.json`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const data = JSON.parse(fileContents);
    return { slug, ...data };
}

export async function getAllPosts(country: 'FR' | 'BE' = 'FR'): Promise<BlogPost[]> {
    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith(".json"))
        .map((fileName) => {
            const slug = fileName.replace(/\.json$/, "");
            const fullPath = path.join(contentDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const data = JSON.parse(fileContents);
            return {
                slug,
                ...data,
            } as BlogPost;
        });

    // Filter by country (default to FR if undefined)
    const filteredPosts = allPostsData.filter(post => {
        const postCountry = post.country || 'FR';
        return postCountry === country;
    });

    return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getGuidePost(slug: string): Promise<BlogPost | null> {
    const guideDirectory = path.join(process.cwd(), "src/content/blog");
    const fullPath = path.join(guideDirectory, `${slug}.json`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const data = JSON.parse(fileContents);
    return { slug, ...data };
}

export async function getAllGuidePosts(): Promise<BlogPost[]> {
    const guideDirectory = path.join(process.cwd(), "src/content/blog");
    if (!fs.existsSync(guideDirectory)) return [];

    const fileNames = fs.readdirSync(guideDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith(".json"))
        .map((fileName) => {
            const slug = fileName.replace(/\.json$/, "");
            const fullPath = path.join(guideDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const data = JSON.parse(fileContents);
            return { slug, ...data } as BlogPost;
        });
}
