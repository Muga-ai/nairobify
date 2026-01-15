// lib/firebase.ts
"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let auth: Auth | undefined;
let app: FirebaseApp | undefined;

function initializeFirebase() {
  // Prevent double initialization
  if (app) return { db, storage, auth };

  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Only initialize if we have at least projectId (most important)
  if (firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);

    console.log("Firebase initialized successfully ✅");
  } else {
    console.warn("Firebase config incomplete — skipping initialization. Check your .env.local");
  }

  return { db, storage, auth };
}

// Export a getter function instead of direct variables
// This ensures initialization happens only when used (after client hydration)
export const getFirebase = () => {
  if (typeof window === "undefined") {
    // On server: return undefined (safe — you shouldn't use Firebase on server anyway)
    return { db: undefined, storage: undefined, auth: undefined };
  }

  return initializeFirebase();
};

// Optional: Export direct instances for convenience (will be undefined until first use)
export { db, storage, auth };