import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllDefinitions } from "@/lib/lexicon";

interface SmartMarkdownProps {
    text: string;
    country: "FR" | "BE";
    className?: string; // To pass prose classes
}

export async function SmartMarkdown({ text, country, className }: SmartMarkdownProps) {
    // 0. Dedent text to prevent accidental code blocks from template literal indentation
    const lines = text.split('\n');
    // Find min indentation (ignoring first empty line if present, and empty lines)
    let minIndent = Infinity;
    const meaningfulLines = lines.filter(line => line.trim().length > 0);

    if (meaningfulLines.length > 0) {
        for (const line of meaningfulLines) {
            const spaces = line.match(/^ */)?.[0].length || 0;
            if (spaces < minIndent) minIndent = spaces;
        }
    }

    let cleanText = text;
    if (minIndent < Infinity && minIndent > 0) {
        cleanText = lines.map(line => {
            if (line.trim().length === 0) return ''; // Empty lines stay empty
            return line.slice(minIndent);
        }).join('\n');
    } else if (meaningfulLines.length === 0) {
        cleanText = text.trim();
    }

    // Trim potential leading newlines from first template literal line
    cleanText = cleanText.trim();

    const terms = await getAllDefinitions(country);

    // 1. Inject Links into Markdown Text
    // We construct a new string where known terms are replaced by Markdown links: [Term](/path)

    // Sort terms by length (descending) to match longest first
    const sortedTerms = terms.sort((a, b) => b.term.length - a.term.length);
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Identify matches
    const matches: { index: number; length: number; term: string; slug: string }[] = [];

    // Temporary list to avoid overlapping matches
    // We scan the text for all terms. 
    // Optimization: This regex scanning on loop might be heavy but text is short.
    // Note: We used a complex regex in AutoLink to catch surrounding **, let's replicate strictly if needed.
    // Ideally we want to link the *term*. If " **Term** " exists, linking "Term" inside is fine.
    // But AutoLink strategy was: Capture "**Term**" as a single unit to link it all.

    for (const termObj of sortedTerms) {
        const escaped = escapeRegExp(termObj.term);
        // Look for term, optionally surrounded by **
        const regex = new RegExp(escaped, 'gi');

        let m;
        while ((m = regex.exec(cleanText)) !== null) {
            matches.push({
                index: m.index,
                length: m[0].length,
                term: m[0], // This includes ** if present
                slug: termObj.slug
            });
        }
    }

    // Sort by index
    matches.sort((a, b) => a.index - b.index);

    // Filter overlaps
    const activeMatches: typeof matches = [];
    const usedIndices = new Set<number>();
    const linkedSlugs = new Set<string>();

    for (const m of matches) {
        if (linkedSlugs.has(m.slug)) continue;

        let overlaps = false;
        // Check if this match range overlaps with used indices
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

    // Rebuild text with links
    // We have to iterate matches and slice the original text.
    // But since we are creating a Markdown string, we just insert [matchedString](/url).

    let processedText = "";
    let cursor = 0;

    // Sort active matches by index (should be already, but ensure)
    activeMatches.sort((a, b) => a.index - b.index);

    const prefix = country === 'BE' ? '/be' : '';

    for (const m of activeMatches) {
        if (m.index > cursor) {
            processedText += cleanText.slice(cursor, m.index);
        }

        // Insert link
        // Check if it's already inside a link? (Complex detection omitted for now, assuming raw text input)
        // If content has [Link](...), we might break it. But input is usually plain text + bold.
        // We assume 'text' passed here is mostly content with simple styling.

        processedText += `[${m.term}](${prefix}/lexique/${m.slug})`;

        cursor = m.index + m.length;
    }

    if (cursor < cleanText.length) {
        processedText += cleanText.slice(cursor);
    }

    // 2. Render with ReactMarkdown
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ node, ...props }) => (
                        <Link
                            href={props.href || "#"}
                            className="text-brand font-medium hover:underline underline-offset-2 decoration-brand/30 transition-colors"
                        >
                            {props.children}
                        </Link>
                    ),
                    // Ensure bold inside links or outside renders correctly
                    strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,

                    // Style lists if prose doesn't cover it or overrides needed
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="marker:text-brand" {...props} />
                }}
            >
                {processedText}
            </ReactMarkdown>
        </div>
    );
}
