import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, hint, icon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        )}
        <input
          className={cn(
            "w-full bg-[#0F1829]/80 border border-cyan-500/15 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600",
            "focus:outline-none focus:border-cyan-500/45 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]",
            "transition-all duration-200",
            icon && "pl-10",
            error && "border-red-500/40 focus:border-red-500/60",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full bg-[#0F1829]/80 border border-cyan-500/15 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none",
          "focus:outline-none focus:border-cyan-500/45 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]",
          "transition-all duration-200",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full bg-[#0F1829]/80 border border-cyan-500/15 rounded-lg px-4 py-2.5 text-sm text-slate-200",
          "focus:outline-none focus:border-cyan-500/45",
          "transition-all duration-200 appearance-none cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0F1829]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
