import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/content");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: "Solaire" | "VE" | "Batterie" | "Autre";
    tags: string[];
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
    return getGuidePost(slug);
}

export async function getAllPosts(country: 'FR' | 'BE' = 'FR'): Promise<BlogPost[]> {
    const allPosts = await getAllGuidePosts();

    // Filter by country (default to FR if undefined)
    const filteredPosts = allPosts.filter(post => {
        const postCountry = post.country || 'FR';
        return postCountry === country;
    });

    return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Helper to parse frontmatter without gray-matter
function parseFrontmatter(fileContent: string): { data: Record<string, any>; content: string } {
    // Robust regex for both CRLF (\r\n) and LF (\n)
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
    const data: Record<string, any> = {};
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

            // Special handling for tags (array parsing)
            if (key === 'tags') {
                // Remove brackets around array if present: [tag1, tag2] -> tag1, tag2
                const val = value.replace(/^\[|\]$/g, '');
                data[key] = val.split(',').map(tag => {
                    let t = tag.trim();
                    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
                        t = t.slice(1, -1);
                    }
                    return t.toLowerCase();
                }).filter(Boolean);
            } else if (key === 'category') {
                const val = value.trim();
                // Validate category or default to 'Autre'
                const validCategories = ["Solaire", "VE", "Batterie", "Autre"];
                data[key] = validCategories.includes(val) ? val : "Autre";
            } else {
                data[key] = value;
            }
        }
    });

    // Ensure defaults
    if (!data.category) data.category = "Autre";
    if (!data.tags) data.tags = [];

    return { data, content };
}

export async function getGuidePost(slug: string): Promise<BlogPost | null> {
    const guideDirectory = path.join(process.cwd(), "src/content/guide");

    // Check for JSON first (legacy)
    const jsonPath = path.join(guideDirectory, `${slug}.json`);
    if (fs.existsSync(jsonPath)) {
        const fileContents = fs.readFileSync(jsonPath, "utf8");
        const data = JSON.parse(fileContents);
        return {
            slug,
            tags: data.tags || [],
            category: data.category || "Autre",
            ...data
        };
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
            tags: data.tags || [],
            image: data.coverImage || data.image || "",
            summary: data.excerpt || "",
            description: data.excerpt || "",
            content: content,
            country: data.country as 'FR' | 'BE' | undefined
        };
    }

    // Fallback to blog directory
    const blogDirectory = path.join(process.cwd(), "src/content/blog");
    const blogJsonPath = path.join(blogDirectory, `${slug}.json`);
    if (fs.existsSync(blogJsonPath)) {
        const fileContents = fs.readFileSync(blogJsonPath, "utf8");
        const data = JSON.parse(fileContents);
        return {
            slug,
            tags: data.tags || [],
            category: data.category || "Autre",
            ...data
        };
    }

    // Fallback to root content directory (Legacy)
    const rootContentDirectory = path.join(process.cwd(), "src/content");
    const rootJsonPath = path.join(rootContentDirectory, `${slug}.json`);
    if (fs.existsSync(rootJsonPath)) {
        const fileContents = fs.readFileSync(rootJsonPath, "utf8");
        const data = JSON.parse(fileContents);
        return {
            slug,
            tags: data.tags || [],
            category: data.category || "Autre",
            ...data
        };
    }

    return null;
}

export async function getAllGuidePosts(): Promise<BlogPost[]> {
    const guideDirectory = path.join(process.cwd(), "src/content/guide");
    const blogDirectory = path.join(process.cwd(), "src/content/blog");
    const rootContentDirectory = path.join(process.cwd(), "src/content");
    let posts: BlogPost[] = [];

    // Helper to process a directory
    const processDir = (dir: string) => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir).map(fileName => {
            // Skip directories
            if (fs.statSync(path.join(dir, fileName)).isDirectory()) return null;

            const slug = fileName.replace(/\.(json|md)$/, "");
            const fullPath = path.join(dir, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            if (fileName.endsWith(".json")) {
                const data = JSON.parse(fileContents);

                // Infer country from filename if not present
                let inferredCountry = data.country;
                if (!inferredCountry) {
                    if (fileName.endsWith("-be.json") || fileName.includes("belgique") || fileName.includes("wallonie")) inferredCountry = "BE";
                    else if (fileName.includes("france")) inferredCountry = "FR";
                }

                return {
                    slug,
                    tags: data.tags || [],
                    category: data.category || "Autre",
                    country: inferredCountry, // use inferred or undefined
                    ...data
                } as BlogPost;
            } else if (fileName.endsWith(".md")) {
                const { data, content } = parseFrontmatter(fileContents);
                return {
                    slug,
                    title: data.title || slug,
                    date: data.date || new Date().toISOString(),
                    category: data.category || "Guide",
                    tags: data.tags || [],
                    image: data.coverImage || data.image || "",
                    summary: data.excerpt || "",
                    description: data.excerpt || "",
                    content: content,
                    country: data.country as 'FR' | 'BE' | undefined
                } as BlogPost;
            }
            return null;
        }).filter(p => p !== null) as BlogPost[];
    };

    posts = [...processDir(guideDirectory), ...processDir(blogDirectory), ...processDir(rootContentDirectory)];

    // Remove duplicates (prefer guide directory)
    const uniquePosts = Array.from(new Map(posts.map(p => [p.slug, p])).values());

    return uniquePosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
