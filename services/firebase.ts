import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import * as FirebaseAuth from "@firebase/auth";
import type { Auth } from "firebase/auth";

const env =
  (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env ?? {};

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const requiredKeys: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId"
];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing Firebase config: ${missingKeys.join(", ")}.`);
}

const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

const { getAuth, initializeAuth } = FirebaseAuth;
const getReactNativePersistence = (
  FirebaseAuth as { getReactNativePersistence?: (storage: unknown) => unknown }
).getReactNativePersistence;

let auth: Auth;

try {
  if (typeof getReactNativePersistence === "function") {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage) as never
    });
  } else {
    auth = getAuth(app);
  }
} catch {
  auth = getAuth(app);
}

export { app, auth };
