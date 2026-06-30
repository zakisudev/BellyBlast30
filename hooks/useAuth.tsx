import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { ResponseType } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { auth } from "@/services/firebase";

WebBrowser.maybeCompleteAuthSession();

const env =
  (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env ?? {};

const googleClientIds = {
  expo: env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  web: env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  ios: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  android: env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  shared: env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
};

const effectiveGoogleClientId =
  Platform.OS === "android"
    ? (googleClientIds.web ?? googleClientIds.android ?? googleClientIds.shared)
    : Platform.OS === "ios"
      ? (googleClientIds.ios ?? googleClientIds.expo ?? googleClientIds.shared)
      : (googleClientIds.web ?? googleClientIds.shared);

const hasAnyGoogleClientId = Boolean(effectiveGoogleClientId);

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  googleReady: boolean;
  googleLoading: boolean;
  googleError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildGoogleConfig() {
  return {
    clientId: effectiveGoogleClientId ?? "missing-google-client-id",
    responseType: ResponseType.IdToken,
    usePKCE: false,
    expoClientId: googleClientIds.expo,
    webClientId: googleClientIds.web,
    iosClientId: googleClientIds.ios,
    androidClientId: googleClientIds.android
  };
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleConfig = useMemo(buildGoogleConfig, []);
  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.type === "error") {
      const message =
        response.params?.error_description ??
        response.params?.error ??
        "Google sign-in failed with an invalid OAuth request.";
      setGoogleError(message);
      return;
    }

    if (response.type !== "success") {
      return;
    }

    setGoogleError(null);

    const idToken = response.authentication?.idToken ?? response.params.id_token;
    const accessToken = response.authentication?.accessToken ?? response.params.access_token;

    if (!idToken) {
      return;
    }

    const credential = GoogleAuthProvider.credential(idToken, accessToken);

    void signInWithCredential(auth, credential);
  }, [response]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      googleReady: hasAnyGoogleClientId && Boolean(request),
      googleLoading,
      googleError,
      signInWithEmail: async (email, password) => {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      signUpWithEmail: async (email, password, displayName) => {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

        if (displayName?.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
        }
      },
      signOutUser: async () => {
        await signOut(auth);
      },
      signInWithGoogle: async () => {
        if (!hasAnyGoogleClientId || !request) {
          throw new Error(
            "Google sign-in is not configured for this platform. Add the correct EXPO_PUBLIC_GOOGLE_*_CLIENT_ID values."
          );
        }

        setGoogleError(null);
        setGoogleLoading(true);
        try {
          await promptAsync();
        } finally {
          setGoogleLoading(false);
        }
      }
    }),
    [googleError, googleLoading, loading, promptAsync, request, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
