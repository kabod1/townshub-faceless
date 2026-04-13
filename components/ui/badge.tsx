"use client";
import { cn } from "@/lib/utils";

type BadgeVariant = "cyan" | "coral" | "gold" | "green" | "purple" | "neutral";

const variants: Record<BadgeVariant, string> = {
  cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25",
  coral: "bg-orange-500/10 text-orange-400 border border-orange-500/25",
  gold: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25",
  green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
  purple: "bg-violet-500/10 text-violet-400 border border-violet-500/25",
  neutral: "bg-slate-500/10 text-slate-400 border border-slate-500/25",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "cyan", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-[family-name:var(--font-syne)] tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
