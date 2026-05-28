import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold font-display transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-amber-500 text-white font-bold hover:from-blue-400 hover:to-amber-400 shadow-[0_4px_20px_rgba(59,130,246,0.4),0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.5),0_0_60px_rgba(59,130,246,0.25)] hover:scale-[1.02] border border-blue-500/30",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 border border-red-500/30",
        outline: "bg-zinc-900/50 backdrop-blur-xl text-white hover:bg-zinc-800/60 border border-blue-500/20 hover:border-blue-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
        secondary: "bg-zinc-800/80 backdrop-blur-xl text-white hover:bg-zinc-700/80 border border-zinc-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
        ghost: "hover:bg-white/10 text-zinc-400 hover:text-white backdrop-blur-sm",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
        glass: "bg-white/5 backdrop-blur-2xl text-white hover:bg-white/10 border border-blue-500/10 hover:border-blue-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        primary: "bg-gradient-to-r from-blue-500 via-amber-500 to-blue-500 text-white font-bold hover:from-blue-400 hover:via-amber-400 hover:to-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.4),0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.5),0_0_60px_rgba(59,130,246,0.3)] hover:scale-[1.02] border border-blue-400/30",
      },
      size: {
        default: "h-11 min-h-[44px] px-5 py-2",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-11 min-h-[44px] min-w-[44px] w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
