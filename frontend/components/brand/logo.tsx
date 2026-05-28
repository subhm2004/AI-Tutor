import { cn } from "@/lib/utils";

/** IntellectA monogram — I + A with orbit dot */
export function IntellectALogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="5" y="5" width="2.8" height="14" rx="1.4" fill="currentColor" />
      <path
        d="M11.5 19L14.5 8.5L17.5 19"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.3 14.2h4.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="19.2" cy="7.2" r="1.6" fill="currentColor" opacity="0.92" />
      <path
        d="M19.2 8.8v2.2M18.1 7.2h2.2"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

const sizeMap = {
  xs: { box: "h-6 w-6 rounded-md", icon: "h-3.5 w-3.5" },
  sm: { box: "h-8 w-8 rounded-lg", icon: "h-4 w-4" },
  md: { box: "h-9 w-9 rounded-lg", icon: "h-[18px] w-[18px]" },
  lg: { box: "h-10 w-10 rounded-xl", icon: "h-5 w-5" },
  xl: { box: "h-14 w-14 rounded-2xl", icon: "h-7 w-7" },
  "2xl": { box: "h-16 w-16 rounded-2xl", icon: "h-8 w-8" },
} as const;

export type LogoSize = keyof typeof sizeMap;

export function LogoIcon({
  size = "md",
  className,
  iconClassName,
}: {
  size?: LogoSize;
  className?: string;
  iconClassName?: string;
}) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-900/25",
        s.box,
        className
      )}
    >
      <IntellectALogoMark className={cn(s.icon, iconClassName)} />
    </div>
  );
}

export function LogoBrand({
  size = "md",
  showTagline = false,
  tagline = "Learn smarter, every day",
  className,
  nameClassName,
}: {
  size?: LogoSize;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  nameClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon size={size} />
      <div className="min-w-0">
        <p
          className={cn(
            "font-semibold leading-tight text-slate-900 dark:text-slate-100",
            size === "xs" || size === "sm" ? "text-sm" : "text-base",
            nameClassName
          )}
        >
          IntellectA
        </p>
        {showTagline && (
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}

/** Assistant avatar in chat (gradient tile + mark) */
export function LogoAvatar({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm"
      ? "h-10 w-10 rounded-xl"
      : size === "lg"
        ? "h-12 w-12 rounded-xl"
        : "h-10 w-10 rounded-xl";
  const icon =
    size === "sm" ? "h-5 w-5" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-900/20",
        dim,
        className
      )}
    >
      <IntellectALogoMark className={icon} />
    </div>
  );
}
