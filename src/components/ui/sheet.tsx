import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "left",
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange?.(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/80 animate-fade-in"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed top-0 z-50 flex h-full w-3/4 max-w-sm flex-col border bg-background p-6 shadow-lg transition ease-in-out",
          side === "left" ? "left-0 animate-slide-in-left" : "right-0 animate-slide-in-right"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-center justify-between", className)}>{children}</div>;
}

export function SheetClose({ onClose, className }: { onClose?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        "rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </button>
  );
}

export function SheetTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}
