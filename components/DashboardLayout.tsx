"use client";

import React, { ReactNode } from "react";
import { Home, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ISSUE_CATEGORIES, NAIROBI_WARDS, ISSUE_STATUSES } from "@/lib/constants";


interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/issues", label: "Issues", icon: AlertTriangle },
    { href: "/dashboard/resolved", label: "Resolved", icon: CheckCircle },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-green-700 border-b">
          Nairobify
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 p-2 rounded hover:bg-green-50 ${
                  isActive ? "bg-green-100 font-semibold text-green-700" : ""
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 text-gray-400 text-sm border-t">
          Nairobi Youth Innovation
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
