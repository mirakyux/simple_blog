import { useEffect, useState } from "react"
import { Navbar } from "./components/layout/Navbar"
import { Footer } from "./components/layout/Footer"
import { Hero } from "./components/blog/Hero"
import { PostGrid } from "./components/blog/PostGrid"
import { PostDetail } from "./components/blog/PostDetail"
import { Timeline } from "./components/blog/Timeline"
import { YearReview } from "./components/blog/YearReview"
import { TagsView } from "./components/blog/TagsView"
import postsData from "./data/posts.json"
import type { Post } from "./components/blog/PostCard"

export function App() {
    const [currentView, setCurrentView] = useState<'home' | 'timeline' | 'year-review' | 'tags' | 'tag' | 'post'>('home')
    const [currentPostSlug, setCurrentPostSlug] = useState<string | null>(null)
    const [activeTag, setActiveTag] = useState<string | null>(null)

    useEffect(() => {
        // Theme initialization - supports "light", "dark", or system default
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else if (savedTheme === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // No saved theme = follow system preference
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", systemPrefersDark);
        }

        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "").replace(/^\//, "")
            if (!hash) {
                setCurrentView('home')
                setCurrentPostSlug(null)
                setActiveTag(null)
            } else if (hash === 'timeline') {
                setCurrentView('timeline')
                setCurrentPostSlug(null)
                setActiveTag(null)
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else if (hash === 'year-review') {
                setCurrentView('year-review')
                setCurrentPostSlug(null)
                setActiveTag(null)
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else if (hash === 'tags') {
                setCurrentView('tags')
                setCurrentPostSlug(null)
                setActiveTag(null)
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else if (hash.startsWith('tag/')) {
                setCurrentView('tag')
                setCurrentPostSlug(null)
                const tag = decodeURIComponent(hash.split('/')[1])
                console.log("Setting active tag:", tag);
                setActiveTag(tag)
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else {
                setCurrentView('post')
                setCurrentPostSlug(decodeURIComponent(hash))
                setActiveTag(null)
                window.scrollTo(0, 0)
            }
        }

        handleHashChange()
        window.addEventListener("hashchange", handleHashChange)
        return () => window.removeEventListener("hashchange", handleHashChange)
    }, []);

    const currentPost = postsData.find(p => p.slug === currentPostSlug)
    const currentIndex = postsData.findIndex(p => p.slug === currentPostSlug)
    const nextPost = currentIndex > 0 ? postsData[currentIndex - 1] : undefined
    const prevPost = currentIndex < postsData.length - 1 ? postsData[currentIndex + 1] : undefined

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20 transition-colors duration-500">
            <Navbar />
            <main>
                {currentView === 'post' && currentPost ? (
                    <PostDetail
                        key={currentPost.slug}
                        post={currentPost as Post}
                        prevPost={prevPost as Post}
                        nextPost={nextPost as Post}
                        onBack={() => { window.location.hash = "" }}
                    />
                ) : currentView === 'timeline' ? (
                    <Timeline posts={postsData as Post[]} />
                ) : currentView === 'year-review' ? (
                    <YearReview posts={postsData as Post[]} />
                ) : currentView === 'tags' ? (
                    <TagsView posts={postsData as Post[]} />
                ) : (
                    <>
                        {currentView === 'home' && <Hero />}
                        <div className={currentView === 'tag' ? "pt-12" : ""}>
                            <PostGrid filterTag={activeTag || undefined} />
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default App

