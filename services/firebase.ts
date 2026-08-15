import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY_FIREBASE,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN_FIREBASE,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID_FIREBASE,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET_FIREBASE,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_ID_FIREBASE,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db: Firestore = getFirestore(app);

export default app;
