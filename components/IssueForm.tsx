
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp, Firestore } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { ISSUE_CATEGORIES, NAIROBI_WARDS } from "@/lib/constants";

// Assert Firestore type since initialized on client
const firestoreDb = db as Firestore;

interface FormState {
  category: string;
  description: string;
  ward: string;
  location: string;
}

export default function IssueForm() {
  const [loading, setLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const [formState, setFormState] = useState<FormState>({
    category: "",
    description: "",
    ward: "",
    location: "",
  });

  // Prevent duplicate rapid submissions
  const [lastSubmittedHash, setLastSubmittedHash] = useState<string | null>(null);

  // Generate anonymous reporter ID (stored in browser once)
  const getReporterId = () => {
    if (typeof window === "undefined") return "anonymous";

    let id = localStorage.getItem("nairobify_reporter_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("nairobify_reporter_id", id);
    }
    return id;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateSubmissionHash = () => {
    return btoa(
      `${formState.category}-${formState.description}-${formState.ward}-${formState.location}`
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const submissionHash = generateSubmissionHash();

    if (submissionHash === lastSubmittedHash) {
      toast.error("Duplicate submission detected.");
      return;
    }

    setLoading(true);

    try {
      const reporterId = getReporterId();

      const docRef = await addDoc(collection(firestoreDb, "issues"), {
        category: formState.category,
        description: formState.description,
        ward: formState.ward,
        locationText: formState.location,
        status: "reported",
        reporterId,
        aiModeration: {
          flagged: false,
          confidence: null,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setSubmissionId(docRef.id);
      setLastSubmittedHash(submissionHash);

      // Clear form
      setFormState({
        category: "",
        description: "",
        ward: "",
        location: "",
      });

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

      <h2 className="text-2xl font-bold text-center mb-6">
        Report a City Issue
      </h2>

      {submissionId && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✅ Submission received.
          <br />
          Tracking ID: <span className="font-mono">{submissionId}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CATEGORY */}
        <select
          name="category"
          value={formState.category}
          onChange={handleChange}
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
          value={formState.description}
          onChange={handleChange}
          required
          placeholder="Describe the issue"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
          rows={4}
        />

        {/* WARD */}
        <select
          name="ward"
          value={formState.ward}
          onChange={handleChange}
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
          value={formState.location}
          onChange={handleChange}
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