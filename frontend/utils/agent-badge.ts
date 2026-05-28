export type AgentId =
  | "MathAgent"
  | "PhysicsAgent"
  | "ChemistryAgent"
  | "HistoryAgent"
  | "OutOfScope"
  | "Unknown"
  | string;

export interface AgentBadgeInfo {
  label: string;
  emoji: string;
  className: string;
}

const AGENT_BADGES: Record<string, AgentBadgeInfo> = {
  MathAgent: {
    label: "Math",
    emoji: "🧮",
    className:
      "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200",
  },
  PhysicsAgent: {
    label: "Physics",
    emoji: "⚛️",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200",
  },
  ChemistryAgent: {
    label: "Chem",
    emoji: "⚗️",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  },
  HistoryAgent: {
    label: "History",
    emoji: "📜",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  },
  OutOfScope: {
    label: "General",
    emoji: "💬",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
  },
  Unknown: {
    label: "Tutor",
    emoji: "✨",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
  },
};

export function getAgentBadge(agent?: string | null): AgentBadgeInfo {
  if (!agent) {
    return AGENT_BADGES.Unknown;
  }
  return AGENT_BADGES[agent] ?? AGENT_BADGES.Unknown;
}
