import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User
} from "firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

import { auth } from "@/services/firebase";

const googleClientIds = {
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
};

const hasNativeGoogleConfig = Platform.OS !== "web" && Boolean(googleClientIds.web);

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  googleReady: boolean;
  googleLoading: boolean;
  googleError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<User>;
  updateDisplayName: (displayName: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, nextPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    GoogleSignin.configure({
      webClientId: googleClientIds.web,
      iosClientId: googleClientIds.ios
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      googleReady: hasNativeGoogleConfig,
      googleLoading,
      googleError,
      signInWithEmail: async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        setUser(credential.user);
        return credential.user;
      },
      signUpWithEmail: async (email, password, displayName) => {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

        if (displayName?.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
        }

        setUser(credential.user);
        return credential.user;
      },
      updateDisplayName: async (displayName) => {
        if (!auth.currentUser) {
          throw new Error("You must be signed in to update your name.");
        }

        await updateProfile(auth.currentUser, { displayName: displayName.trim() });
        setUser(auth.currentUser);
      },
      updateUserPassword: async (currentPassword, nextPassword) => {
        const currentUser = auth.currentUser;

        if (!currentUser?.email) {
          throw new Error("Password changes are only available for email accounts.");
        }

        const usesPassword = currentUser.providerData.some(
          (provider) => provider.providerId === "password"
        );

        if (!usesPassword) {
          throw new Error("This account signs in with a provider. Manage its password there.");
        }

        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, nextPassword);
      },
      deleteAccount: async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("You must be signed in to delete your account.");
        }

        await deleteUser(currentUser);
        if (Platform.OS !== "web") {
          await GoogleSignin.signOut().catch(() => undefined);
        }
        setUser(null);
      },
      signOutUser: async () => {
        if (Platform.OS !== "web") {
          await GoogleSignin.signOut().catch(() => undefined);
        }
        await signOut(auth);
        setUser(null);
      },
      signInWithGoogle: async () => {
        if (!hasNativeGoogleConfig) {
          throw new Error(
            "Google sign-in is not configured for this native build. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env and rebuild."
          );
        }

        setGoogleError(null);
        setGoogleLoading(true);
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          const result = await GoogleSignin.signIn();
          const idToken =
            (result as { idToken?: string }).idToken ??
            (result as { data?: { idToken?: string } }).data?.idToken ??
            null;

          if (!idToken) {
            throw new Error("Google sign-in did not return an ID token.");
          }

          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          setUser(userCredential.user);
        } catch (error) {
          const code = (error as { code?: string }).code;
          if (code === statusCodes.SIGN_IN_CANCELLED) {
            return;
          }

          const message =
            error instanceof Error ? error.message : "Google sign-in failed on this device.";
          setGoogleError(message);
          throw new Error(message);
        } finally {
          setGoogleLoading(false);
        }
      }
    }),
    [googleError, googleLoading, loading, user]
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
