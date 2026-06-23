import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" | "easy" | "medium" | "hard"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface-elevated text-text-base",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    error: "bg-error-soft text-error",
    info: "bg-info-soft text-info",
    outline: "text-text-base border border-border-soft",
    easy: "bg-[var(--color-difficulty-easy-soft)] text-[var(--color-difficulty-easy)]",
    medium: "bg-[var(--color-difficulty-medium-soft)] text-[var(--color-difficulty-medium)]",
    hard: "bg-[var(--color-difficulty-hard-soft)] text-[var(--color-difficulty-hard)]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
