import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { StyleSheet, View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";

import { GradientButton } from "@/components/ui/GradientButton";
import type { AppSettings } from "@/types/models";

const settingsSchema = z.object({
  waterGoalMl: z.coerce.number().min(1000).max(5000),
  notificationsEnabled: z.boolean()
});

type SettingsValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: AppSettings;
  onSubmit: (values: SettingsValues) => void;
}

export const SettingsForm = ({ settings, onSubmit }: SettingsFormProps) => {
  const { control, handleSubmit } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      waterGoalMl: settings.waterGoalMl,
      notificationsEnabled: settings.notificationsEnabled
    }
  });

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
            value={String(value)}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="notificationsEnabled"
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">Enable Notifications</Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
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
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4
  }
});
