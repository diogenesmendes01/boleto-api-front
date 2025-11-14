import { getLoginUrl } from "@/const";
import { getCurrentUser, login, logout as apiLogout, register } from "@/lib/api";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { User } from "@shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};

  const queryClient = useQueryClient();

  // Query para obter usuário atual
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Salvar token no localStorage
      localStorage.setItem("token", data.token);
      // Invalidar query do usuário para recarregar
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: register,
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      // Remover token do localStorage
      localStorage.removeItem("token");
      // Limpar dados do usuário
      queryClient.setQueryData(["auth", "me"], null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: any) {
      // Mesmo se houver erro na API, fazer logout local
      localStorage.removeItem("token");
      queryClient.setQueryData(["auth", "me"], null);
      throw error;
    }
  }, [logoutMutation, queryClient]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(user)
    );
    return {
      user: user as User | null,
      loading: userLoading || loginMutation.isPending || logoutMutation.isPending,
      error: userError || loginMutation.error || logoutMutation.error || registerMutation.error,
      isAuthenticated: Boolean(user),
    };
  }, [
    user,
    userLoading,
    userError,
    loginMutation.isPending,
    loginMutation.error,
    logoutMutation.isPending,
    logoutMutation.error,
    registerMutation.error,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (state.loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    // Verificar se é erro de autenticação
    const isUnauthorized = state.error?.message === UNAUTHED_ERR_MSG ||
                          (state.error as any)?.data?.code === "UNAUTHORIZED";

    if (isUnauthorized) {
      window.location.href = redirectPath;
    }
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    state.loading,
    state.user,
    state.error,
  ]);

  return {
    ...state,
    refresh: refetchUser,
    logout,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
  };
}
