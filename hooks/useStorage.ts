import { useState } from "react";

import { StorageService } from "@/services/StorageService";

export const useStorage = () => {
  const [loading, setLoading] = useState(false);

  const clearAppStorage = async (): Promise<string> => {
    setLoading(true);
    const result = await StorageService.clearAll();
    setLoading(false);
    return result.ok ? "All local data has been reset." : result.error.message;
  };

  return {
    loading,
    clearAppStorage
  };
};
