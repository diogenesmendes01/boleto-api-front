import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Upload, BarChart3 } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redireciona para dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Integre suas APIs de pagamento em um só lugar
            </h1>
            <p className="text-xl text-muted-foreground">
              ConectaAPI simplifica a gestão de múltiplas integrações de pagamento.
              Configure, envie planilhas e acompanhe tudo em tempo real.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-20 bg-muted/50">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg border space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Configuração Simples</h3>
                <p className="text-muted-foreground">
                  Configure suas APIs de pagamento de forma rápida e segura.
                  Suporte para Asaas, Cobre Fácil e mais.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Upload de Planilhas</h3>
                <p className="text-muted-foreground">
                  Envie planilhas em lote e processe pagamentos de forma automatizada.
                  Suporte para CSV e Excel.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Dashboard Completo</h3>
                <p className="text-muted-foreground">
                  Acompanhe todas as suas transações e integrações em um painel intuitivo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 {APP_TITLE}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
