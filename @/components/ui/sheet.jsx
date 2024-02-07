import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority";
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "-twfixed -twinset-0 -twz-50 -twbg-black/80 -tw data-[state=open]:-twanimate-in data-[state=closed]:-twanimate-out data-[state=closed]:-twfade-out-0 data-[state=open]:-twfade-in-0",
      className
    )}
    {...props}
    ref={ref} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "-twfixed -twz-50 -twgap-4 -twbg-white -twp-6 -twshadow-lg -twtransition -twease-in-out data-[state=open]:-twanimate-in data-[state=closed]:-twanimate-out data-[state=closed]:-twduration-300 data-[state=open]:-twduration-500 dark:-twbg-slate-950",
  {
    variants: {
      side: {
        top: "-twinset-x-0 -twtop-0 -twborder-b data-[state=closed]:-twslide-out-to-top data-[state=open]:-twslide-in-from-top",
        bottom:
          "-twinset-x-0 -twbottom-0 -twborder-t data-[state=closed]:-twslide-out-to-bottom data-[state=open]:-twslide-in-from-bottom",
        left: "-twinset-y-0 -twleft-0 -twh-full -tww-3/4 -twborder-r data-[state=closed]:-twslide-out-to-left data-[state=open]:-twslide-in-from-left sm:-twmax-w-sm",
        right:
          "-twinset-y-0 -twright-0 -twh-full -tww-3/4 -tw -twborder-l data-[state=closed]:-twslide-out-to-right data-[state=open]:-twslide-in-from-right sm:-twmax-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <SheetPrimitive.Close
        className="-twabsolute -twright-4 -twtop-4 -twrounded-sm -twopacity-70 -twring-offset-white -twtransition-opacity hover:-twopacity-100 focus:-twoutline-none focus:-twring-2 focus:-twring-slate-950 focus:-twring-offset-2 disabled:-twpointer-events-none data-[state=open]:-twbg-slate-100 dark:-twring-offset-slate-950 dark:focus:-twring-slate-300 dark:data-[state=open]:-twbg-slate-800">
        <X className="-twh-4 -tww-4" />
        <span className="-twsr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "-twflex -twflex-col -twspace-y-2 -twtext-center sm:-twtext-left",
      className
    )}
    {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "-twflex -twflex-col-reverse sm:-twflex-row sm:-twjustify-end sm:-twspace-x-2",
      className
    )}
    {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "-twtext-lg -twfont-semibold -twtext-slate-950 dark:-twtext-slate-50",
      className
    )}
    {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("-twtext-sm -twtext-slate-500 dark:-twtext-slate-400", className)}
    {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
