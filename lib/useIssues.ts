"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";  // Adjust path if needed (e.g., "./firebase" → "@/lib/firebase")
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  Firestore,
} from "firebase/firestore";

export interface Issue {
  id: string;
  category: string;
  ward: string;
  description: string;
  locationText?: string;
 
  status: "reported" | "in_progress" | "resolved";
  createdAt: any;  // Firestore Timestamp or null
  updatedAt: any;  // Firestore Timestamp or null
}

export function useIssues(): Issue[] {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    // Safety guard: if db is not initialized yet (rare in "use client", but prevents TS error and runtime crash)
    if (!db) {
      console.warn("Firestore not initialized yet – skipping issues subscription");
      return;
    }

    const issuesQuery = query(
      collection(db as Firestore, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      issuesQuery,
      (snapshot) => {
        const data: Issue[] = snapshot.docs.map((doc) => {
          const docData = doc.data() as DocumentData;
          return {
            id: doc.id,
            category: docData.category ?? "",
            ward: docData.ward ?? "",
            description: docData.description ?? "",
            locationText: docData.locationText ?? undefined,
            
            status: (docData.status as Issue["status"]) ?? "reported",
            createdAt: docData.createdAt ?? null,
            updatedAt: docData.updatedAt ?? null,
          };
        });
        setIssues(data);
      },
      (error) => {
        console.error("Error listening to issues:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return issues;
}