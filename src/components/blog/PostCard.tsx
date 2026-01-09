import { motion } from "framer-motion";

export interface Post {
    slug: string
    title: string
    description: string
    content: string
    date: string
    tags?: string[]
    wordCount: number
    readingTime: number
}

export function PostCard({ post }: { post: Post }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-morphism p-8 transition-all hover:bg-white/5 dark:hover:bg-white/5 active:scale-[0.98]"
        >
            <div>
                <div className="flex items-center gap-x-3 text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    <time dateTime={post.date}>{post.date.split(' ')[0]}</time>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{post.readingTime} min read</span>
                </div>

                <div className="mt-6">
                    <h3 className="text-2xl font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                        <a href={`#${post.slug}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                        </a>
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground/80 font-medium">
                        {post.description}
                    </p>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="rounded-lg bg-primary/5 px-3 py-1 text-[10px] font-bold text-primary/80 ring-1 ring-inset ring-primary/10 glass">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 p-0.5 shadow-inner">
                        <img src="/mirakyux.svg" alt="mirakyux" className="h-full w-full rounded-[10px] object-cover dark:invert" />
                    </div>
                    <span className="text-sm font-bold text-foreground/80 tracking-tight">mirakyux</span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:translate-x-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>
        </motion.article>
    )
}
