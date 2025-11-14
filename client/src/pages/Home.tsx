import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Upload, BarChart3, Shield, Zap, CheckCircle2 } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <img src={APP_LOGO} alt={APP_TITLE} className="relative h-10 w-10 rounded-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {APP_TITLE}
            </span>
          </div>
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" onClick={() => setLocation('/login')}>
            Entrar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Zap className="h-4 w-4" />
                Plataforma de Integração de Pagamentos
              </span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl animate-fade-in-up">
              Integre suas APIs de pagamento{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                em um só lugar
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              BoletoAPI simplifica a gestão de múltiplas integrações de pagamento.
              Configure, envie planilhas e acompanhe tudo em tempo real com segurança e praticidade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Button size="lg" asChild className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
                <a href={getLoginUrl()}>
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="#features">
                  Conhecer Recursos
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">2+</div>
                <div className="text-sm text-muted-foreground">APIs Integradas</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Seguro</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Disponível</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-24 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold">Recursos Poderosos</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar seus boletos e integrações de pagamento
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative bg-background p-8 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Configuração Simples</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Configure suas APIs de pagamento de forma rápida e segura.
                    Suporte para Asaas, Cobre Fácil e muito mais em breve.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Configuração em minutos</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Credenciais seguras</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-background p-8 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Upload em Lote</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Envie planilhas em lote e processe pagamentos de forma automatizada.
                    Suporte completo para CSV e Excel.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Processamento rápido</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Validação automática</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative bg-background p-8 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Dashboard Completo</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Acompanhe todas as suas transações e integrações em um painel intuitivo e completo.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Métricas em tempo real</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Histórico detalhado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24">
          <div className="mx-auto max-w-4xl text-center space-y-8 p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border">
            <Shield className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-4xl font-bold">Pronto para começar?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a empresas que já simplificaram sua gestão de pagamentos com o BoletoAPI
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
              <a href={getLoginUrl()}>
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            © 2025 {APP_TITLE}. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
