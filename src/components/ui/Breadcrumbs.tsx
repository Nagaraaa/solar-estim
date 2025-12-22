import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    // Always include Home as first item
    const allItems = [
        { label: "Accueil", href: "/" },
        ...items
    ];

    const schemaItems = allItems.map(item => ({
        name: item.label,
        item: `https://www.solarestim.com${item.href}`
    }));

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <BreadcrumbSchema items={schemaItems} />
            <ol className="flex flex-wrap items-center text-sm text-slate-500">
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    return (
                        <li key={item.href} className="flex items-center">
                            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />}
                            {isLast ? (
                                <span className="font-medium text-slate-900" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link href={item.href} className="hover:text-brand hover:underline transition-colors">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
