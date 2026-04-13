"use client";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonVariant = "primary" | "coral" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] font-semibold hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] hover:-translate-y-0.5",
  coral:
    "bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold hover:shadow-[0_0_24px_rgba(255,107,53,0.4)] hover:-translate-y-0.5",
  outline:
    "border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50",
  ghost:
    "text-slate-400 hover:text-slate-200 hover:bg-white/5",
  danger:
    "border border-red-500/30 text-red-400 hover:bg-red-500/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 font-[family-name:var(--font-syne)] transition-all duration-200 cursor-pointer select-none",
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
