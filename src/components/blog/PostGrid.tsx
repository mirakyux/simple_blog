import { useState } from "react"
import { motion } from "framer-motion"
import type { Post } from "./PostCard"
import { PostCard } from "./PostCard"
import { PostListItem } from "./PostListItem"
import { LayoutGrid, List, X } from "lucide-react"
import postsData from "@/data/posts.json"

interface PostGridProps {
    filterTag?: string
}

export function PostGrid({ filterTag }: PostGridProps) {
    const [viewStyle, setViewStyle] = useState<'card' | 'list'>('card')

    const filteredPosts = filterTag
        ? (postsData as Post[]).filter(p => p.tags?.includes(filterTag))
        : (postsData as Post[])

    return (
        <section id="posts" className="py-24 sm:py-32 relative">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
                    {filterTag ? (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <h2 className="text-3xl font-black tracking-tight text-gradient">
                                Filtering <span className="text-primary/60 italic font-medium">#{filterTag}</span>
                            </h2>
                            <button
                                onClick={() => { window.location.hash = '' }}
                                className="p-2 glass hover:bg-primary/10 rounded-xl text-primary transition-all shadow-lg active:scale-95"
                                title="Clear filter"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </motion.div>
                    ) : (
                        <h2 className="text-3xl font-black tracking-tight text-gradient">Recent Expeditions</h2>
                    )}

                    <div className="inline-flex items-center rounded-2xl p-1.5 glass shadow-xl border border-border/50">
                        <button
                            onClick={() => setViewStyle('card')}
                            className={`p-2 rounded-md transition-all ${viewStyle === 'card' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                            title="Card View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewStyle('list')}
                            className={`p-2 rounded-md transition-all ${viewStyle === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {filteredPosts.length > 0 ? (
                    <>
                        {viewStyle === 'card' ? (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredPosts.map((post) => (
                                    <PostCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col max-w-4xl mx-auto">
                                {filteredPosts.map((post) => (
                                    <PostListItem key={post.slug} post={post} />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-6 h-px w-24 bg-border/50" />
                        <h2 className="text-2xl font-light tracking-[0.2em] text-muted-foreground uppercase">
                            No posts found
                        </h2>
                        <p className="mt-4 text-sm text-muted-foreground/60 italic">
                            {filterTag ? `No posts matching "${filterTag}"` : "(Start writing in content/posts to see them here...)"}
                        </p>
                        <div className="mt-6 h-px w-24 bg-border/50" />
                    </div>
                )}
            </div>
        </section>
    )
}
