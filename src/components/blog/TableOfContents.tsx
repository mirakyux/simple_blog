import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { generateSlug } from '../../lib/slug'

interface TableOfContentsProps {
    content: string
}

interface Heading {
    id: string
    text: string
    level: number
    parentId: string | null
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('')
    const [clickedId, setClickedId] = useState<string | null>(null)
    const [headings, setHeadings] = useState<Heading[]>([])
    const isScrolling = useRef(false)

    // Parse headings and establish hierarchy
    useEffect(() => {
        const lines = content.split(/\r?\n/)
        const extractedHeadings: Heading[] = []
        let inCodeBlock = false

        // Stack to track current parents at each level: index = level
        // e.g. parentStack[2] = current H2 id
        const parentStack: { [level: number]: string } = {}

        for (const line of lines) {
            // Check for code block fences
            if (/^\s*```/.test(line)) {
                inCodeBlock = !inCodeBlock
                continue
            }
            if (inCodeBlock) continue

            // Match headers # to ######, allowing leading spaces
            const match = line.match(/^\s*(#{1,6})\s+(.+)$/)
            if (match) {
                const text = match[2].trim()
                if (!text) continue;

                const level = match[1].length
                const id = generateSlug(text)

                // Clear any parents of deeper levels
                for (let i = level + 1; i <= 6; i++) {
                    delete parentStack[i]
                }

                // Find nearest parent
                let parentId = null
                for (let i = level - 1; i >= 1; i--) {
                    if (parentStack[i]) {
                        parentId = parentStack[i]
                        break
                    }
                }

                extractedHeadings.push({
                    level,
                    text,
                    id,
                    parentId
                })

                parentStack[level] = id
            }
        }

        setHeadings(extractedHeadings)
    }, [content])

    // Detect active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrolling.current) return
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -40% 0px' }
        )

        headings.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [headings])

    // Calculate which IDs should be expanded
    const expandedIds = useMemo(() => {
        const expanded = new Set<string>()
        if (!activeId) return expanded

        let current = headings.find(h => h.id === activeId)

        // Add active item
        if (current) expanded.add(current.id)

        // Traverse up
        while (current && current.parentId) {
            expanded.add(current.parentId)
            current = headings.find(h => h.id === current?.parentId)
        }

        return expanded
    }, [activeId, headings])

    if (headings.length === 0) return null

    const minLevel = Math.min(...headings.map(h => h.level))

    return (
        <nav className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar pl-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 pl-2">
                On This Page
            </h4>
            <ul className="space-y-1 text-sm">
                <AnimatePresence initial={false}>
                    {headings.map((heading) => {
                        const isVisible =
                            heading.level === minLevel ||
                            (heading.parentId && expandedIds.has(heading.parentId))

                        if (!isVisible) return null

                        return (
                            <motion.li
                                key={heading.id}
                                initial={{ opacity: 0, height: 0, x: -10 }}
                                animate={{ opacity: 1, height: 'auto', x: 0 }}
                                exit={{ opacity: 0, height: 0, x: -10 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.preventDefault()

                                        // Lock the observer immediately
                                        isScrolling.current = true
                                        setClickedId(heading.id)

                                        const element = document.getElementById(heading.id)
                                        if (element) {
                                            const rect = element.getBoundingClientRect()
                                            const top = rect.top + window.scrollY - 100 // Visual offset
                                            window.scrollTo({ top, behavior: 'smooth' })
                                        }

                                        // Wait for scroll to complete before updating state
                                        // Prevents layout shifts from cancelling the active scroll
                                        setTimeout(() => {
                                            setActiveId(heading.id)
                                            setClickedId(null)
                                            isScrolling.current = false
                                        }, 800)
                                    }}
                                    className={cn(
                                        "block py-1.5 px-3 rounded-md transition-all duration-200 border-l-2 relative cursor-pointer",
                                        // Dynamic Indentation based on level difference from minLevel
                                        heading.level === minLevel ? "pl-3" :
                                            heading.level === minLevel + 1 ? "pl-6" :
                                                heading.level === minLevel + 2 ? "pl-9" : "pl-12",

                                        // Active styling
                                        (clickedId ? clickedId === heading.id : activeId === heading.id)
                                            ? "bg-secondary text-primary font-bold border-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-transparent"
                                    )}
                                >
                                    {heading.text}
                                </div>
                            </motion.li>
                        )
                    })}
                </AnimatePresence>
            </ul>
        </nav>
    )
}

