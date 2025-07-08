import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALtcQbyJvKkCeJae8cn--G4Vh6gVkVzqo",
  authDomain: "fd-site-29de3.firebaseapp.com",
  projectId: "fd-site-29de3",
  storageBucket: "fd-site-29de3.firebasestorage.app",
  messagingSenderId: "392379370188",
  appId: "1:392379370188:web:2468339444a01da7959069",
  measurementId: "G-96GTCPX5WB"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
