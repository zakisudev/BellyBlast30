import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { AuthForm, type AuthValues } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function SignupScreen() {
  const { signUpWithEmail, signInWithGoogle, googleReady, googleError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account in few taps."
      subtitle="Pick email signup or use your Google account."
    >
      <AuthForm
        mode="signup"
        loading={loading}
        googleLoading={googleLoading}
        googleReady={googleReady}
        errorMessage={errorMessage ?? googleError}
        onSubmit={async ({ email, password, name }: AuthValues) => {
          setErrorMessage(null);
          setLoading(true);
          try {
            await signUpWithEmail(email, password, name);
            router.replace("/(tabs)" as never);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to create account.");
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
          Already have an account?
        </Text>
        <Link href={"/login" as never} style={styles.link}>
          Sign in
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
