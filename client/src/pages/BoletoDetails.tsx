import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Edit, 
  FileText, 
  Hash, 
  Mail, 
  Trash2, 
  User, 
  XCircle,
  AlertTriangle,
  Download,
  Ban
} from "lucide-react";
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function BoletoDetails() {
  const [, params] = useRoute("/boleto/:id");
  const [, setLocation] = useLocation();
  const boletoId = params?.id ? parseInt(params.id) : 0;

  const { data: boleto, isLoading } = trpc.boleto.getById.useQuery({ id: boletoId });
  const updateMutation = trpc.boleto.update.useMutation();
  const deleteMutation = trpc.boleto.delete.useMutation();
  const cancelMutation = trpc.boleto.cancel.useMutation();
  const utils = trpc.useUtils();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [editForm, setEditForm] = useState({
    customerName: '',
    customerEmail: '',
    customerDocument: '',
    value: '',
    dueDate: '',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any; bgClass: string }> = {
      pending: { 
        label: 'Pendente', 
        className: 'text-yellow-800 dark:text-yellow-100',
        bgClass: 'bg-yellow-100 dark:bg-yellow-900',
        icon: Clock 
      },
      paid: { 
        label: 'Pago', 
        className: 'text-green-800 dark:text-green-100',
        bgClass: 'bg-green-100 dark:bg-green-900',
        icon: CheckCircle2 
      },
      cancelled: { 
        label: 'Cancelado', 
        className: 'text-red-800 dark:text-red-100',
        bgClass: 'bg-red-100 dark:bg-red-900',
        icon: XCircle 
      },
      overdue: { 
        label: 'Vencido', 
        className: 'text-gray-800 dark:text-gray-100',
        bgClass: 'bg-gray-100 dark:bg-gray-900',
        icon: AlertTriangle 
      },
    };

    return statusMap[status] || statusMap.pending;
  };

  const handleEdit = () => {
    if (!boleto) return;
    
    setEditForm({
      customerName: boleto.customerName,
      customerEmail: boleto.customerEmail || '',
      customerDocument: boleto.customerDocument || '',
      value: (boleto.value / 100).toFixed(2),
      dueDate: new Date(boleto.dueDate).toISOString().split('T')[0],
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateMutation.mutateAsync({
        id: boletoId,
        customerName: editForm.customerName,
        customerEmail: editForm.customerEmail || undefined,
        customerDocument: editForm.customerDocument || undefined,
        value: Math.round(parseFloat(editForm.value) * 100),
        dueDate: new Date(editForm.dueDate),
      });

      utils.boleto.getById.invalidate({ id: boletoId });
      utils.boleto.list.invalidate();
      setShowEditModal(false);
      toast.success('Boleto atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar boleto');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: boletoId });
      toast.success('Boleto excluído com sucesso');
      setLocation('/boletos');
    } catch (error) {
      toast.error('Erro ao excluir boleto');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id: boletoId });
      utils.boleto.getById.invalidate({ id: boletoId });
      utils.boleto.list.invalidate();
      setShowCancelModal(false);
      toast.success('Boleto cancelado com sucesso');
    } catch (error) {
      toast.error('Erro ao cancelar boleto');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!boleto) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setLocation('/boletos')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Boleto não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusInfo(boleto.status);
  const StatusIcon = statusInfo.icon;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Button variant="ghost" onClick={() => setLocation('/boletos')} className="-ml-4 mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Boletos
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">Boleto #{boleto.nossoNumero}</h1>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bgClass} ${statusInfo.className}`}>
                <StatusIcon className="h-4 w-4" />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              Detalhes completos do boleto
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {boleto.status !== 'cancelled' && boleto.status !== 'paid' && (
              <>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" onClick={() => setShowCancelModal(true)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </>
            )}
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informações do Cliente */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-semibold text-lg">{boleto.customerName}</p>
                  </div>
                </div>

                {boleto.customerEmail && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{boleto.customerEmail}</p>
                    </div>
                  </div>
                )}

                {boleto.customerDocument && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                      <p className="font-semibold">{boleto.customerDocument}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Boleto */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Informações do Boleto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Hash className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Nosso Número</p>
                    <p className="font-semibold text-lg">{boleto.nossoNumero}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-bold text-2xl text-primary">{formatCurrency(boleto.value)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                    <p className="font-semibold text-lg">{formatDate(boleto.dueDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">API</p>
                    <p className="font-semibold text-lg">{boleto.apiProvider.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data de Criação</p>
                    <p className="font-semibold">{formatDateTime(boleto.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Última Atualização</p>
                    <p className="font-semibold">{formatDateTime(boleto.updatedAt)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {boleto.externalId && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ID Externo</p>
                      <p className="font-mono text-sm">{boleto.externalId}</p>
                    </div>
                  )}
                  {boleto.barcode && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Código de Barras</p>
                      <p className="font-mono text-sm">{boleto.barcode}</p>
                    </div>
                  )}
                </div>
              </div>

              {boleto.boletoUrl && (
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={boleto.boletoUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Boleto PDF
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Boleto</DialogTitle>
            <DialogDescription>
              Atualize as informações do boleto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Cliente</Label>
              <Input
                id="edit-name"
                value={editForm.customerName}
                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.customerEmail}
                onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-document">CPF/CNPJ</Label>
              <Input
                id="edit-document"
                value={editForm.customerDocument}
                onChange={(e) => setEditForm({ ...editForm, customerDocument: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">Valor (R$)</Label>
              <Input
                id="edit-value"
                type="number"
                step="0.01"
                value={editForm.value}
                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-yellow-600" />
              Cancelar Boleto
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este boleto? Esta ação também cancelará o boleto na API {boleto.apiProvider.toUpperCase()}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Não, voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? 'Cancelando...' : 'Sim, cancelar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Excluir Boleto
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este boleto? Esta ação removerá todos os registros e cancelará o boleto na API {boleto.apiProvider.toUpperCase()}. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Excluindo...' : 'Sim, excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
