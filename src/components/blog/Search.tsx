import { useState, useEffect, useCallback, useRef } from "react";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { Search as SearchIcon, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import postsData from "@/data/posts.json";

interface Post {
    slug: string;
    title: string;
    description: string;
    content: string;
    tags?: string[];
}

// Helper function to highlight query matches in text (complete word/phrase matching)
function highlightQuery(text: string, query: string, isSelected: boolean): React.ReactNode {
    if (!text || !query.trim()) return text;

    // Escape special regex characters and create case-insensitive pattern
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    const parts = text.split(regex);
    if (parts.length === 1) return text; // No matches

    return parts.map((part, i) => {
        if (regex.test(part)) {
            // Reset regex lastIndex after test
            regex.lastIndex = 0;
            return (
                <mark
                    key={i}
                    className={`rounded px-0.5 ${isSelected
                        ? "bg-primary-foreground/30 text-primary-foreground font-semibold"
                        : "bg-primary/20 text-primary font-semibold"
                        }`}
                >
                    {part}
                </mark>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

// Get a snippet of content around the first query match
function getContentSnippet(content: string, query: string, contextLength: number = 60): string | null {
    if (!content || !query.trim()) return null;

    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerContent.indexOf(lowerQuery);

    if (matchIndex === -1) return null;

    // Calculate snippet boundaries
    const snippetStart = Math.max(0, matchIndex - contextLength);
    const snippetEnd = Math.min(content.length, matchIndex + query.length + contextLength);

    let snippet = content.slice(snippetStart, snippetEnd);

    // Add ellipsis if truncated
    if (snippetStart > 0) snippet = "..." + snippet;
    if (snippetEnd < content.length) snippet = snippet + "...";

    return snippet;
}

export function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<FuseResult<Post>[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const fuse = new Fuse(postsData, {
        keys: [
            { name: "title", weight: 0.7 },
            { name: "description", weight: 0.4 },
            { name: "tags", weight: 0.5 },
            { name: "content", weight: 0.2 }
        ],
        threshold: 0.1, // Stricter matching to avoid false positives
        ignoreLocation: true,
        useExtendedSearch: true,
        includeMatches: true,
        findAllMatches: true,
        minMatchCharLength: 2,
    });

    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggleOpen();
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, toggleOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }
        const searchResults = fuse.search(query).slice(0, 8);
        setResults(searchResults);
        setSelectedIndex(0);
    }, [query]);

    const handleSelect = (slug: string) => {
        window.location.hash = slug;
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (results.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            handleSelect(results[selectedIndex].item.slug);
        }
    };

    return (
        <>
            <button
                onClick={toggleOpen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:bg-secondary transition-all group"
            >
                <SearchIcon className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Search...</span>
                <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium opacity-50 group-hover:opacity-100 transition-opacity">
                    <Command className="h-3 w-3" />K
                </kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
                        >
                            <div className="flex items-center p-4 border-b border-border/50">
                                <SearchIcon className="h-5 w-5 text-muted-foreground" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search articles, tags, content..."
                                    className="flex-1 bg-transparent border-none outline-none px-4 text-foreground placeholder:text-muted-foreground"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-secondary rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((result, index) => {
                                            const isSelected = selectedIndex === index;
                                            const contentSnippet = getContentSnippet(result.item.content, query);

                                            return (
                                                <div
                                                    key={result.item.slug}
                                                    onClick={() => handleSelect(result.item.slug)}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                    className={`p-3 rounded-xl cursor-pointer transition-all ${isSelected
                                                        ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                                                        : "hover:bg-accent/5 text-foreground"
                                                        }`}
                                                >
                                                    <div className="font-semibold">
                                                        {highlightQuery(result.item.title, query, isSelected)}
                                                    </div>
                                                    <div className={`text-xs line-clamp-1 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                                        {highlightQuery(result.item.description, query, isSelected)}
                                                    </div>
                                                    {contentSnippet && (
                                                        <div className={`text-xs mt-1 line-clamp-2 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                                                            <span className={`text-[10px] font-medium ${isSelected ? "text-primary-foreground/50" : "text-primary/50"}`}>
                                                                内容匹配：
                                                            </span>
                                                            {highlightQuery(contentSnippet, query, isSelected)}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : query ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No results found for "{query}"
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground italic">
                                        Type to start searching...
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-border/50 bg-secondary/30 flex items-center justify-between text-[11px] text-muted-foreground">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 border border-border rounded bg-card">Enter</kbd> to select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 border border-border rounded bg-card">↑↓</kbd> to navigate
                                    </span>
                                </div>
                                <span>{results.length} results</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
