import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

export function Hero() {
    return (
        <section className="relative overflow-hidden py-24 sm:py-48 bg-background/50">
            {/* Premium background mesh & Orbit System uses z-0 but placed first to be behind content */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {/* Original Blobs */}
                <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-blue-500/5 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[30%] left-[30%] h-[40%] w-[40%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Asteroid Orbit System */}
                <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] opacity-100">
                    {/* Orbit Path Visualization - Exactly matches the Rx=380/Ry=120 motion */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-primary/20 w-[760px] h-[240px]" />

                    {/* The Asteroid Motion Wrapper (Orbital Position) */}
                    <AsteroidOrbit />
                </div>

                <div className="absolute inset-0 bg-background/20" />
            </div>

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 sm:mb-10 inline-flex items-center gap-3 rounded-full bg-primary/5 px-6 py-2 text-sm font-semibold text-primary glass-morphism ring-1 ring-primary/20"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
                        </span>
                        <span>Latest Experience Awaits</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-4xl text-5xl font-black tracking-tight sm:text-8xl text-gradient px-2"
                    >
                        {import.meta.env.VITE_SITE_TITLE || "mirakyux blog"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 sm:mt-8 max-w-lg sm:max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground/80 font-medium px-4"
                    >
                        {import.meta.env.VITE_SITE_DESCRIPTION || "A vast wilderness, a profound void. Within this expanse, the spark of creation awaits."}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-14 flex items-center gap-x-8"
                    >
                        <button
                            onClick={() => document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative overflow-hidden rounded-2xl bg-primary px-10 py-5 text-base font-bold text-primary-foreground shadow-[0_20px_50px_rgba(8,112,184,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(8,112,184,0.6)] active:scale-95"
                        >
                            <span className="relative z-10">Start Reading</span>
                            <div className="absolute inset-0 z-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function AsteroidOrbit() {
    const x = useMotionValue(380);
    const y = useMotionValue(0);
    const scale = useMotionValue(0.8);

    useAnimationFrame((t) => {
        const duration = 25000; // 25s orbit
        const progress = (t % duration) / duration;
        const rad = progress * Math.PI * 2;

        x.set(380 * Math.cos(rad));
        y.set(120 * Math.sin(rad));
        scale.set(0.8 + 0.3 * Math.sin(rad));
    });

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 w-0 h-0"
            style={{ x, y }}
        >
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 sm:h-12 sm:w-12 text-foreground"
                style={{ scale }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-2xl">
                    <path d="M12,2 C16,1 20,4 22,8 C23,13 19,19 14,21 C9,23 3,20 2,14 C1,9 5,3 12,2 Z" />
                    <circle cx="8" cy="8" r="2.5" className="text-background/40 fill-current" />
                    <circle cx="16" cy="14" r="1.5" className="text-background/40 fill-current" />
                    <circle cx="12" cy="18" r="1" className="text-background/40 fill-current" />
                    <path d="M18,6 L20,5 M4,10 L3,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-background/50" />
                </svg>
            </motion.div>
        </motion.div>
    );
}
