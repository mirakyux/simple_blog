import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeft, ArrowRight, Clock, User, Tag, Calendar } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Mermaid } from './Mermaid'
import { TableOfContents } from './TableOfContents'
import { generateSlug } from '../../lib/slug'

interface PostDetailProps {
    post: {
        slug: string
        title: string
        date: string
        description: string
        content: string
        tags?: string[]
        wordCount: number
        readingTime: number
    }
    prevPost?: { slug: string; title: string }
    nextPost?: { slug: string; title: string }
    onBack: () => void
}

const HeadingRenderer = ({ level, children, ...props }: any) => {
    // Helper to recursively extract text from children
    const getText = (node: any): string => {
        if (typeof node === 'string') return node
        if (Array.isArray(node)) return node.map(getText).join('')
        if (node?.props?.children) return getText(node.props.children)
        return ''
    }

    const text = getText(children)
    const id = generateSlug(text)
    const Tag = `h${level}` as any

    return (
        <Tag id={id} className="scroll-mt-32 group relative" {...props}>
            {children}
        </Tag>
    )
}

export function PostDetail({ post, prevPost, nextPost, onBack }: PostDetailProps) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const originalTitle = document.title;
        document.title = `${post.title} | ${import.meta.env.VITE_SITE_TITLE || "mirakyux blog"}`;

        // Scroll to top on mount
        window.scrollTo(0, 0);

        const updateMeta = (selector: string, content: string) => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('content', content);
        };

        updateMeta('meta[name="description"]', post.description);
        updateMeta('meta[property="og:title"]', post.title);
        updateMeta('meta[property="og:description"]', post.description);
        updateMeta('meta[property="twitter:title"]', post.title);
        updateMeta('meta[property="twitter:description"]', post.description);

        return () => {
            document.title = originalTitle;
            updateMeta('meta[property="og:title"]', import.meta.env.VITE_SITE_TITLE || "mirakyux blog");
        };
    }, [post]);

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pb-24"
        >
            {/* Reading progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-[120] origin-left"
                style={{ scaleX }}
            />

            {/* Header Section */}
            <header className="relative pt-32 pb-20 overflow-hidden text-center">
                <div className="container mx-auto max-w-5xl px-6 relative z-10 flex flex-col items-center">
                    {/* Mobile Back Button */}
                    <button
                        onClick={onBack}
                        className="lg:hidden self-start mb-8 group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors glass px-4 py-2 rounded-xl"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Exploration
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gradient leading-[1.1] mb-6 max-w-4xl">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-8">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {post.date.split(' ')[0]}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readingTime} min read
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                mirakyux
                            </span>
                        </div>

                        <p className="text-xl text-muted-foreground/80 leading-relaxed font-medium max-w-3xl border-l-0 md:border-l-4 md:border-primary/20 md:pl-6 py-2 border-t-4 border-primary/20 pt-6 md:border-t-0 md:pt-2">
                            {post.description}
                        </p>
                    </motion.div>
                </div>

                {/* Background mesh */}
                <div className="absolute inset-0 -z-10 opacity-30">
                    <div className="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px]" />
                    <div className="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
                </div>
            </header>

            {/* Content Container Grid */}
            <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">

                    {/* Sidebar TOC - Hidden on mobile */}
                    <aside className="hidden lg:block sticky top-32 h-fit">
                        {/* Desktop Back Button */}
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6 pl-2"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Exploration
                        </button>

                        <TableOfContents content={post.content} />
                    </aside>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-morphism rounded-[2.5rem] p-8 md:p-12 lg:p-16 min-w-0 w-full"
                    >
                        <div className="prose prose-lg dark:prose-invert prose-primary max-w-none mx-auto
                            prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-p:font-medium
                            prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-2xl
                            prose-img:rounded-3xl prose-img:shadow-2xl">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        if (match?.[1] === 'mermaid') {
                                            return <Mermaid chart={String(children).replace(/\n$/, '')} />
                                        }
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    h1: (props) => <HeadingRenderer level={1} {...props} />,
                                    h2: (props) => <HeadingRenderer level={2} {...props} />,
                                    h3: (props) => <HeadingRenderer level={3} {...props} />,
                                    h4: (props) => <HeadingRenderer level={4} {...props} />,
                                    h5: (props) => <HeadingRenderer level={5} {...props} />,
                                    h6: (props) => <HeadingRenderer level={6} {...props} />,
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-20 pt-10 border-t border-border/50 flex flex-wrap gap-3 justify-center">
                            {post.tags?.map(tag => (
                                <a
                                    key={tag}
                                    href={`#/tag/${tag}`}
                                    className="flex items-center gap-2 rounded-xl bg-secondary/50 px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary glass"
                                >
                                    <Tag className="h-4 w-4" />
                                    {tag}
                                </a>
                            ))}
                        </div>

                        {/* Post Navigation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/50">
                            {prevPost ? (
                                <a
                                    href={`#${prevPost.slug}`}
                                    onClick={() => window.scrollTo(0, 0)}
                                    className="group flex flex-col items-start gap-2 p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-all glass border border-transparent hover:border-primary/20"
                                >
                                    <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                                        Previous Post
                                    </span>
                                    <span className="text-base md:text-lg font-bold line-clamp-2 text-left group-hover:text-primary transition-colors">
                                        {prevPost.title}
                                    </span>
                                </a>
                            ) : <div />}

                            {nextPost ? (
                                <a
                                    href={`#${nextPost.slug}`}
                                    onClick={() => window.scrollTo(0, 0)}
                                    className="group flex flex-col items-end gap-2 p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-all glass border border-transparent hover:border-primary/20"
                                >
                                    <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                                        Next Post
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <span className="text-base md:text-lg font-bold line-clamp-2 text-right group-hover:text-primary transition-colors">
                                        {nextPost.title}
                                    </span>
                                </a>
                            ) : <div />}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.article>
    )
}
