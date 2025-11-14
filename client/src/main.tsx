import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // TODO: Implementar lógica de redirecionamento para login baseada na API externa
        console.error("[API Query Error]", error);
        return false; // Não retry por enquanto
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        console.error("[API Mutation Error]", error);
        return false; // Não retry por enquanto
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
