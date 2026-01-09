import { motion } from "framer-motion"
import { Calendar, ChevronRight } from "lucide-react"

interface TimelinePost {
    slug: string
    title: string
    date: string
    description: string
}

interface TimelineProps {
    posts: TimelinePost[]
}

export function Timeline({ posts }: TimelineProps) {
    const groupedPosts = posts.reduce((groups, post) => {
        const date = new Date(post.date)
        const year = date.getFullYear()
        const month = date.toLocaleString('default', { month: 'long' })

        if (!groups[year]) groups[year] = {}
        if (!groups[year][month]) groups[year][month] = []
        groups[year][month].push(post)
        return groups
    }, {} as Record<number, Record<string, TimelinePost[]>>)

    const years = Object.keys(groupedPosts).map(Number).sort((a, b) => b - a)

    return (
        <section className="py-32 sm:py-48 bg-background/50">
            <div className="container mx-auto max-w-4xl px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 text-center"
                >
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-gradient mb-6">
                        Chronicles
                    </h2>
                    <p className="text-lg text-muted-foreground/80 font-medium">
                        A retrospective journey through thoughts and creations.
                    </p>
                </motion.div>

                <div className="space-y-24">
                    {years.map(year => (
                        <div key={year} className="relative">
                            <div className="sticky top-24 z-10 flex items-center gap-6 mb-12">
                                <h3 className="text-6xl font-black tracking-tighter text-primary/10 select-none italic uppercase">
                                    {year}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                            </div>

                            <div className="space-y-16 ml-6 border-l-2 border-dashed border-border/50 pl-10">
                                {Object.keys(groupedPosts[year]).sort((a, b) => {
                                    return new Date(`${b} 1, ${year}`).getTime() - new Date(`${a} 1, ${year}`).getTime()
                                }).map(month => (
                                    <div key={month} className="relative">
                                        <div className="absolute -left-[51px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background shadow-lg" />

                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-8 flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {month}
                                        </h4>

                                        <div className="space-y-8">
                                            {groupedPosts[year][month].map((post, idx) => (
                                                <motion.div
                                                    key={post.slug}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    viewport={{ once: true }}
                                                    whileHover={{ x: 5 }}
                                                    className="group glass p-6 rounded-2xl transition-all hover:bg-white/5"
                                                >
                                                    <a href={`#${post.slug}`} className="flex items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h5 className="text-xl font-black transition-colors group-hover:text-primary leading-tight">
                                                                {post.title}
                                                            </h5>
                                                            <p className="mt-3 text-sm text-muted-foreground/80 line-clamp-2 font-medium">
                                                                {post.description}
                                                            </p>
                                                            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                                                {new Date(post.date).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                                                            <ChevronRight className="h-5 w-5" />
                                                        </div>
                                                    </a>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
