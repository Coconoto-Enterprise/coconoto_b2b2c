import * as React from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "destructive";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (t: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback(
    (t: { title: string; description?: string; variant?: ToastVariant }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev,
        { id, title: t.title, description: t.description, variant: t.variant ?? "default" },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 4000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-lg border bg-background p-4 shadow-lg animate-fade-in",
              t.variant === "destructive"
                ? "border-destructive/50"
                : t.variant === "success"
                ? "border-success/50"
                : "border-border"
            )}
          >
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
