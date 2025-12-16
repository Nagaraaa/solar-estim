import Script from "next/script";

export function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "Solar Estim",
                "url": "https://www.solarestim.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.solarestim.com/blog?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "SoftwareApplication",
                "name": "Simulateur Solar Estim",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Web",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "124"
                }
            }
        ]
    };

    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
