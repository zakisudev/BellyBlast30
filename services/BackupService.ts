import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import type { ServiceResult } from "@/types/models";

export class BackupService {
  static async exportJson(payload: object): Promise<ServiceResult<string>> {
    try {
      const path = `${FileSystem.cacheDirectory}bellyblast-backup.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(payload, null, 2));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, {
          mimeType: "application/json"
        });
      }

      return { ok: true, data: path };
    } catch {
      return {
        ok: false,
        error: {
          code: "storage_error",
          message: "Backup export failed."
        }
      };
    }
  }
}
