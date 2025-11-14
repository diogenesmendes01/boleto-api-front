import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUploads } from "@/hooks/useUploads";
import { useApiConfigs } from "@/hooks/useApiConfig";
import { useBoletos } from "@/hooks/useBoletos";
import { Activity, FileUp, Settings, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: uploads, isLoading: uploadsLoading } = useUploads();
  const { data: apiConfigs, isLoading: configsLoading } = useApiConfigs();
  const { data: boletos, isLoading: boletosLoading } = useBoletos();

  const totalUploads = uploads?.length || 0;
  const successfulUploads = uploads?.filter(u => u.status === 'success').length || 0;
  const activeApis = apiConfigs?.length || 0; // TODO: Implementar lógica de API ativa na API externa
  const totalBoletos = boletos?.length || 0;
  const boletosPendentes = boletos?.filter(b => b.status === 'pending').length || 0;
  const boletosPagos = boletos?.filter(b => b.status === 'paid').length || 0;

  const isLoading = uploadsLoading || configsLoading || boletosLoading;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Visão geral das suas integrações e atividades
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* APIs Ativas */}
          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">APIs Ativas</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-4xl font-bold">{activeApis}</div>
              )}
              <p className="text-sm text-muted-foreground">
                {configsLoading ? "Carregando..." : "APIs configuradas e ativas"}
              </p>
            </CardContent>
          </Card>

          {/* Total de Uploads */}
          <Card className="group relative overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Uploads</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-4xl font-bold">{totalUploads}</div>
              )}
              <p className="text-sm text-muted-foreground">
                {uploadsLoading ? "Carregando..." : "Planilhas enviadas"}
              </p>
            </CardContent>
          </Card>

          {/* Uploads Bem-sucedidos */}
          <Card className="group relative overflow-hidden border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-4xl font-bold">{totalUploads > 0 ? Math.round((successfulUploads / totalUploads) * 100) : 0}%</div>
              )}
              <p className="text-sm text-muted-foreground">
                {uploadsLoading ? "Carregando..." : `${successfulUploads} de ${totalUploads} uploads`}
              </p>
            </CardContent>
          </Card>

          {/* Total de Boletos */}
          <Card className="group relative overflow-hidden border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Boletos</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-4xl font-bold">{totalBoletos}</div>
              )}
              <p className="text-sm text-muted-foreground">
                {boletosLoading ? "Carregando..." : "Boletos cadastrados"}
              </p>
            </CardContent>
          </Card>

          {/* Boletos Pendentes */}
          <Card className="group relative overflow-hidden border-2 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Boletos Pendentes</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-4xl font-bold">{boletosPendentes}</div>
              )}
              <p className="text-sm text-muted-foreground">
                {boletosLoading ? "Carregando..." : "Aguardando pagamento"}
              </p>
            </CardContent>
          </Card>

          {/* Boletos Pagos */}
          <Card className="group relative overflow-hidden border-2 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Boletos Pagos</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-4xl font-bold">{boletosPagos}</div>
              )}
              <p className="text-sm text-muted-foreground">
                {boletosLoading ? "Carregando..." : "Pagamentos confirmados"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Histórico Recente */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Histórico Recente</CardTitle>
            <CardDescription className="text-base">Últimos uploads realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : uploads && uploads.length > 0 ? (
              <div className="space-y-4">
                {uploads.slice(0, 5).map((upload) => (
                  <div 
                    key={upload.id} 
                    className="group flex items-center justify-between border-b pb-4 last:border-0 hover:bg-muted/50 -mx-4 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => setLocation(`/upload/${upload.id}`)}
                  >
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                        {upload.fileName}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs font-medium">
                          {upload.apiProvider.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{new Date(upload.createdAt).toLocaleString('pt-BR')}</span>
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      upload.status === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {upload.status === 'success' ? 'Sucesso' : 'Erro'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhum upload realizado ainda</p>
                <p className="text-sm text-muted-foreground mt-2">Comece enviando sua primeira planilha</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
