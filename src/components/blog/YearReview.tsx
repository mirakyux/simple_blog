import { motion } from "framer-motion"
import { Calendar, Tag, BookOpen, Award, Sparkles } from "lucide-react"

interface Post {
    slug: string
    title: string
    date: string
    description: string
    tags?: string[]
}

interface YearReviewProps {
    posts: Post[]
}

export function YearReview({ posts }: YearReviewProps) {
    const year = 2025
    const yearPosts = posts.filter(p => new Date(p.date).getFullYear() === year)

    // Stats calculation
    const totalPosts = yearPosts.length
    const allTags = yearPosts.flatMap(p => p.tags || [])
    const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    if (yearPosts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-xl">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No data for {year}</h2>
                    <p className="text-muted-foreground">You didn't publish any posts in the previous year yet.</p>
                    <button
                        onClick={() => window.location.hash = ''}
                        className="mt-6 text-primary hover:underline font-medium"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <section className="min-h-screen py-24 sm:py-32 bg-gradient-to-b from-primary/5 via-background to-accent/5 overflow-hidden">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>YEAR IN REVIEW</span>
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-4 italic">
                        {year} <span className="text-primary">WRAPPED</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        A journey through the vast wilderness of thought. Here's what you created in {year}.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden group"
                    >
                        <Award className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                        <div className="text-5xl font-black mb-2">{totalPosts}</div>
                        <div className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Total Stories Told</div>
                        <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-primary/5 rounded-full blur-2xl" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden group"
                    >
                        <Tag className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-wrap gap-3 mt-4">
                            {topTags.map(([tag, count]) => (
                                <span key={tag} className="px-4 py-2 rounded-xl bg-accent/10 text-accent font-bold text-lg">
                                    #{tag} <span className="text-sm opacity-60">({count})</span>
                                </span>
                            ))}
                        </div>
                        <div className="text-muted-foreground uppercase tracking-widest text-sm font-bold mt-6">Top Themes</div>
                    </motion.div>
                </div>

                {/* Highlights List */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Memorable Moments
                    </h2>
                    <div className="space-y-6">
                        {yearPosts.slice(0, 5).map((post, i) => (
                            <motion.a
                                key={post.slug}
                                href={`#${post.slug}`}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="block bg-card/50 hover:bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all group"
                            >
                                <div className="text-sm text-primary mb-2 font-mono">{post.date}</div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                                <p className="text-muted-foreground mt-2 line-clamp-2 italic">"{post.description}"</p>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Link */}
                <div className="text-center mt-32">
                    <button
                        onClick={() => window.location.hash = ''}
                        className="group inline-flex items-center gap-2 text-lg font-bold hover:text-primary transition-all"
                    >
                        Continue the Journey
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            →
                        </motion.span>
                    </button>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/2" />
        </section>
    )
}
