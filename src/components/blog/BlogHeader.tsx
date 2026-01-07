"use client";

import { motion } from "framer-motion";

export function BlogHeader() {
    return (
        <div className="text-center mb-24 relative">
            {/* Decorative background blur - Breathing Animation */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[100px] bg-amber-400/30 blur-[60px] rounded-full -z-10"
            />

            {/* Badge - Slide Down Fade */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-amber-600 uppercase bg-white shadow-sm ring-1 ring-slate-200/50 rounded-full hover:shadow-md transition-shadow cursor-default">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Actualités & Conseils
                </span>
            </motion.div>

            {/* Title - Slide Up Fade */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 mb-6 tracking-tight pb-2 leading-tight drop-shadow-sm"
            >
                Le Blog Solaire
            </motion.h1>

            {/* Subtitle - Slide Up Fade (Delayed) */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
            >
                Décrypter le marché de l'énergie pour vous aider à faire les bons choix.
            </motion.p>
        </div>
    );
}
