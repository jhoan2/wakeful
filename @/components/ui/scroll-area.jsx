import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("-twrelative -twoverflow-hidden", className)}
    {...props}>
    <ScrollAreaPrimitive.Viewport className="-twh-full -tww-full -twrounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "-twflex -twtouch-none -twselect-none -twtransition-colors",
      orientation === "vertical" &&
        "-twh-full -tww-2.5 -twborder-l -twborder-l-transparent -twp-[1px]",
      orientation === "horizontal" &&
        "-twh-2.5 -twflex-col -twborder-t -twborder-t-transparent -twp-[1px]",
      className
    )}
    {...props}>
    <ScrollAreaPrimitive.ScrollAreaThumb
      className="-twrelative -twflex-1 -twrounded-full -twbg-slate-200 dark:-twbg-slate-800" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
