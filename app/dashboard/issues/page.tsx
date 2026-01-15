"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useIssues } from "@/lib/useIssues";
import { ISSUE_CATEGORIES, NAIROBI_WARDS } from "@/lib/constants";
import { useState, useMemo } from "react";

export default function IssuesPage() {
  const issues = useIssues(); // live Firestore subscription

  // FILTER STATES
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // FILTERED ISSUES
  const filtered = useMemo(() => {
    return issues
      .filter(
        (i) =>
          (wardFilter === "all" || i.ward === wardFilter) &&
          (categoryFilter === "all" || i.category === categoryFilter)
      )
      .filter(
        (i) =>
          i.ward.toLowerCase().includes(search.toLowerCase()) ||
          i.description.toLowerCase().includes(search.toLowerCase())
      );
  }, [issues, wardFilter, categoryFilter, search]);

  return (
    <DashboardLayout>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard - Issues</h1>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Wards</option>
            {NAIROBI_WARDS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Categories</option>
            {ISSUE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by description or ward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded flex-1"
          />
        </div>

        {/* ISSUES TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Ward</th>
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No issues found
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr key={i.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{i.ward}</td>
                    <td className="p-2">
                      {ISSUE_CATEGORIES.find((c) => c.id === i.category)?.label ||
                        i.category}
                    </td>
                    <td className="p-2">{i.description}</td>
                    <td
                      className={`p-2 font-semibold ${
                        i.status === "reported"
                          ? "text-yellow-600"
                          : i.status === "in_progress"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {i.status.replace("_", " ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </DashboardLayout>
  );
}
