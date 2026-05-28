"use client";

import { Star } from "lucide-react";

export interface TestimonialItem {
  name: string;
  role: string;
  subject: string;
  quote: string;
  rating: number;
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <article className="w-[min(88vw,360px)] shrink-0 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-md shadow-slate-200/40 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-black/30">
      <div className="flex items-center gap-1">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-700">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {item.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-cyan-50 to-indigo-50 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:from-cyan-950/50 dark:to-indigo-950/50 dark:text-cyan-300">
          {item.subject}
        </span>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: TestimonialItem[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <div
      className={`flex w-max gap-4 py-2 ${
        reverse
          ? "animate-testimonial-marquee-reverse"
          : "animate-testimonial-marquee"
      }`}
    >
      {loop.map((item, index) => (
        <TestimonialCard key={`${item.name}-${index}`} item={item} />
      ))}
    </div>
  );
}

export function TestimonialsMarquee({ items }: { items: TestimonialItem[] }) {
  const rowB = [...items].reverse();

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden border-y border-slate-200/60 bg-slate-100/50 py-14 dark:border-slate-800/60 dark:bg-slate-950/50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          Testimonials
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Students actually enjoy learning here
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Real feedback from learners using AI Tutor for doubts, revision, and
          exam prep — Math, Physics, Chemistry & History.
        </p>
      </div>

      <div className="relative mt-10 space-y-5">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 sm:w-28" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-slate-100 via-slate-100/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 sm:w-28" />

        <div className="marquee-viewport overflow-hidden">
          <MarqueeRow items={items} />
        </div>
        <div className="marquee-viewport overflow-hidden">
          <MarqueeRow items={rowB} reverse />
        </div>
      </div>
    </section>
  );
}
