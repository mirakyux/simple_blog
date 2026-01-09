import { motion } from "framer-motion"
import { Tag, Sparkles } from "lucide-react"

interface Post {
    slug: string
    title: string
    date: string
    tags?: string[]
}

interface TagsViewProps {
    posts: Post[]
}

export function TagsView({ posts }: TagsViewProps) {
    const tagCounts = posts.reduce((acc, post) => {
        post.tags?.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

    return (
        <section className="py-32 sm:py-48 bg-background/50">
            <div className="container mx-auto max-w-4xl px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary text-xs font-black uppercase tracking-widest glass mb-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        Taxonomy of Thoughts
                    </div>
                    <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-gradient mb-6">
                        Explore by <span className="text-primary italic font-medium">Topic</span>
                    </h1>
                    <p className="text-lg text-muted-foreground/80 font-medium max-w-xl mx-auto italic">
                        "Categorizing the uncategorizable, tracing the threads of creation across various themes."
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    {sortedTags.map(([tag, count], idx) => (
                        <motion.a
                            key={tag}
                            href={`#/tag/${tag}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group flex items-center gap-6 glass-morphism p-8 transition-all hover:bg-white/5 active:scale-95"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
                                <Tag className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="font-black text-2xl group-hover:text-primary transition-colors tracking-tight">{tag}</h3>
                                <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                                    {count} {count === 1 ? 'article' : 'articles'}
                                </p>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {sortedTags.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 glass rounded-3xl"
                    >
                        <Tag className="h-12 w-12 text-muted-foreground/20 mx-auto mb-6" />
                        <p className="text-lg text-muted-foreground/60 italic">No threads found in this void yet.</p>
                    </motion.div>
                )}

                {/* Decorative mesh */}
                <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
                    <div className="absolute top-[20%] left-[20%] h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
                </div>
            </div>
        </section>
    )
}
