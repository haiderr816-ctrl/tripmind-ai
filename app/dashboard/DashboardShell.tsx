"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Calendar,
  FolderHeart,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  UserCheck,
  Sparkles,
} from "lucide-react";

type DashboardShellProps = {
  children: React.ReactNode;
  isAdmin: boolean;
};

export function DashboardShell({ children, isAdmin }: DashboardShellProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Plan a Trip", href: "/dashboard/plan", icon: Calendar },
    { name: "My Trips", href: "/dashboard/trips", icon: FolderHeart },
    ...(isAdmin
      ? [
          { name: "Leads", href: "/dashboard/leads", icon: Users },
          { name: "Users", href: "/dashboard/users", icon: UserCheck },
        ]
      : []),
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-gray-100"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              TripMind AI
            </span>
          </Link>
        </div>

        <div className="px-4 py-3 mx-3 mt-4 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.[0] || "T"}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-[#0f172a] text-sm truncate">
                {user?.firstName || "Traveler"}
              </p>
              <p className="text-xs text-[#64748b] truncate">
                {user?.primaryEmailAddress?.emailAddress || ""}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-200" : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"}`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 mb-4 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl p-4 text-white">
          <p className="font-bold text-sm mb-1">Upgrade to Pro</p>
          <p className="text-xs text-white/70 mb-3">
            Unlimited trips for just $3/month
          </p>
          <Link href="/dashboard/billing">
            <button className="w-full bg-white text-violet-700 text-xs font-bold py-2 rounded-xl hover:bg-violet-50 transition">
              Upgrade Now ✨
            </button>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100">
          <SignOutButton>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#64748b] hover:bg-[#f8fafc] hover:text-red-500 transition-all">
              <LogOut size={18} />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
