import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/comparateur/', '/lexique/'],
                disallow: ['/admin/'],
            }
        ],
        sitemap: 'https://www.solarestim.com/index-sitemap.xml',
    };
}
