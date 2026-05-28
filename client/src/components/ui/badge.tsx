import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-lg px-3 py-1 text-xs font-display font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-amber-500 text-white shadow-lg shadow-blue-500/25",
        secondary: "bg-white/10 text-white hover:bg-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.2)]",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25",
        outline: "text-white/80 bg-white/5 hover:bg-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
