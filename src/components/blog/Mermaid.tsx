import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

const initMermaid = () => {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: "loose",
        fontFamily: "var(--font-sans)",
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
        },
    });
};

interface MermaidProps {
    chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    // Observe theme changes
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    setTheme(isDark ? 'dark' : 'light');
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (ref.current) {
            const renderDiagram = async () => {
                try {
                    // Re-initialize with current theme before rendering
                    initMermaid();

                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);

                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error("Mermaid render error:", error);
                }
            };
            renderDiagram();
        }
    }, [chart, theme]); // Re-render when chart OR theme changes

    return (
        <div
            ref={ref}
            className="mermaid-container flex justify-center my-8 bg-secondary/20 p-6 rounded-2xl overflow-x-auto shadow-inner border border-border/30"
        />
    );
}
