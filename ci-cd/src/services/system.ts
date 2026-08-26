import { requestRaw } from "@/lib/http";
import type { HealthResponse } from "@/types/api";

export const systemApi = {
  health() {
    return requestRaw<HealthResponse>({
      url: "/health",
      method: "GET",
    });
  },
};
