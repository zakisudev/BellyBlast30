import type { ServiceResult } from "@/types/models";
import { StorageService } from "@/services/StorageService";

interface VersionedPayload<T> {
  version: number;
  data: T;
}

export abstract class BaseRepository<T> {
  protected readonly key: string;
  protected readonly currentVersion: number;

  protected constructor(key: string, currentVersion: number) {
    this.key = key;
    this.currentVersion = currentVersion;
  }

  protected abstract migrate(legacy: unknown, fromVersion: number): T;

  async read(defaultValue: T): Promise<ServiceResult<T>> {
    const result = await StorageService.getItem<VersionedPayload<T>>(this.key);
    if (!result.ok) {
      return result;
    }

    if (!result.data) {
      return { ok: true, data: defaultValue };
    }

    const version = result.data.version ?? 0;
    if (version === this.currentVersion) {
      return { ok: true, data: result.data.data };
    }

    try {
      const migrated = this.migrate(result.data.data, version);
      await this.write(migrated);
      return { ok: true, data: migrated };
    } catch {
      return {
        ok: false,
        error: {
          code: "storage_error",
          message: "Failed to migrate stored data.",
          context: this.key
        }
      };
    }
  }

  async write(data: T): Promise<ServiceResult<true>> {
    return StorageService.setItem(this.key, {
      version: this.currentVersion,
      data
    });
  }
}
