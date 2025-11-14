import { Boleto, BoletoUpdateInput } from "@shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoletos,
  getBoletoById,
  updateBoleto as apiUpdateBoleto,
  deleteBoleto as apiDeleteBoleto,
  cancelBoleto as apiCancelBoleto
} from '@/lib/api';

// Hooks
export function useBoletos() {
  return useQuery({
    queryKey: ["boletos"],
    queryFn: getBoletos,
  });
}

export function useBoleto(id: string) {
  return useQuery({
    queryKey: ["boletos", id],
    queryFn: () => getBoletoById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateBoleto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BoletoUpdateInput }) =>
      apiUpdateBoleto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boletos"] });
    },
  });
}

export function useDeleteBoleto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiDeleteBoleto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boletos"] });
    },
  });
}

export function useCancelBoleto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCancelBoleto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boletos"] });
    },
  });
}
