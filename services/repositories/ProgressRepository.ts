import { BaseRepository } from "@/services/repositories/BaseRepository";
import type { MeasurementEntry, ProgressPhoto } from "@/types/models";

interface ProgressSnapshot {
  measurements: MeasurementEntry[];
  photos: ProgressPhoto[];
}

const defaultSnapshot: ProgressSnapshot = {
  measurements: [],
  photos: []
};

class ProgressRepositoryImpl extends BaseRepository<ProgressSnapshot> {
  constructor() {
    super("bb30_repo_progress", 1);
  }

  protected migrate(legacy: unknown): ProgressSnapshot {
    const partial = legacy as Partial<ProgressSnapshot>;
    return {
      measurements: Array.isArray(partial.measurements) ? partial.measurements : [],
      photos: Array.isArray(partial.photos) ? partial.photos : []
    };
  }

  async get(): Promise<ProgressSnapshot> {
    const result = await this.read(defaultSnapshot);
    return result.ok ? result.data : defaultSnapshot;
  }
}

export const ProgressRepository = new ProgressRepositoryImpl();
