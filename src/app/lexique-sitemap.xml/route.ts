import { getAllDefinitions } from '@/lib/lexicon';

const BASE_URL = 'https://www.solarestim.com';

export async function GET() {
    const lexiconFr = await getAllDefinitions('FR');
    const lexiconBe = await getAllDefinitions('BE');

    const allDefinitions = [
        ...lexiconFr.map(d => ({ ...d, url: `${BASE_URL}/lexique/${d.slug}` })),
        ...lexiconBe.map(d => ({ ...d, url: `${BASE_URL}/be/lexique/${d.slug}` }))
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allDefinitions
            .map(
                (entry) => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.7</priority>
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
