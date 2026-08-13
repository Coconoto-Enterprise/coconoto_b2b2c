import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (o: boolean) => void;
}
const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: { asChild?: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        ctx.setOpen(!ctx.open);
      },
    });
  }
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = "end",
  className,
  children,
}: {
  align?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx || !ctx.open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-fade-in",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>;
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />;
}

export function DropdownMenuItem({
  className,
  children,
  onSelect,
  ...props
}: { className?: string; children: React.ReactNode; onSelect?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownMenuItem must be used within DropdownMenu");
  return (
    <button
      type="button"
      onClick={() => {
        onSelect?.();
        ctx.setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
