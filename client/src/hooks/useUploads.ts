import { Boleto, Upload, UploadCreateInput } from "@shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUploads,
  getUploadById,
  getUploadBoletos,
  uploadCustomersImport
} from "@/lib/api";

// Hooks
export function useUploads() {
  return useQuery({
    queryKey: ["uploads"],
    queryFn: getUploads,
  });
}

export function useUpload(id: string) {
  return useQuery({
    queryKey: ["uploads", id],
    queryFn: () => getUploadById(id),
    enabled: Boolean(id),
  });
}

export function useUploadBoletos(uploadId: string) {
  return useQuery({
    queryKey: ["uploads", uploadId, "boletos"],
    queryFn: () => getUploadBoletos(uploadId),
    enabled: Boolean(uploadId),
  });
}

export function useCreateUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UploadCreateInput) => {
      // Usar a função existente do api.ts
      const result = await uploadCustomersImport(data.file);
      // TODO: Adaptar resposta da API para o formato esperado
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploads"] });
    },
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploads"] });
    },
  });
}
