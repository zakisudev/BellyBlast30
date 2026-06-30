import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

import { ErrorView } from "@/components/common/ErrorView";
import { GradientButton } from "@/components/ui/GradientButton";
import type { AppTheme } from "@/theme/paper";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Enter your name.")
});

export type AuthValues = {
  name?: string;
  email: string;
  password: string;
};

interface AuthFormProps {
  mode: "login" | "signup";
  loading?: boolean;
  googleLoading?: boolean;
  googleReady?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: AuthValues) => Promise<void> | void;
  onGooglePress: () => Promise<void> | void;
}

export const AuthForm = ({
  mode,
  loading = false,
  googleLoading = false,
  googleReady = true,
  errorMessage,
  onSubmit,
  onGooglePress
}: AuthFormProps) => {
  const theme = useTheme<AppTheme>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { control, handleSubmit } = useForm<AuthValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues:
      mode === "login"
        ? {
            email: "",
            password: ""
          }
        : {
            name: "",
            email: "",
            password: ""
          }
  });

  const submitLabel = mode === "login" ? "Sign in" : "Create account";

  return (
    <View style={styles.container}>
      {mode === "signup" ? (
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label="Name"
              placeholder="Your name"
              autoCapitalize="words"
              value={value ?? ""}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
      ) : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Password"
            placeholder="Minimum 6 characters"
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            autoComplete="password"
            textContentType={mode === "signup" ? "newPassword" : "password"}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off-outline" : "eye-outline"}
                onPress={() => setPasswordVisible((current) => !current)}
                forceTextInputFocus={false}
              />
            }
          />
        )}
      />

      {errorMessage ? <ErrorView message={errorMessage} /> : null}

      <GradientButton
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        disabled={loading || googleLoading}
      />

      <Pressable
        onPress={() => {
          void onGooglePress();
        }}
        disabled={loading || googleLoading || !googleReady}
        style={({ pressed }) => [
          styles.googleButton,
          theme.dark && styles.googleButtonDark,
          pressed && !loading && !googleLoading && googleReady && styles.pressed,
          (loading || googleLoading || !googleReady) && styles.disabled
        ]}
      >
        <MaterialCommunityIcons name="google" size={20} color={theme.colors.onSurface} />
        <Text variant="titleSmall" style={styles.googleLabel}>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </Text>
      </Pressable>

      {!googleReady ? (
        <Text variant="bodySmall" style={styles.helperText}>
          Add the Google client IDs to enable OAuth on this build.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  googleButton: {
    minHeight: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(30, 51, 67, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  googleButtonDark: {
    backgroundColor: "rgba(8, 18, 26, 0.45)",
    borderColor: "rgba(163, 187, 204, 0.16)"
  },
  googleLabel: {
    fontWeight: "700"
  },
  helperText: {
    opacity: 0.72,
    lineHeight: 18
  },
  pressed: {
    transform: [{ scale: 0.985 }]
  },
  disabled: {
    opacity: 0.55
  }
});
