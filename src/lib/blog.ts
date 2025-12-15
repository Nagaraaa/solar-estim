import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/content");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    content: string;
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

export async function getAllPosts(): Promise<BlogPost[]> {
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

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}
