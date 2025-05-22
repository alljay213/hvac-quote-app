// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Required for Firestore

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCeamHKKPkraR3fLkvZcenbARxzv-vi_8Y",
  authDomain: "hvacquoteapp.firebaseapp.com",
  projectId: "hvacquoteapp",
  storageBucket: "hvacquoteapp.firebasestorage.app",
  messagingSenderId: "879782464929",
  appId: "1:879782464929:web:8b5568887e06550aa9cfe0",
  measurementId: "G-MNV9FMBNKD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Export Firestore instance
const db = getFirestore(app);
export { db };
