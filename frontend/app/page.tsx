"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calculator,
  FlaskConical,
  Orbit,
  Sparkles,
  GraduationCap,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ImagePlus,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";

const features = [
  {
    icon: Calculator,
    title: "Math Problem Solving",
    description: "Step-by-step help for algebra, calculus, and more.",
  },
  {
    icon: Orbit,
    title: "Physics Concepts",
    description: "Understand mechanics, forces, motion, and formulas.",
  },
  {
    icon: FlaskConical,
    title: "Chemistry Assistance",
    description: "Get quick guidance for reactions, equations, and basics.",
  },
  {
    icon: BookOpen,
    title: "History Explanations",
    description: "Learn timelines, events, and causes with clarity.",
  },
];

const highlights = [
  "Multi-subject tutoring in one chat",
  "Fast responses powered by Groq",
  "Clean UI with dark/light theme",
  "Conversation history with smart sidebar",
];

const stats = [
  { label: "Subjects", value: "4+" },
  { label: "Response speed", value: "< 2s*" },
  { label: "Learning mode", value: "24/7" },
];

const socialProof = [
  "Trusted by self-learners",
  "Built for exam prep",
  "Great for daily revision",
  "Simple, distraction-free UI",
];

const testimonials = [
  {
    name: "Aarav K.",
    role: "Class 12 · Science",
    subject: "Physics",
    quote:
      "Special relativity finally clicked — time dilation explained better than my textbook.",
    rating: 5,
  },
  {
    name: "Sneha M.",
    role: "Undergrad · Chemistry",
    subject: "Chemistry",
    quote:
      "I use it for quick revision before tests. Step-by-step chemistry saves me hours every week.",
    rating: 5,
  },
  {
    name: "Rohan P.",
    role: "Self-learner",
    subject: "History",
    quote:
      "Follow-up questions in one thread feel like a patient tutor, not a wall of text.",
    rating: 5,
  },
  {
    name: "Priya S.",
    role: "JEE aspirant",
    subject: "Math",
    quote:
      "Calculus doubts at midnight — clear LaTeX steps and I can regenerate if I want another explanation.",
    rating: 5,
  },
  {
    name: "Kabir D.",
    role: "Class 11 · PCM",
    subject: "Physics",
    quote:
      "Uploaded a diagram from my notebook and got a proper explanation. Huge for homework.",
    rating: 5,
  },
  {
    name: "Ananya T.",
    role: "College · Humanities",
    subject: "History",
    quote:
      "WWI causes revision in 10 minutes. Clean UI, no clutter — just learning.",
    rating: 5,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Sign in & ask",
    description: "Create an account and type any doubt — text or image.",
    icon: LogIn,
  },
  {
    step: "02",
    title: "Smart subject routing",
    description: "AI picks Math, Physics, Chemistry, or History automatically.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Learn & revise",
    description: "Pin chats, regenerate answers, and pick up where you left off.",
    icon: GraduationCap,
  },
];

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Open Chat", href: "/login" },
  ],
  subjects: [
    { label: "Mathematics", href: "/login" },
    { label: "Physics", href: "/login" },
    { label: "Chemistry", href: "/login" },
    { label: "History", href: "/login" },
  ],
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const heroContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePosition({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="pointer-events-none absolute -top-36 -left-20 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-600/15"
        animate={{ x: [0, 24, 0], y: [0, -14, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-36 -right-20 h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-700/15"
        animate={{ x: [0, -22, 0], y: [0, 14, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="pointer-events-none absolute left-1/3 top-16 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl dark:bg-cyan-500/10"
        style={{
          transform: `translate3d(${mousePosition.x * 14}px, ${mousePosition.y * 10}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-1/4 top-28 h-44 w-44 rounded-full bg-indigo-300/10 blur-2xl dark:bg-indigo-600/10"
        style={{
          transform: `translate3d(${mousePosition.x * -16}px, ${mousePosition.y * -12}px, 0)`,
        }}
      />

      <header className="sticky top-0 z-50 mx-auto w-full max-w-6xl px-6 pt-4">
        <nav
          className={`flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-md transition-all duration-300 ${
            isScrolled
              ? "border-slate-200/90 bg-white/88 shadow-lg dark:border-slate-800 dark:bg-slate-900/85"
              : "border-slate-200/70 bg-white/75 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                AI Tutor
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learn smarter, every day
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a href="#features" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
              How it works
            </a>
            <a href="#testimonials" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
              Reviews
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden h-9 rounded-lg sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="h-9 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 text-white">
              <Link href="/login">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <motion.section
        variants={heroContainer}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-10 sm:pt-14"
      >
        <motion.div
          variants={heroItem}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-4 py-1.5 text-sm text-cyan-700 shadow-sm backdrop-blur dark:border-cyan-900 dark:bg-slate-900/60 dark:text-cyan-300"
        >
          <Sparkles className="h-4 w-4" />
          AI Tutor for smart learning
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="mt-6 max-w-4xl text-center text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100"
        >
          Learn faster with your
          <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            {" "}
            AI Study Partner
          </span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-5 max-w-2xl text-center text-base text-slate-600 sm:text-lg dark:text-slate-300"
        >
          Ask doubts, upload problem images, and get step-by-step explanations
          with beautiful math formulas — Math, Physics, Chemistry & History in
          one focused chat.
        </motion.p>

        <motion.div
          variants={heroItem}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            className="h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-cyan-700 hover:to-indigo-700"
          >
            <Link href="/login">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-6">
            <Link href="/login">Try Demo Chat</Link>
          </Button>
        </motion.div>

        <motion.div
          id="preview"
          variants={heroItem}
          className="group mt-10 w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70"
          onMouseMove={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            setTilt({
              x: (py - 0.5) * -8,
              y: (px - 0.5) * 10,
            });
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 120ms ease-out",
          }}
        >
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live AI Session Preview
              </p>
              <div className="space-y-3">
                <div className="ml-auto max-w-[85%] rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-3 text-sm text-white shadow">
                  In special relativity, is time absolute or relative?
                </div>
                <div className="max-w-[92%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <span className="mb-2 inline-block rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                    Physics Agent
                  </span>
                  <br />
                  In special relativity, time is <strong>relative</strong> — not
                  absolute. Moving clocks tick slower (time dilation). Two
                  observers can disagree on &ldquo;now&rdquo; without either being
                  wrong.
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-indigo-50 p-5 dark:border-cyan-900 dark:from-cyan-950/30 dark:to-indigo-950/20">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Why students love AI Tutor
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Clear explanations, no jargon
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Multi-subject support in one place
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Works great for quick revision
                </li>
              </ul>
              <Button asChild className="mt-5 w-full rounded-xl">
                <Link href="/login">Start This Experience</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={heroItem}
          className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {highlights.map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {item}
            </div>
          ))}
        </motion.div>

        <motion.section
          id="how-it-works"
          variants={heroItem}
          className="mt-16 w-full"
        >
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Three steps to smarter study
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
              >
                <span className="text-4xl font-bold text-cyan-500/20 dark:text-cyan-400/15">
                  {item.step}
                </span>
                <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          id="features"
          variants={heroItem}
          className="mt-14 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(6,182,212,0.1),rgba(99,102,241,0.35),rgba(6,182,212,0.1))] opacity-60 animate-[spin_8s_linear_infinite]" />
              <div className="relative rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={heroItem}
          className="mt-6 grid w-full gap-4 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={heroItem}
          className="mt-12 grid w-full gap-4 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <MessageSquareText className="h-5 w-5 text-cyan-500" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
              Natural Conversations
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Ask in simple language and get easy-to-understand responses.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <Rocket className="h-5 w-5 text-indigo-500" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
              Fast + Focused
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Optimized for quick doubt solving and revision sessions.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
              Reliable Study Companion
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Built for practice, explanation clarity, and consistent learning.
            </p>
          </div>
        </motion.div>

      </motion.section>

      <TestimonialsMarquee items={testimonials} />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-6xl px-6 pb-4 pt-4"
      >
        <div className="w-full rounded-3xl border border-cyan-200/80 bg-gradient-to-r from-cyan-600 via-cyan-600 to-indigo-600 p-8 text-white shadow-xl dark:border-cyan-900">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <GraduationCap className="h-4 w-4" />
                Ready for focused learning?
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Start your first AI-powered study session.
              </h2>
            </div>
            <Button
              asChild
              className="h-11 rounded-xl bg-white px-6 text-cyan-700 hover:bg-slate-100"
            >
              <Link href="/login">
                Open AI Tutor
                <Brain className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          Built for students who want speed + clarity
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          {socialProof.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-center text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </motion.section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <Clock className="h-8 w-8 shrink-0 text-cyan-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                24/7 availability
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Study anytime, anywhere
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <ImagePlus className="h-8 w-8 shrink-0 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Image questions
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Snap & upload problems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <Sparkles className="h-8 w-8 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                LaTeX math & chem
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clear formulas on screen
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mt-4 border-t border-slate-200/80 bg-slate-900 text-slate-300 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">AI Tutor</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Your intelligent study companion for Math, Physics, Chemistry,
                and History. Learn faster with clear, conversational help.
              </p>
              <Button
                asChild
                className="mt-5 h-10 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-700 hover:to-indigo-700"
              >
                <Link href="/login">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Subjects
              </h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.subjects.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Built for
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>Exam preparation</li>
                <li>Daily homework help</li>
                <li>Concept revision</li>
                <li>Self-paced learning</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} AI Tutor. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Made for learners who want clarity, speed, and focus.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
