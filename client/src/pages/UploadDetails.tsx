import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, FileText, Calendar, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";

export default function UploadDetails() {
  const [, params] = useRoute("/upload/:id");
  const [, setLocation] = useLocation();
  const uploadId = params?.id ? parseInt(params.id) : 0;

  const { data: upload, isLoading: uploadLoading } = trpc.upload.getById.useQuery({ id: uploadId });
  const { data: boletos, isLoading: boletosLoading } = trpc.upload.getBoletos.useQuery({ uploadId });

  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [apiFilter, setApiFilter] = useState<string>("all");

  const filteredBoletos = useMemo(() => {
    if (!boletos) return [];

    let filtered = [...boletos];

    // Filtro por período
    if (periodFilter !== "all") {
      const days = parseInt(periodFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(b => new Date(b.createdAt) >= cutoffDate);
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Filtro por API
    if (apiFilter !== "all") {
      filtered = filtered.filter(b => b.apiProvider === apiFilter);
    }

    return filtered;
  }, [boletos, periodFilter, statusFilter, apiFilter]);

  const stats = useMemo(() => {
    if (!boletos) return { total: 0, pending: 0, paid: 0, cancelled: 0, overdue: 0 };

    return {
      total: boletos.length,
      pending: boletos.filter(b => b.status === 'pending').length,
      paid: boletos.filter(b => b.status === 'paid').length,
      cancelled: boletos.filter(b => b.status === 'cancelled').length,
      overdue: boletos.filter(b => b.status === 'overdue').length,
    };
  }, [boletos]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      paid: { label: 'Pago', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle2 },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      overdue: { label: 'Vencido', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100', icon: XCircle },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.className}`}>
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </span>
    );
  };

  const uniqueApis = useMemo(() => {
    if (!boletos) return [];
    return Array.from(new Set(boletos.map(b => b.apiProvider)));
  }, [boletos]);

  if (uploadLoading || boletosLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (!upload) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Upload não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="-ml-4 mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">Detalhes do Upload</h1>
            <p className="text-lg text-muted-foreground">
              Visualize os boletos gerados por este upload
            </p>
          </div>
        </div>

        {/* Upload Info */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {upload.fileName}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-base mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                {upload.apiProvider.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(upload.createdAt)}
              </span>
              <span>
                {upload.status === 'success' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Sucesso
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 font-semibold">
                    <XCircle className="h-4 w-4" />
                    Erro
                  </span>
                )}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Boletos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.paid}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vencidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Período</label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="15">Últimos 15 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">API</label>
                <Select value={apiFilter} onValueChange={setApiFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueApis.map(api => (
                      <SelectItem key={api} value={api}>{api.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boletos Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Boletos Gerados</CardTitle>
            <CardDescription className="text-base">
              {filteredBoletos.length} boleto(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBoletos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nosso Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Criação</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBoletos.map((boleto) => (
                      <TableRow key={boleto.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{boleto.nossoNumero}</TableCell>
                        <TableCell>{boleto.customerName}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(boleto.value)}</TableCell>
                        <TableCell>{formatDate(boleto.createdAt)}</TableCell>
                        <TableCell>{formatDate(boleto.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(boleto.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                Nenhum boleto encontrado com os filtros selecionados
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
