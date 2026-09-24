import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md bg-white/5 px-3 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
