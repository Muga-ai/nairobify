"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: string;
}

export default function CityIntelCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: Props) {
  return (
    <div
      className="
        min-w-[200px]
        bg-white/80 backdrop-blur
        border border-gray-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300
        cursor-pointer
        group
      "
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${accent}`} />
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </div>

      <div className="text-xs text-gray-500 group-hover:text-gray-700 transition">
        {hint}
      </div>
    </div>
  );
}
