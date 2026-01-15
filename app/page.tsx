"use client";

import IssueForm from "@/components/IssueForm";
import { MapPin, AlertTriangle, BarChart3, Clock, CheckCircle } from "lucide-react";
import { useIssues } from "@/lib/useIssues";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import CityIntelStrip from "@/components/CityIntel/CityIntelStrip";

// Dynamically import map so SSR won't break
const Map = dynamic(() => import("@/components/MapPreview"), { ssr: false });

export default function Home() {
  const issues = useIssues();

  // Show only latest 10 issues for map preview
  const latestIssues = useMemo(() => {
    return issues
      .slice()
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 10);
  }, [issues]);

  return (
    <main className="min-h-screen bg-gray-50 relative">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
            Let’s Make Nairobi Work
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-8 animate-fadeIn delay-200">
            Nairobify helps citizens report city service issues and enables
            faster, data-driven response by county teams.
          </p>

          <button
            onClick={() => {
              document.getElementById("issue-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 animate-bounce"
          >
            Report an Issue
          </button>

          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm md:text-base mt-12">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Ward-level reporting
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Real-time dashboard
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> Faster response times
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,0 C150,50 350,0 500,50 L500,0 L0,0 Z" fill="white" />
          </svg>
        </div>
      </section>
      <CityIntelStrip />


      {/* TRUST / STATS SECTION */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">24+</p>
            <p className="text-sm text-gray-500">Sub-counties</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">85+</p>
            <p className="text-sm text-gray-500">Wards covered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">Real-time</p>
            <p className="text-sm text-gray-500">Issue tracking</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500">Youth-built</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How Nairobify Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Report an Issue</h3>
            <p className="text-gray-600 text-sm">
              Citizens report problems like garbage, streetlights, flooding, potholes, or security concerns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <BarChart3 className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Issues appear instantly on a ward-level dashboard for county teams.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Resolve Faster</h3>
            <p className="text-gray-600 text-sm">
              Status updates show what’s reported, in progress, and resolved.
            </p>
          </div>
        </div>
      </section>

      {/* MAP PREVIEW SECTION */}
      {latestIssues.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6">Recent Issues in Nairobi</h2>
          <div className="h-80 rounded-xl overflow-hidden shadow">
            <Map issues={latestIssues} />
          </div>
        </section>
      )}

      {/* ISSUE FORM SECTION */}
      <section id="issue-form" className="bg-gray-100 py-20">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2">Report a City Issue</h2>
          <p className="text-center text-gray-600 mb-8">
            No login required. Takes less than a minute.
          </p>

          <IssueForm />
        </div>
      </section>
      <CityIntelStrip />


      {/* FLOATING REPORT BUTTON */}
      <button
        onClick={() => document.getElementById("issue-form")?.scrollIntoView({ behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full px-6 py-3 shadow-xl hover:bg-green-700 hover:shadow-2xl transition animate-bounce z-50"
      >
        Report Issue
      </button>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          Built by Nairobian • Data for better governance • Nairobify © {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}
