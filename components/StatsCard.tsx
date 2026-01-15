"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string; // Tailwind background color, e.g., "bg-green-500"
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className={`flex items-center p-4 rounded-xl shadow ${color || "bg-gray-100"}`}>
      <div className="p-3 rounded-full bg-white/20 mr-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-100 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
