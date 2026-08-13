import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const DialogContext = React.createContext<{ close: () => void } | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
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

  const close = () => onOpenChange?.(false);

  return (
    <DialogContext.Provider value={{ close }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/80 animate-fade-in"
          onClick={close}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          className="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg animate-zoom-in max-h-[90vh] overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col space-y-1.5 text-left", className)}>{children}</div>;
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>
  );
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function DialogClose({ className }: { className?: string }) {
  const ctx = React.useContext(DialogContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.close()}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}
