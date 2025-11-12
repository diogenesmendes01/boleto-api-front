import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Loader2,
  FileText
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { getImportStatus, retryImportFailures, type ImportStatus as ImportStatusType } from "@/lib/api";

export default function ImportStatus() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<ImportStatusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  const importId = params.id;

  // Polling para atualizar status
  useEffect(() => {
    if (!importId) return;

    const fetchStatus = async () => {
      try {
        const data = await getImportStatus(importId);
        setStatus(data);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao buscar status');
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Polling a cada 3 segundos se ainda estiver processando
    const interval = setInterval(() => {
      if (status && ['received', 'staging', 'validating', 'queueing', 'processing'].includes(status.status)) {
        fetchStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [importId, status?.status]);

  const handleRetry = async () => {
    if (!importId) return;

    setIsRetrying(true);
    try {
      const result = await retryImportFailures(importId);
      toast.success(`${result.requeued_count} registros reenfileirados para reprocessamento`);
      
      // Atualizar status
      const data = await getImportStatus(importId);
      setStatus(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao reprocessar falhas');
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando status da importação...</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Importação não encontrada</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setLocation('/upload')}>
              Voltar para Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = status.total > 0 
    ? ((status.processed_ok + status.processed_fail) / status.total) * 100 
    : 0;

  const getStatusInfo = (statusValue: string) => {
    const statusMap = {
      received: { label: 'Recebido', icon: Clock, color: 'bg-blue-100 text-blue-800' },
      staging: { label: 'Carregando', icon: Loader2, color: 'bg-blue-100 text-blue-800' },
      validating: { label: 'Validando', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
      queueing: { label: 'Enfileirando', icon: Clock, color: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Processando', icon: Loader2, color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
      failed: { label: 'Falhou', icon: XCircle, color: 'bg-red-100 text-red-800' },
      canceled: { label: 'Cancelado', icon: XCircle, color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[statusValue as keyof typeof statusMap] || statusMap.received;
  };

  const statusInfo = getStatusInfo(status.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation('/upload')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Status da Importação</h1>
            <p className="text-muted-foreground">{status.filename}</p>
          </div>
        </div>
        <Badge className={statusInfo.color}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
          <CardDescription>
            {status.processed_ok + status.processed_fail} de {status.total} registros processados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{status.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{status.processed_ok}</p>
              <p className="text-sm text-muted-foreground">Sucesso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{status.processed_fail}</p>
              <p className="text-sm text-muted-foreground">Falhas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{status.invalid}</p>
              <p className="text-sm text-muted-foreground">Inválidos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Carregados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{status.staged}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Válidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{status.valid}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Enfileirados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{status.queued}</p>
          </CardContent>
        </Card>
      </div>

      {/* Erros */}
      {status.sample_errors && status.sample_errors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Erros Encontrados</CardTitle>
                <CardDescription>
                  Amostra dos primeiros erros detectados
                </CardDescription>
              </div>
              {status.processed_fail > 0 && status.status === 'completed' && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  variant="outline"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reprocessando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reprocessar Falhas
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.sample_errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-900">
                      Linha {error.row_num}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      <span className="font-medium">{error.error_code}:</span> {error.error_message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Temporais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.started_at && (
              <div>
                <p className="text-sm text-muted-foreground">Iniciado em</p>
                <p className="text-lg font-medium">
                  {new Date(status.started_at).toLocaleString('pt-BR')}
                </p>
              </div>
            )}
            {status.finished_at && (
              <div>
                <p className="text-sm text-muted-foreground">Finalizado em</p>
                <p className="text-lg font-medium">
                  {new Date(status.finished_at).toLocaleString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setLocation('/upload')}
          className="flex-1"
        >
          <FileText className="mr-2 h-4 w-4" />
          Nova Importação
        </Button>
        <Button
          onClick={() => setLocation('/dashboard')}
          className="flex-1"
        >
          Ir para Dashboard
        </Button>
      </div>
    </div>
  );
}
