import Script from "next/script";

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbStructuredDataProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url.startsWith("http") ? item.url : `https://www.solarestim.com${item.url}`
        }))
    };

    return (
        <Script
            id={`breadcrumb-structured-data-${items.length}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
