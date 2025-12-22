import { Article, WithContext } from "schema-dts";
import Script from "next/script";

interface ArticleSchemaProps {
    title: string;
    description: string;
    images: string[];
    datePublished: string;
    dateModified?: string;
    authorName: string;
    authorUrl?: string;
    publisherName?: string;
    publisherLogo?: string;
    url: string;
}

export function ArticleSchema({
    title,
    description,
    images,
    datePublished,
    dateModified,
    authorName,
    authorUrl,
    publisherName = "Solar Estim",
    publisherLogo = "https://www.solarestim.com/logo2.png",
    url
}: ArticleSchemaProps) {
    const jsonLd: WithContext<Article> = {
        "@context": "https://schema.org",
        "@type": "Article",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url
        },
        headline: title,
        image: images,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        author: {
            "@type": "Person",
            name: authorName,
            url: authorUrl
        },
        publisher: {
            "@type": "Organization",
            name: publisherName,
            logo: {
                "@type": "ImageObject",
                url: publisherLogo
            }
        },
        description: description
    };

    return (
        <Script
            id="article-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
