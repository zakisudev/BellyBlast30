import { useMemo } from "react";

import { MeasurementService } from "@/services/MeasurementService";
import { useProgressStore } from "@/store/progressStore";
import type { MeasurementEntry } from "@/types/models";

export const useMeasurements = () => {
  const measurements = useProgressStore((state) => state.measurements);
  const addMeasurement = useProgressStore((state) => state.addMeasurement);

  const latest = useMemo(() => {
    return [...measurements].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [measurements]);

  const saveMeasurement = (entry: MeasurementEntry): string | null => {
    const validated = MeasurementService.validate(entry);
    if (!validated.ok) {
      return validated.error.message;
    }

    addMeasurement(validated.data);
    return null;
  };

  return {
    measurements,
    latest,
    saveMeasurement
  };
};
