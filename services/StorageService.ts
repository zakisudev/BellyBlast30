import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ServiceResult } from "@/types/models";

export class StorageService {
  static async getItem<T>(key: string): Promise<ServiceResult<T | null>> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) {
        return { ok: true, data: null };
      }
      return { ok: true, data: JSON.parse(value) as T };
    } catch {
      return {
        ok: false,
        error: {
          code: "storage_error",
          message: "Failed to read local data.",
          context: key
        }
      };
    }
  }

  static async setItem<T>(key: string, value: T): Promise<ServiceResult<true>> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return { ok: true, data: true };
    } catch {
      return {
        ok: false,
        error: {
          code: "storage_error",
          message: "Failed to save local data.",
          context: key
        }
      };
    }
  }

  static async clearAll(): Promise<ServiceResult<true>> {
    try {
      await AsyncStorage.clear();
      return { ok: true, data: true };
    } catch {
      return {
        ok: false,
        error: {
          code: "storage_error",
          message: "Failed to clear local data."
        }
      };
    }
  }
}
