"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  ShieldCheck,
  Map,
  Landmark,
  Home,
  Route,
  Trees,
} from "lucide-react";

type IntelItem = {
  label: string;
  value: number;
  suffix?: string;
  icon: any;
};

const intelData: IntelItem[] = [
  { label: "Population", value: 4700000, icon: Users },
  { label: "Wards", value: 85, icon: Map },
  { label: "Sub-Counties", value: 17, icon: Landmark },
  { label: "Police Stations", value: 115, icon: ShieldCheck },
  { label: "Public Schools", value: 220, icon: Building2 },
  { label: "Major Roads", value: 350, suffix: "km", icon: Route },
  { label: "Real Estate Zones", value: 40, icon: Home },
  { label: "Public Parks", value: 65, icon: Trees },
];

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count.toLocaleString()}</>;
}

export default function CityIntelStrip() {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-center text-sm font-semibold tracking-wide text-green-700 mb-6 uppercase">
          Nairobi City Intelligence
        </h3>

        {/* SCROLL CONTAINER */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {intelData.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className="
                  min-w-[180px]
                  bg-gradient-to-br from-white to-green-50
                  border border-green-100
                  rounded-2xl
                  p-5
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:shadow-green-200/50
                  cursor-pointer
                  group
                "
              >
                {/* ICON */}
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-600 transition">
                  <Icon className="w-5 h-5 text-green-700 group-hover:text-white transition" />
                </div>

                {/* VALUE */}
                <div className="text-2xl font-bold text-gray-900">
                  <CountUp value={item.value} />
                  {item.suffix && (
                    <span className="text-sm font-medium text-gray-500 ml-1">
                      {item.suffix}
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <div className="text-sm text-gray-500 mt-1">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
