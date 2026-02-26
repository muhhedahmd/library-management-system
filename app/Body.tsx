"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * InnerBody handles the sidebar-push layout.
 * React 19: no more window.innerWidth state or resize listeners —
 * CSS clamp() handles the responsive margin natively.
 */
export default function InnerBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  return (
    <div
      style={{
        // clamp(minRem, preferred, maxRem) — responsive without JS
        marginLeft: open ? "clamp(200px, 15.4vw, 260px)" : 0,
      }}
      className={cn(
        "block md:flex transition-[margin-left] duration-300 ease-in-out",
        "w-full max-w-[100vw] flex-col justify-start items-center"
      )}
    >
      {children}
    </div>
  );
}
