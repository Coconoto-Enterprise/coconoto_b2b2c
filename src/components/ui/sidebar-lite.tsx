import * as React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <aside
      className={cn(
        "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex h-16 items-center gap-3 px-6 border-b border-sidebar-border", className)}>{children}</div>;
}

export function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1 overflow-y-auto px-3 py-4 space-y-1", className)}>{children}</div>;
}

export function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("border-t border-sidebar-border p-4", className)}>{children}</div>;
}

export function SidebarMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  return <nav className={cn("space-y-1", className)}>{children}</nav>;
}

export function SidebarMenuItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("", className)}>{children}</div>;
}

export function SidebarMenuButton({
  isActive,
  className,
  children,
  ...props
}: { isActive?: boolean; className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const state = isActive
    ? "bg-sidebar-accent text-sidebar-accent-foreground"
    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  return (
    <button type="button" className={cn(base, state, className)} {...props}>
      {children}
    </button>
  );
}
