
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { CITIES } from './be/villes/cities';
import { CITIES_FR } from './villes/cities';

const BASE_URL = 'https://www.solarestim.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const postsFr = await getAllPosts('FR');
    const postsBe = await getAllPosts('BE');

    const blogEntriesFr: MetadataRoute.Sitemap = postsFr.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    const blogEntriesBe: MetadataRoute.Sitemap = postsBe.map((post) => ({
        url: `${BASE_URL}/be/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // Manual Guide Entry (dynamic would be better if we had many guides, but for 1 it's fine)
    const guideEntryFr = {
        url: `${BASE_URL}/guide/comprendre-le-solaire`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    };
    const guideEntryBe = {
        url: `${BASE_URL}/be/guide/comprendre-le-solaire`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    };

    return [
        // FRANCE
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/simulateur`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...CITIES_FR.map((city) => ({
            url: `${BASE_URL}/villes/${city.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),

        // BELGIQUE
        {
            url: `${BASE_URL}/be`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/be/simulateur`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/be/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...CITIES.map((city) => ({
            url: `${BASE_URL}/be/villes/${city.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),

        // LEGAL
        {
            url: `${BASE_URL}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...blogEntriesFr,
        ...blogEntriesBe,
        guideEntryFr,
        guideEntryBe,
    ];
}
