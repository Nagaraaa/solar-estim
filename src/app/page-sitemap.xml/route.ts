import { getAllPosts } from '@/lib/blog';
import { CITIES } from '../(site)/be/villes/cities';
import { CITIES_FR } from '../(site)/villes/cities';

const BASE_URL = 'https://www.solarestim.com';

export async function GET() {
    const postsFr = await getAllPosts('FR');
    const postsBe = await getAllPosts('BE');

    const staticPages = [
        // FR
        { url: BASE_URL, priority: 1.0, freq: 'weekly' },
        { url: `${BASE_URL}/simulateur`, priority: 0.9, freq: 'weekly' },
        { url: `${BASE_URL}/blog`, priority: 0.8, freq: 'weekly' },
        { url: `${BASE_URL}/guide/comprendre-le-solaire`, priority: 0.9, freq: 'monthly' },
        { url: `${BASE_URL}/villes`, priority: 0.9, freq: 'weekly' },
        { url: `${BASE_URL}/mentions-legales`, priority: 0.3, freq: 'yearly' },
        { url: `${BASE_URL}/politique-confidentialite`, priority: 0.3, freq: 'yearly' },

        // BE
        { url: `${BASE_URL}/be`, priority: 1.0, freq: 'weekly' },
        { url: `${BASE_URL}/be/simulateur`, priority: 0.9, freq: 'weekly' },
        { url: `${BASE_URL}/be/blog`, priority: 0.8, freq: 'weekly' },
        { url: `${BASE_URL}/be/villes`, priority: 0.9, freq: 'weekly' },
        { url: `${BASE_URL}/be/guide/comprendre-le-solaire`, priority: 0.9, freq: 'monthly' },
    ];

    const citiesFr = CITIES_FR.map(city => ({
        url: `${BASE_URL}/villes/${city.slug}`,
        priority: 0.8,
        freq: 'monthly'
    }));

    const citiesBe = CITIES.map(city => ({
        url: `${BASE_URL}/be/villes/${city.slug}`,
        priority: 0.8,
        freq: 'monthly'
    }));

    const blogFr = postsFr.map(post => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        priority: 0.6,
        freq: 'monthly',
        date: post.date
    }));

    const blogBe = postsBe.map(post => ({
        url: `${BASE_URL}/be/blog/${post.slug}`,
        priority: 0.6,
        freq: 'monthly',
        date: post.date
    }));

    const allUrls = [
        ...staticPages,
        ...citiesFr,
        ...citiesBe,
        ...blogFr,
        ...blogBe
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
            .map((entry) => {
                const date = (entry as any).date;
                return `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${date ? new Date(date).toISOString() : new Date().toISOString()}</lastmod>
      <changefreq>${entry.freq}</changefreq>
      <priority>${entry.priority}</priority>
    </url>
  `;
            })
            .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
