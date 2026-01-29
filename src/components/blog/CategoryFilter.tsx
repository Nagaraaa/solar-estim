"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { label: "Tout", value: null },
    { label: "Solaire", value: "Solaire" },
    { label: "Véhicule Électrique", value: "VE" },
    { label: "Batterie", value: "Batterie" },
];

export function CategoryFilter({ baseUrl = "/blog" }: { baseUrl?: string }) {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category");

    return (
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
                const isActive = cat.value === currentCategory || (cat.value === null && !currentCategory);
                return (
                    <Link
                        key={cat.label}
                        href={cat.value ? `${baseUrl}?category=${cat.value}` : baseUrl}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                            isActive
                                ? "bg-brand text-slate-900 border-brand shadow-md"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand/50 hover:bg-brand/5"
                        )}
                        scroll={false}
                    >
                        {cat.label}
                    </Link>
                );
            })}
        </div>
    );
}
