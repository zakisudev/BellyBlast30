import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

import { GradientButton } from "@/components/ui/GradientButton";
import type { AppSettings } from "@/types/models";

const settingsSchema = z.object({
  waterGoalMl: z.coerce.number().min(1000).max(5000)
});

type SettingsValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: AppSettings;
  onSubmit: (values: SettingsValues) => void;
}

export const SettingsForm = ({ settings, onSubmit }: SettingsFormProps) => {
  const { control, handleSubmit, reset } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      waterGoalMl: settings.waterGoalMl
    }
  });

  useEffect(() => {
    reset({
      waterGoalMl: settings.waterGoalMl
    });
  }, [reset, settings.waterGoalMl]);

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={styles.metricHint}>
        Measurement unit is set to metric (kg/cm).
      </Text>
      <Controller
        control={control}
        name="waterGoalMl"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            label="Water Goal (ml)"
            placeholder={String(settings.waterGoalMl)}
            value={String(value)}
            onChangeText={onChange}
          />
        )}
      />
      <GradientButton label="Save Settings" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  metricHint: {
    opacity: 0.72,
    marginBottom: 2
  }
});
