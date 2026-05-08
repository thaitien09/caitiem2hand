import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

// Cấu hình Firebase của Tiệm
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Kiểm tra xem Firebase đã được cấu hình chưa
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error("Lỗi khởi tạo Firebase:", error);
  }
} else {
  console.warn(
    "⚠️ Firebase chưa được cấu hình. Vui lòng tạo file .env với các biến VITE_FIREBASE_*"
  );
}

// Lazy imports — chỉ load khi cần, giảm ~150KB initial bundle
export const getFirebaseAuth = async () => {
  const { getAuth } = await import("firebase/auth");
  return getAuth(app!);
};

export const getFirebaseStorage = async () => {
  const { getStorage } = await import("firebase/storage");
  return getStorage(app!);
};

export const initAnalytics = async () => {
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const supported = await isSupported();
    if (supported && app) return getAnalytics(app);
  } catch { /* Analytics not critical */ }
  return null;
};

export { app, db };
export default app;
