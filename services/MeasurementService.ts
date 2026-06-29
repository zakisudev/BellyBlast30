import { z } from "zod";

import type { MeasurementEntry, ServiceResult } from "@/types/models";

export const measurementSchema = z.object({
  date: z.string(),
  weightKg: z.number().min(30).max(350),
  waistCm: z.number().min(40).max(250),
  bodyFatPct: z.number().min(2).max(70).optional(),
  note: z.string().max(300).optional()
});

export class MeasurementService {
  static validate(entry: MeasurementEntry): ServiceResult<MeasurementEntry> {
    const parsed = measurementSchema.safeParse(entry);
    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "validation_error",
          message: parsed.error.issues[0]?.message ?? "Invalid measurement data."
        }
      };
    }

    return { ok: true, data: parsed.data };
  }
}
