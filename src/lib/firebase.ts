import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "649115548477",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if we have the required config
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn('Firebase configuration incomplete. Missing required environment variables.');
  }
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    // App already initialized, get existing instances
    try {
      const { getApps, getApp } = require('firebase/app');
      app = getApps().length > 0 ? getApp() : null;
      if (app) {
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
      }
    } catch (importError) {
      console.warn('Could not get existing Firebase app:', importError);
    }
  } else {
    console.error('Firebase initialization failed:', error);
  }
}

export { auth, db, storage };

// Configure emulators for development (optional)
if (import.meta.env.DEV) {
  // Uncomment these lines if you want to use Firebase emulators in development
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
}

export default app;