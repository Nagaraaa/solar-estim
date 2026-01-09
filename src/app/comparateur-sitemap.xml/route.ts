import { promises as fs } from 'fs';
import path from 'path';

const BASE_URL = 'https://solarestim.com';

export async function GET() {
    const comparateurDir = path.join(process.cwd(), 'src/app/comparateur');

    let slugs: string[] = [];

    try {
        const entries = await fs.readdir(comparateurDir, { withFileTypes: true });
        slugs = entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
    } catch (error) {
        console.error('Error reading comparateur directory:', error);
    }

    // Hub Pages
    const routes = [
        { url: `${BASE_URL}/comparateur`, priority: 0.9 },
        { url: `${BASE_URL}/be/comparateur`, priority: 0.9 },
    ];

    // Articles
    slugs.forEach(slug => {
        routes.push({ url: `${BASE_URL}/comparateur/${slug}`, priority: 0.8 });
        routes.push({ url: `${BASE_URL}/be/comparateur/${slug}`, priority: 0.8 });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
            .map(
                (route) => `
    <url>
      <loc>${route.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `
            )
            .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
