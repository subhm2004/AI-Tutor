"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeroDashboard } from "@/components/landing/hero-dashboard";
import { LandingBackground } from "@/components/landing/landing-background";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";
import { CtaBanner } from "@/components/landing/cta-banner";
import { FloatingSubjects } from "@/components/landing/floating-subjects";
import { GradientText } from "@/components/landing/gradient-text";
import { StatsRow } from "@/components/landing/stats-row";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { MiniFeatures } from "@/components/landing/mini-features";
import { HowItWorksTimeline } from "@/components/landing/how-it-works-timeline";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { RotatingTopics } from "@/components/landing/rotating-topics";
import { PromptChips } from "@/components/landing/prompt-chips";
import { LiveActivityBar } from "@/components/landing/live-activity-bar";
import { BentoShowcase } from "@/components/landing/bento-showcase";
import { SectionDivider } from "@/components/landing/section-divider";
import { LogoBrand, LogoIcon } from "@/components/brand/logo";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  ImagePlus,
  LogIn,
  MessageSquareText,
  Orbit,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Calculator,
    title: "Math Problem Solving",
    description: "Algebra, calculus & more with LaTeX steps.",
    color: "from-cyan-600 to-indigo-600",
  },
  {
    icon: Orbit,
    title: "Physics Concepts",
    description: "Mechanics, relativity, forces explained clearly.",
    color: "from-cyan-600 to-indigo-600",
  },
  {
    icon: FlaskConical,
    title: "Chemistry Help",
    description: "Reactions, equations & mhchem notation.",
    color: "from-cyan-600 to-indigo-600",
  },
  {
    icon: BookOpen,
    title: "History Guides",
    description: "Timelines, causes & context for events.",
    color: "from-cyan-600 to-indigo-600",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create account",
    description: "Sign up in seconds and open your study workspace.",
    icon: LogIn,
  },
  {
    step: "02",
    title: "Ask anything",
    description: "Type a doubt or upload a photo of the problem.",
    icon: MessageSquareText,
  },
  {
    step: "03",
    title: "Learn faster",
    description: "Get routed to the right agent with step-by-step help.",
    icon: GraduationCap,
  },
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
      "Step-by-step chemistry before tests saves me hours every week.",
    rating: 5,
  },
  {
    name: "Rohan P.",
    role: "Self-learner",
    subject: "History",
    quote:
      "Follow-up questions in one thread feel like a patient tutor.",
    rating: 5,
  },
  {
    name: "Priya S.",
    role: "JEE aspirant",
    subject: "Math",
    quote:
      "Calculus at midnight with clear LaTeX steps — regenerate if I need another angle.",
    rating: 5,
  },
  {
    name: "Kabir D.",
    role: "Class 11 · PCM",
    subject: "Physics",
    quote:
      "Uploaded a notebook diagram and got a proper explanation. Huge for homework.",
    rating: 5,
  },
  {
    name: "Ananya T.",
    role: "College · Humanities",
    subject: "History",
    quote: "WWI causes revision in 10 minutes. Clean UI — just learning.",
    rating: 5,
  },
];

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Get started", href: "#get-started" },
  ],
  subjects: [
    { label: "Mathematics", href: "/login" },
    { label: "Physics", href: "/login" },
    { label: "Chemistry", href: "/login" },
    { label: "History", href: "/login" },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <LandingBackground />

      <header
        className={`sticky top-0 z-50 mx-auto w-full max-w-7xl px-6 pt-4 transition-all duration-300`}
      >
        <motion.nav
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className={`flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-md ${
            isScrolled
              ? "border-slate-200/90 bg-white/88 shadow-lg dark:border-slate-800 dark:bg-slate-900/85"
              : "border-slate-200/70 bg-white/75 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          }`}
        >
          <Link href="/">
            <LogoBrand size="md" showTagline tagline="Learn smarter, every day" />
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a
              href="#features"
              className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              How it works
            </a>
            <a
              href="#testimonials"
              className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Reviews
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              className="hidden h-9 rounded-lg sm:inline-flex"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 text-white shadow-md hover:from-cyan-700 hover:to-indigo-700"
            >
              <Link href="/login">Get started</Link>
            </Button>
          </div>
        </motion.nav>
      </header>

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-cyan-200 bg-white/70 px-4 py-1.5 text-sm text-cyan-700 shadow-sm backdrop-blur dark:border-cyan-900 dark:bg-slate-900/60 dark:text-cyan-300"
            >
              <LogoIcon size="xs" className="shadow-sm" />
              <span>
                Master <RotatingTopics /> with IntellectA
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] dark:text-slate-100"
            >
              Learn faster with your{" "}
              <GradientText>AI Study Partner</GradientText>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            >
              Ask doubts, upload problem images, and get step-by-step explanations
              with beautiful math formulas — Math, Physics, Chemistry & History in
              one focused chat.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-8 text-base text-white shadow-lg hover:from-cyan-700 hover:to-indigo-700"
              >
                <Link
                  href="/login"
                  className="relative flex items-center overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 btn-shimmer opacity-60"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-slate-200 px-8 text-base dark:border-slate-700"
              >
                <Link href="/login">Try demo chat</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp}>
              <PromptChips />
            </motion.div>

            <motion.div variants={fadeUp}>
              <StatsRow />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.15 },
              scale: { duration: 0.7, delay: 0.15 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="relative min-h-[420px] lg:pl-4"
          >
            <FloatingSubjects />
            <HeroDashboard />
          </motion.div>
        </div>
      </section>

      <LiveActivityBar />

      <TrustMarquee />

      <section id="features" className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
            Everything you need to learn smarter
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Multi-agent routing, rich math rendering, and a clean chat built for focus.
          </p>
        </ScrollReveal>

        <FeatureGrid features={features} />

        <MiniFeatures
          items={[
            { icon: Zap, title: "Quick responses", text: "Get answers in seconds" },
            { icon: ShieldCheck, title: "Secure login", text: "JWT authentication" },
            { icon: ImagePlus, title: "Image upload", text: "Snap & ask from notes" },
            { icon: Rocket, title: "Regenerate", text: "Retry any AI answer" },
          ]}
        />
      </section>

      <SectionDivider />
      <BentoShowcase />
      <SectionDivider />

      <section
        id="how-it-works"
        className="relative border-t border-slate-200/70 bg-slate-50/80 py-20 dark:border-slate-800 dark:bg-slate-900/40 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Start learning in 3 steps
            </h2>
          </ScrollReveal>
          <HowItWorksTimeline steps={howItWorks} />
        </div>
      </section>

      <TestimonialsMarquee items={testimonials} />

      <CtaBanner />

      <footer className="relative border-t border-slate-200/80 bg-slate-900 text-slate-300 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <LogoBrand
                size="md"
                nameClassName="text-lg text-white"
                className="[&_p]:hidden"
              />
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Your intelligent study companion for Math, Physics, Chemistry,
                and History.
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
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>Exam preparation</li>
                <li>Daily homework</li>
                <li>Concept revision</li>
                <li>Self-paced learning</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} IntellectA. All rights reserved.
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
