import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Activity, FileUp, Settings } from "lucide-react";

export default function Dashboard() {
  const { data: uploads, isLoading: uploadsLoading } = trpc.upload.list.useQuery();
  const { data: apiConfigs, isLoading: configsLoading } = trpc.apiConfig.list.useQuery();

  const totalUploads = uploads?.length || 0;
  const successfulUploads = uploads?.filter(u => u.status === 'success').length || 0;
  const activeApis = apiConfigs?.filter(c => c.isActive === 1).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral das suas integrações e atividades
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">APIs Ativas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeApis}</div>
              <p className="text-xs text-muted-foreground">
                {configsLoading ? "Carregando..." : "APIs configuradas e ativas"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Uploads</CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUploads}</div>
              <p className="text-xs text-muted-foreground">
                {uploadsLoading ? "Carregando..." : "Planilhas enviadas"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uploads Bem-sucedidos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulUploads}</div>
              <p className="text-xs text-muted-foreground">
                {uploadsLoading ? "Carregando..." : `${totalUploads > 0 ? Math.round((successfulUploads / totalUploads) * 100) : 0}% de sucesso`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
            <CardDescription>Últimos uploads realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadsLoading ? (
              <p className="text-sm text-muted-foreground">Carregando histórico...</p>
            ) : uploads && uploads.length > 0 ? (
              <div className="space-y-4">
                {uploads.slice(0, 5).map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{upload.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {upload.apiProvider.toUpperCase()} • {new Date(upload.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
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
              <p className="text-sm text-muted-foreground">Nenhum upload realizado ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
