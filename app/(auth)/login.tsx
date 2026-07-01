import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { AuthForm, type AuthValues } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signInWithEmail, signInWithGoogle, googleReady, googleError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to keep your streak alive."
      subtitle="Stay ahead of the pack with your consistency"
    >
      <AuthForm
        mode="login"
        loading={loading}
        googleLoading={googleLoading}
        googleReady={googleReady}
        errorMessage={errorMessage ?? googleError}
        onSubmit={async ({ email, password }: AuthValues) => {
          setErrorMessage(null);
          setLoading(true);
          try {
            await signInWithEmail(email, password);
            router.replace("/(tabs)" as never);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
          } finally {
            setLoading(false);
          }
        }}
        onGooglePress={async () => {
          setErrorMessage(null);
          setGoogleLoading(true);
          try {
            await signInWithGoogle();
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Google sign-in failed.");
          } finally {
            setGoogleLoading(false);
          }
        }}
      />

      <View style={styles.footer}>
        <Text variant="bodyMedium" style={styles.footerText}>
          New here?
        </Text>
        <Link href={"/signup" as never} style={styles.link}>
          Create an account
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 4
  },
  footerText: {
    opacity: 0.72
  },
  link: {
    color: "#0D8576",
    fontWeight: "800"
  }
});
