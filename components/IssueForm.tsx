
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp, Firestore } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { ISSUE_CATEGORIES, NAIROBI_WARDS } from "@/lib/constants";

// Assert Firestore type since initialized on client
const firestoreDb = db as Firestore;

// Define Issue type (inferred from usage; move to types.ts if shared)
interface Issue {
  id: string;
  category: string;
  description: string;
  ward: string;
  locationText: string;
  status: "reported" | "in_progress" | "resolved";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function IssueForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      await addDoc(collection(firestoreDb, "issues"), {
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        ward: formData.get("ward") as string,
        locationText: formData.get("location") as string,
        status: "reported" as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      e.currentTarget.reset();
      toast.success("Issue reported successfully!");
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.error("Failed to submit issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl mx-auto">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold text-center mb-6">Report a City Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CATEGORY */}
        <select
          name="category"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Issue Type</option>
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          required
          placeholder="Describe the issue"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
          rows={4}
        />

        {/* WARD */}
        <select
          name="ward"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Ward</option>
          {NAIROBI_WARDS.map((ward) => (
            <option key={ward} value={ward}>
              {ward}
            </option>
          ))}
        </select>

        {/* LOCATION */}
        <input
          name="location"
          placeholder="Location description (street, landmark, etc.)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
}
