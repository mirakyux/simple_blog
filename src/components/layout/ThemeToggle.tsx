import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle() {
    const [mode, setMode] = useState<ThemeMode>("system");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Apply theme based on mode
    const applyTheme = (themeMode: ThemeMode) => {
        if (themeMode === "system") {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", systemPrefersDark);
        } else {
            document.documentElement.classList.toggle("dark", themeMode === "dark");
        }
    };

    useEffect(() => {
        // Initialize mode from localStorage, default to "system"
        const savedMode = localStorage.getItem("theme") as ThemeMode | null;
        const initialMode = savedMode || "system";
        setMode(initialMode);
        applyTheme(initialMode);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemChange = () => {
            const currentMode = (localStorage.getItem("theme") as ThemeMode) || "system";
            if (currentMode === "system") {
                applyTheme("system");
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectMode = (newMode: ThemeMode) => {
        setMode(newMode);
        if (newMode === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", newMode);
        }
        applyTheme(newMode);
        setIsOpen(false);
    };

    const getCurrentIcon = () => {
        if (mode === "light") return <Sun size={18} />;
        if (mode === "dark") return <Moon size={18} />;
        return <Monitor size={18} />;
    };

    const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
        { value: "light", label: "浅色", icon: <Sun size={16} /> },
        { value: "dark", label: "深色", icon: <Moon size={16} /> },
        { value: "system", label: "跟随系统", icon: <Monitor size={16} /> },
    ];

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                title="主题设置"
            >
                {getCurrentIcon()}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-36 py-1.5 rounded-xl glass-morphism border border-border/50 shadow-xl z-50"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => selectMode(option.value)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${mode === option.value
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {option.icon}
                                <span className="font-medium">{option.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
