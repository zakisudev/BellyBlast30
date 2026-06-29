import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

import { GradientButton } from "@/components/ui/GradientButton";
import type { MeasurementEntry } from "@/types/models";
import { todayISO } from "@/utils/date";

const formSchema = z.object({
  weightKg: z.coerce.number().min(30).max(350),
  waistCm: z.coerce.number().min(40).max(250),
  bodyFatPct: z.coerce.number().min(2).max(70).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface MeasurementFormProps {
  onSubmit: (entry: MeasurementEntry) => void;
}

export const MeasurementForm = ({ onSubmit }: MeasurementFormProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weightKg: 78,
      waistCm: 86,
      bodyFatPct: undefined
    }
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="weightKg"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            label="Weight (kg)"
            value={String(value)}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="waistCm"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            label="Waist (cm)"
            value={String(value)}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="bodyFatPct"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            label="Body Fat % (optional)"
            value={value ? String(value) : ""}
            onChangeText={onChange}
          />
        )}
      />
      <GradientButton
        label="Save Measurement"
        onPress={handleSubmit((values) => {
          onSubmit({
            date: todayISO(),
            weightKg: values.weightKg,
            waistCm: values.waistCm,
            bodyFatPct: values.bodyFatPct
          });
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10
  }
});
