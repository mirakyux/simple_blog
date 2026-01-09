export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-background py-12">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <img src="/mirakyux.svg" alt="mirakyux" className="h-6 w-6 opacity-80 dark:invert" />
                        <span className="text-lg font-bold tracking-tight opacity-80">{import.meta.env.VITE_SITE_TITLE || "mirakyux blog"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {import.meta.env.VITE_SITE_TITLE || "mirakyux"}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com/mirakyux" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
