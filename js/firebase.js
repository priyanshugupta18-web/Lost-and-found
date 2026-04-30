import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseDefaults = {
  apiKey: "AIzaSyDM4wbygf0DuoyaqpeGFeK3hka-PrQoLV4",
  authDomain: "webapp-667eb.firebaseapp.com",
  projectId: "webapp-667eb",
  storageBucket: "webapp-667eb.firebasestorage.app",
  messagingSenderId: "1074691050985",
  appId: "1:1074691050985:web:77b4253878d643e78fcf78",
};

const runtimeFirebaseConfig = window.LOST_FOUND_CONFIG?.firebase || {};
const firebaseConfig = { ...firebaseDefaults, ...runtimeFirebaseConfig };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
