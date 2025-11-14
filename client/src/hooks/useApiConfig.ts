import { ApiConfig } from "@shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiConfigs, upsertApiConfig as apiUpsertApiConfig } from "@/lib/api";

// Hooks
export function useApiConfigs() {
  return useQuery({
    queryKey: ["apiConfigs"],
    queryFn: getApiConfigs,
  });
}

export function useUpsertApiConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiUpsertApiConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiConfigs"] });
    },
  });
}
