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
    country?: 'FR' | 'BE';
    author?: string;
    authorBio?: string;
    authorImage?: string;
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

// Helper to parse frontmatter without gray-matter
function parseFrontmatter(fileContent: string): { data: any; content: string } {
    // Robust regex for both CRLF (\r\n) and LF (\n)
    // Matches: start of string, ---, newline, (capture frontmatter), newline, ---, newline, (capture content)
    // We use [\s\S] to match any character including newlines
    const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

    if (!match) {
        // Fallback: try to find the second '---' if the first one is at the start
        if (fileContent.startsWith('---')) {
            const endOfFrontmatter = fileContent.indexOf('\n---', 3);
            if (endOfFrontmatter !== -1) {
                const frontmatterRaw = fileContent.substring(3, endOfFrontmatter).trim();
                const content = fileContent.substring(endOfFrontmatter + 4).trim();
                return parseFrontmatterData(frontmatterRaw, content);
            }
        }
        return { data: {}, content: fileContent };
    }

    const frontmatterRaw = match[1];
    const content = match[2];
    return parseFrontmatterData(frontmatterRaw, content);
}

function parseFrontmatterData(frontmatterRaw: string, content: string) {
    const data: any = {};
    frontmatterRaw.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            // Join back the rest in case value contains colons (e.g. urls)
            let value = parts.slice(1).join(':').trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            data[key] = value;
        }
    });

    return { data, content };
}

export async function getGuidePost(slug: string): Promise<BlogPost | null> {
    const guideDirectory = path.join(process.cwd(), "src/content/guide");

    // Check for JSON first (legacy)
    const jsonPath = path.join(guideDirectory, `${slug}.json`);
    if (fs.existsSync(jsonPath)) {
        const fileContents = fs.readFileSync(jsonPath, "utf8");
        const data = JSON.parse(fileContents);
        return { slug, ...data };
    }

    // Check for Markdown
    const mdPath = path.join(guideDirectory, `${slug}.md`);
    if (fs.existsSync(mdPath)) {
        const fileContents = fs.readFileSync(mdPath, "utf8");
        const { data, content } = parseFrontmatter(fileContents);

        return {
            slug,
            title: data.title || slug,
            date: data.date || new Date().toISOString(),
            category: data.category || "Guide",
            image: data.coverImage || data.image || "",
            summary: data.excerpt || "",
            description: data.excerpt || "",
            content: content,
            country: data.country
        };
    }

    // Fallback to blog directory if not found in guide (for legacy reasons if any)
    const blogDirectory = path.join(process.cwd(), "src/content/blog");
    const blogJsonPath = path.join(blogDirectory, `${slug}.json`);
    if (fs.existsSync(blogJsonPath)) {
        const fileContents = fs.readFileSync(blogJsonPath, "utf8");
        const data = JSON.parse(fileContents);
        return { slug, ...data };
    }

    return null;
}

export async function getAllGuidePosts(): Promise<BlogPost[]> {
    const guideDirectory = path.join(process.cwd(), "src/content/guide");
    const blogDirectory = path.join(process.cwd(), "src/content/blog");
    let posts: BlogPost[] = [];

    // Helper to process a directory
    const processDir = (dir: string) => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir).map(fileName => {
            const slug = fileName.replace(/\.(json|md)$/, "");
            const fullPath = path.join(dir, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            if (fileName.endsWith(".json")) {
                const data = JSON.parse(fileContents);
                return { slug, ...data } as BlogPost;
            } else if (fileName.endsWith(".md")) {
                const { data, content } = parseFrontmatter(fileContents);
                return {
                    slug,
                    title: data.title || slug,
                    date: data.date || new Date().toISOString(),
                    category: data.category || "Guide",
                    image: data.coverImage || data.image || "",
                    summary: data.excerpt || "",
                    description: data.excerpt || "",
                    content: content,
                    country: data.country
                } as BlogPost;
            }
            return null;
        }).filter(p => p !== null) as BlogPost[];
    };

    posts = [...processDir(guideDirectory), ...processDir(blogDirectory)];

    // Remove duplicates (prefer guide directory)
    const uniquePosts = Array.from(new Map(posts.map(p => [p.slug, p])).values());

    return uniquePosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
