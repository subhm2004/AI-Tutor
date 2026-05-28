"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, BookOpen, Zap } from "lucide-react";
import { IntellectALogoMark } from "@/components/brand/logo";
import { TypingIndicator } from "./typing-indicator";

export function HeroDashboard() {
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowReply(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative z-10 mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -inset-4 rounded-full bg-cyan-500/15 blur-3xl dark:bg-cyan-600/20" />
      <div className="absolute -right-8 top-1/4 h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl dark:bg-indigo-600/20" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-1 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-cyan-950/20"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-indigo-500/10"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex items-center gap-2 border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
            intellecta.app/chat
          </span>
        </div>

        <div className="space-y-3 p-4">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="relative ml-auto max-w-[88%] rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-3 py-2.5 text-xs text-white shadow-md shadow-cyan-900/20"
          >
            In special relativity, is time absolute or relative?
          </motion.div>
          <AnimatePresence mode="wait">
            {!showReply ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-[72%] rounded-xl border border-slate-200/80 bg-slate-50/90 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/70"
              >
                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <IntellectALogoMark className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  Physics Agent is typing
                  <TypingIndicator />
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="reply"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="relative max-w-[92%] rounded-xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-slate-800 dark:bg-slate-950/70"
              >
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <IntellectALogoMark className="h-3 w-3 text-cyan-700 dark:text-cyan-300" />
                  Physics Agent
                </span>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  Time is{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    relative
                  </span>{" "}
                  — moving clocks run slower. Two observers can disagree on
                  &ldquo;now&rdquo; without either being wrong.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative grid grid-cols-3 gap-2 pt-1">
            {["Math", "Chem", "Hist"].map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.12 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg border border-slate-200/70 bg-white/80 px-2 py-1.5 text-center text-[10px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
              >
                {s}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { delay: 0.5, duration: 0.5 },
          x: { delay: 0.5, duration: 0.5 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute -right-2 top-8 z-10 w-36 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:-right-6 sm:w-40"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
            <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Response</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              &lt; 2s
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 0.65, duration: 0.5 },
          x: { delay: 0.65, duration: 0.5 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
        className="absolute -left-2 bottom-16 z-10 w-40 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:-left-8 sm:w-44"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-950/50">
            <BookOpen className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Subjects</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              4 agents
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -bottom-4 left-1/4 z-10 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative flex h-2 w-2"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </motion.span>
        <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
          24/7 online
        </span>
      </motion.div>
    </div>
  );
}
