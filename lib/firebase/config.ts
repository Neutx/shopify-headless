import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (works on both client and server)
let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore (works on server)
// Configure Firestore with timeout settings
db = getFirestore(app);
// Set Firestore settings for better timeout handling
if (typeof window === 'undefined') {
  // Server-side: configure for better reliability
  // Note: Firestore SDK doesn't expose timeout settings directly in v9+
  // We'll handle timeouts in our wrapper functions instead
}

// Initialize Storage
storage = getStorage(app);

// Initialize Auth only on client side
if (typeof window !== 'undefined') {
  auth = getAuth(app);
}

export { app, auth, db, storage };

