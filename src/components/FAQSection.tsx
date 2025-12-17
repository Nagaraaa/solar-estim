"use client";

import { faqs } from "@/data/faqs";
import { FadeIn } from "@/components/ui/fade-in";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
    city: string;
    country: "FR" | "BE";
}

export function FAQSection({ city, country }: FAQSectionProps) {
    const questions = faqs[country] || [];
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (questions.length === 0) return null;

    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                <FadeIn>
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
                        Questions fréquentes à {city}
                    </h2>

                    <div className="space-y-4">
                        {questions.map((item, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(prev => prev === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                                >
                                    <span className="font-semibold text-slate-800 text-lg">
                                        {item.question.replace("{ville}", city)}
                                    </span>
                                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", openIndex === index && "rotate-180")} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="p-4 pt-2 text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                                                {item.answer.replace("{ville}", city)}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
