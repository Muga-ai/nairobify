// app/dashboard/page.tsx
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { useIssues } from "@/lib/useIssues";
import { ISSUE_CATEGORIES, NAIROBI_WARDS } from "@/lib/constants";
import toast from "react-hot-toast";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, Firestore } from "firebase/firestore";

// Assert type since initialized on client
const firestoreDb = db as Firestore;

// Define Issue type (inferred from usage; move to types.ts if shared)
interface Issue {
  id: string;
  ward: string;
  category: string;
  description: string;
  status: "reported" | "in_progress" | "resolved";
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
  // Add more from IssueForm if needed: locationText, photoURL, etc.
}

export default function DashboardPage() {
  const issues: Issue[] = useIssues(); // Assume useIssues returns Issue[]

  // FILTER STATES
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

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

  // PAGINATION
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // STATS CALCULATIONS
  const totalIssues = filtered.length;
  const pending = filtered.filter(
    (i) => i.status === "reported" || i.status === "in_progress"
  ).length;
  const resolved = filtered.filter((i) => i.status === "resolved").length;

  const avgResponse =
    filtered.length > 0
      ? (
          filtered
            .filter((i) => i.status === "resolved")
            .reduce(
              (acc, i) =>
                acc +
                ((i.updatedAt?.seconds || 0) -
                  (i.createdAt?.seconds || 0)) /
                  3600,
              0
            ) / Math.max(1, resolved)
        ).toFixed(1)
      : "0";

  // CHART DATA
  const issuesByWard = NAIROBI_WARDS.map((ward) => ({
    ward,
    count: filtered.filter((i) => i.ward === ward).length,
  }));

  const issuesByCategory = ISSUE_CATEGORIES.map((cat) => ({
    category: cat.label,
    count: filtered.filter((i) => i.category === cat.id).length,
  }));

  // STATUS UPDATE HANDLER
  const updateStatus = async (
    id: string,
    status: "reported" | "in_progress" | "resolved"
  ) => {
    const issueRef = doc(firestoreDb, "issues", id);
    try {
      await updateDoc(issueRef, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
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
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Issues"
          value={totalIssues}
          icon={AlertTriangle}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="bg-blue-500"
        />
        <StatsCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          title="Avg Response (hrs)"
          value={avgResponse}
          icon={BarChart3}
          color="bg-purple-500"
        />
      </div>

      {/* ISSUES TABLE */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Issues List</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Ward</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((i) => (
              <tr key={i.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i.ward}</td>
                <td className="p-2">
                  {ISSUE_CATEGORIES.find((c) => c.id === i.category)?.label ||
                    i.category}
                </td>
                <td
                  className={`p-2 font-semibold ${
                    i.status === "reported"
                      ? "text-yellow-600"
                      : i.status === "in_progress"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {i.status}
                </td>
                <td className="p-2 flex gap-2">
                  {i.status !== "in_progress" && (
                    <button
                      onClick={() => updateStatus(i.id, "in_progress")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      In Progress
                    </button>
                  )}
                  {i.status !== "resolved" && (
                    <button
                      onClick={() => updateStatus(i.id, "resolved")}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {pageCount}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(pageCount, currentPage + 1))
            }
            disabled={currentPage === pageCount}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ISSUES BY WARD CHART */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Issues by Ward</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={issuesByWard}
            onClick={(data) => {
              const clicked = data.activeLabel;
              if (clicked) setWardFilter(String(clicked));
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ward" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ISSUES BY CATEGORY CHART */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Issues by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={issuesByCategory}
            onClick={(data) => {
              const clicked = data.activeLabel;
              if (clicked) {
                const cat = ISSUE_CATEGORIES.find(
                  (c) => c.label === String(clicked)
                );
                if (cat) setCategoryFilter(cat.id);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}