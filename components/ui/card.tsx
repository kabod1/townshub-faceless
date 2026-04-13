import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-cyan-500/10 bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95",
        "shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
        hover && "transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,212,255,0.08)] hover:-translate-y-0.5 cursor-pointer",
        glow && "shadow-[0_0_30px_rgba(0,212,255,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 border-b border-cyan-500/10", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
