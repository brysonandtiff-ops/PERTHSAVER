import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl bg-white/5 backdrop-blur-xl px-4 py-3 text-base text-white/90 font-light transition-all duration-300 placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:bg-white/8 hover:bg-white/7 disabled:cursor-not-allowed disabled:opacity-50 border-0",
          className
        )}
        style={{
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.03)"
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
