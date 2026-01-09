import type { Post } from "./PostCard"

export function PostListItem({ post }: { post: Post }) {
    return (
        <article className="group relative flex flex-col sm:flex-row sm:items-center justify-between py-8 border-b border-border/50 hover:bg-accent/5 transition-all px-4 -mx-4 rounded-xl">
            <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-x-4 text-xs mb-3">
                    <time dateTime={post.date} className="text-muted-foreground">{post.date}</time>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="text-muted-foreground">{post.readingTime} min read</span>
                    {post.tags?.[0] && (
                        <a
                            href={`#/tag/${post.tags[0]}`}
                            className="relative z-20 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                            {post.tags[0]}
                        </a>
                    )}
                </div>
                <h3 className="text-xl font-bold leading-6 tracking-tight transition-colors group-hover:text-primary">
                    <a href={`#${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                    </a>
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                    {post.description}
                </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-x-3 shrink-0">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-foreground">mirakyux</p>
                    <p className="text-xs text-muted-foreground">Author</p>
                </div>
                <img src="/mirakyux.svg" alt="mirakyux" className="h-8 w-8 rounded-full ring-1 ring-border dark:invert" />
                <div className="sm:hidden text-sm font-semibold">mirakyux</div>
            </div>
        </article>
    )
}
