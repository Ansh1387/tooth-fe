"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const title = (() => {
    if (pathname === "/") return "Dashboard";
    return pathname
      .slice(1)
      .split("/")[0]
      .replace(/\b\w/g, (m) => m.toUpperCase());
  })();

  return (
    <header className="w-full h-14 border-b border-black/10 dark:border-white/10 px-4 flex items-center justify-between sticky top-0 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="flex items-center gap-2">
        <div className="md:hidden mr-1 text-sm">
          <Link href="/">DentalXrayAI</Link>
        </div>
        <h1 className="text-base font-semibold">{title}</h1>
      </div>
      <div className="text-xs text-black/60 dark:text-white/60">
        Built with Next.js
      </div>
    </header>
  );
}


