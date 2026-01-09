import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Search } from "../blog/Search";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Clock, Hash, Zap, Rss, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavLink {
    name: string;
    href: string;
    icon: LucideIcon;
}

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getNavLinks = () => {
        try {
            const envLinks = JSON.parse(import.meta.env.VITE_NAV_LINKS || '[]');
            const iconMap: Record<string, any> = {
                'Articles': BookOpen,
                'Explore': BookOpen,
                'Timeline': Clock,
                'Tags': Hash,
                'Review': Zap,
                'Yearly': Zap,
                'About': User,
            };

            return envLinks.map((link: any) => ({
                name: link.label,
                href: link.url,
                icon: iconMap[Object.keys(iconMap).find(key => link.label.includes(key)) || ''] || BookOpen
            }));
        } catch (e) {
            console.error('Error parsing VITE_NAV_LINKS:', e);
            return [
                { name: "Explore", href: "#/", icon: BookOpen },
                { name: "Timeline", href: "#timeline", icon: Clock },
                { name: "Tags", href: "#tags", icon: Hash },
                { name: "Yearly", href: "#year-review", icon: Zap },
            ];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "py-3" : "py-6"}`}>
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`relative px-4 py-3 rounded-2xl transition-all duration-500 ${isScrolled ? "glass-morphism shadow-2xl" : "bg-transparent"}`}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.a
                            href="#/"
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 group"
                        >
                            <div className="h-10 w-10 overflow-hidden rounded-xl bg-primary/10 p-1.5 transition-transform group-hover:rotate-6 glass">
                                <img src="/mirakyux.svg" alt="mirakyux" className="h-full w-full object-cover dark:invert" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-gradient hidden sm:block">
                                mirakyux
                            </span>
                        </motion.a>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1 bg-secondary/30 rounded-xl p-1 glass">
                            {navLinks.map((link: NavLink) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/5"
                                >
                                    <link.icon className="h-3.5 w-3.5" />
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Search />

                            <div className="hidden sm:block">
                                <ThemeToggle />
                            </div>

                            <a
                                href="/rss.xml"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 px-4 py-2 text-sm font-bold text-primary transition-all glass"
                            >
                                <Rss className="h-4 w-4" />
                                <span>RSS</span>
                            </a>

                            {/* Mobile Actions Container */}
                            <div className="flex lg:hidden items-center gap-2">
                                <div className="sm:hidden">
                                    <ThemeToggle />
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2.5 rounded-xl glass hover:bg-primary/5 text-muted-foreground transition-all active:scale-95"
                                >
                                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[-1] lg:hidden"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="lg:hidden glass-morphism mx-4 mt-2 rounded-[2rem] overflow-hidden shadow-2xl border border-border/50 p-2"
                        >
                            <div className="space-y-1">
                                {navLinks.map((link: NavLink) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 px-6 py-4 text-base font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.name}
                                    </a>
                                ))}
                                <a
                                    href="/rss.xml"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 px-6 py-4 text-base font-bold text-primary hover:bg-primary/5 rounded-2xl transition-all"
                                >
                                    <Rss className="h-5 w-5" />
                                    RSS Feed
                                </a>
                                <div className="px-6 py-4 flex items-center justify-between border-t border-border/50 mt-2 pt-6">
                                    <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
