import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// TODO: paste your config from Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: process.env.APP_API_KEY_FIREBASE,
  authDomain: process.env.APP_AUTH_DOMAIN_FIREBASE,
  projectId: process.env.APP_PROJECT_ID_FIREBASE,
  storageBucket: process.env.APP_STORAGE_BUCKET_FIREBASE,
  messagingSenderId: process.env.APP_MESSAGING_SENDER_ID,
  appId: process.env.APP_ID_FIREBASE,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
// NOTE: no Firebase Storage export — using Cloudinary instead (see storage.ts).
// Firebase Storage now requires the Blaze plan to even enable, so we skip it.

export default app;
