"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, BarChart3, Settings, Info } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: <Home size={18} /> },
  { href: "/detection", label: "Detection", icon: <Camera size={18} /> },
  { href: "/reports", label: "Reports", icon: <BarChart3 size={18} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
  { href: "/about", label: "About", icon: <Info size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen sticky top-0 w-64 border-r border-black/10 dark:border-white/10 p-4 hidden md:block">
      <div className="mb-6">
        <div className="text-xl font-semibold">DentalXrayAI</div>
        <div className="text-xs text-black/60 dark:text-white/60">Tooth Detection</div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                isActive
                  ? "bg-black/5 dark:bg-white/10 font-medium"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;


