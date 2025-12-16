import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/content");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    image: string;
    summary: string;
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
    const allPostsData = fileNames.map((fileName) => {
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
