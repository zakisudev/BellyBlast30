import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import type { MeasurementEntry, ServiceResult } from "@/types/models";

export class CSVService {
  static async exportMeasurements(entries: MeasurementEntry[]): Promise<ServiceResult<string>> {
    try {
      const header = "date,weightKg,waistCm,bodyFatPct,note";
      const rows = entries.map((entry) => {
        return [
          entry.date,
          entry.weightKg,
          entry.waistCm,
          entry.bodyFatPct ?? "",
          (entry.note ?? "").replaceAll(",", " ")
        ].join(",");
      });
      const csv = [header, ...rows].join("\n");

      const path = `${FileSystem.cacheDirectory}bellyblast-measurements.csv`;
      await FileSystem.writeAsStringAsync(path, csv, {
        encoding: FileSystem.EncodingType.UTF8
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: "text/csv" });
      }

      return { ok: true, data: path };
    } catch {
      return {
        ok: false,
        error: {
          code: "unknown_error",
          message: "Unable to export CSV."
        }
      };
    }
  }
}
