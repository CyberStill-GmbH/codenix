import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    
    const baseStyles = "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold transition-[background-color,border-color,color,box-shadow,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
    
    const variants = {
      primary: "bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] text-white shadow hover:opacity-90",
      secondary: "bg-surface-elevated text-text-base hover:bg-surface-soft",
      outline: "border border-border bg-transparent hover:bg-surface-elevated text-text-base",
      ghost: "hover:bg-surface-elevated hover:text-text-base text-text-soft",
      danger: "bg-error text-white hover:opacity-90",
      success: "bg-success text-white hover:opacity-90",
    }
    
    const sizes = {
      sm: "h-10 rounded-[var(--radius-md)] px-3 text-xs",
      md: "h-11 rounded-[var(--radius-md)] px-4 py-2",
      lg: "h-11 rounded-[var(--radius-md)] px-8",
      icon: "h-10 w-10 min-w-10",
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
