import Link from "next/link";
import React from "react";
import { getAllDefinitions } from "@/lib/lexicon";

interface AutoLinkProps {
    text: string;
    country: "FR" | "BE";
    linkClassName?: string;
    boldClassName?: string;
}

export async function AutoLink({ text, country, linkClassName = "text-brand", boldClassName = "text-slate-800" }: AutoLinkProps) {
    const terms = await getAllDefinitions(country);

    // Sort terms by length (descending)
    const sortedTerms = terms.sort((a, b) => b.term.length - a.term.length);

    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find all matches for each term.
    // Enhanced regex to optionally capture surrounding ** (bold markers)
    // We look for optional ** followed by word boundary, the term, word boundary, and optional **
    const matches: { index: number; length: number; term: string; slug: string; isBold: boolean }[] = [];

    for (const termObj of sortedTerms) {
        const escaped = escapeRegExp(termObj.term);
        // Group 1: Leading ** (optional)
        // Group 2: Trailing ** (optional)
        // Note: We scan the whole text for each term.
        const regex = new RegExp(`(\\*\\*)?\\b${escaped}\\b(\\*\\*)?`, 'gi');
        let m;
        while ((m = regex.exec(text)) !== null) {
            const hasLeadingBold = m[1] === '**';
            const hasTrailingBold = m[2] === '**';
            const isBold = hasLeadingBold && hasTrailingBold;

            matches.push({
                index: m.index,
                length: m[0].length,
                term: m[0],
                slug: termObj.slug,
                isBold: isBold
            });
        }
    }

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);

    const activeMatches: typeof matches = [];
    const usedIndices = new Set<number>();
    const linkedSlugs = new Set<string>();

    for (const m of matches) {
        if (linkedSlugs.has(m.slug)) continue;

        let overlaps = false;
        for (let i = m.index; i < m.index + m.length; i++) {
            if (usedIndices.has(i)) {
                overlaps = true;
                break;
            }
        }

        if (!overlaps) {
            activeMatches.push(m);
            linkedSlugs.add(m.slug);
            for (let i = m.index; i < m.index + m.length; i++) {
                usedIndices.add(i);
            }
        }
    }

    activeMatches.sort((a, b) => a.index - b.index);

    const result: React.ReactNode[] = [];

    // Helper to parse basic markdown inside text chunks
    // Accepts a baseKey to ensure unique React keys
    const parseMarkdown = (textChunk: string, baseKey: string): React.ReactNode[] => {
        const parts = textChunk.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            const uniqueKey = `${baseKey}-${i}`;
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                return <strong key={uniqueKey} className={`font-semibold ${boldClassName}`}>{part.slice(2, -2)}</strong>;
            }
            return <React.Fragment key={uniqueKey}>{part}</React.Fragment>;
        });
    };

    let cursor = 0;
    for (let i = 0; i < activeMatches.length; i++) {
        const m = activeMatches[i];

        // Text before
        if (m.index > cursor) {
            const textChunk = text.slice(cursor, m.index);
            result.push(...parseMarkdown(textChunk, `pre-${i}`));
        }

        // The Link
        const prefix = country === 'BE' ? '/be' : '';

        // Clean term is the matched term without the asterisks
        const cleanTermMatch = m.term.replace(/^\*\*|\*\*$/g, '');

        const linkElement = (
            <Link
                key={`link-${i}`}
                href={`${prefix}/lexique/${m.slug}`}
                className={`${linkClassName} font-medium hover:underline underline-offset-2 decoration-brand/30 ${m.isBold ? 'font-bold' : ''}`}
            >
                {cleanTermMatch}
            </Link>
        );

        result.push(m.isBold ? <strong key={`bold-link-${i}`}>{linkElement}</strong> : linkElement);

        cursor = m.index + m.length;
    }

    // Remaining text
    if (cursor < text.length) {
        const textChunk = text.slice(cursor);
        result.push(...parseMarkdown(textChunk, `post-end`));
    }

    return <>{result}</>;
}
